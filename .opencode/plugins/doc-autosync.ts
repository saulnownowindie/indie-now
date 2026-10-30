import { Plugin } from "@opencode/plugin"

import { execFile } from "node:child_process"
import { createHash } from "node:crypto"
import { appendFileSync, existsSync } from "node:fs"
import {
  mkdir,
  readFile,
  rename,
  stat,
  unlink,
  writeFile,
} from "node:fs/promises"
import { basename, dirname, join, resolve } from "node:path"
import { promisify } from "node:util"

const execFileAsync = promisify(execFile)

const PLUGIN_ID = "doc-autosync"
const DEFAULT_AGENT = "documentador"
const DEFAULT_DEBOUNCE_MS = 5_000
const DEFAULT_COOLDOWN_MS = 5 * 60_000

const DEFAULT_PROMPT =
  "Actualiza la documentación en docs/ con los cambios recientes. " +
  "Usa git diff para ver qué se modificó desde la última actualización y " +
  "actualiza solo las secciones afectadas de MANUAL_DE_USUARIO.md, " +
  "ARQUITECTURA.md y DECISIONES.md."

/**
 * Evita que el plugin se registre dos veces cuando el mismo archivo se carga
 * desde la raíz del workspace y desde el repositorio.
 */
const GUARD = Symbol.for("indie-now.doc-autosync")

/** Rutas que nunca disparan una actualización de documentación. */
const IGNORED_PREFIXES = [
  "docs/",
  ".opencode/",
  ".git/",
  ".swarm/",
  ".cac/",
  "node_modules/",
  "dist/",
  "build/",
  "coverage/",
  ".vite/",
  ".turbo/",
  ".vercel/",
]

const IGNORED_FILES = new Set([
  "package-lock.json",
  "pnpm-lock.yaml",
  "yarn.lock",
  "bun.lockb",
  "bun.lock",
  ".DS_Store",
])

/** Archivos binarios o generados que no aportan información a la documentación. */
const IGNORED_EXTENSIONS =
  /\.(png|jpe?g|gif|webp|avif|svg|ico|bmp|tiff?|mp4|webm|mov|avi|mkv|mp3|wav|ogg|flac|m4a|woff2?|ttf|otf|eot|zip|rar|7z|gz|tar|pdf|psd|ai|eps|wasm|map|log|tmp|temp|bak|orig)$/i

type RunStatus = "baseline" | "success" | "error"

type DocSyncState = {
  version: 1
  lastCommit?: string
  lastFingerprint?: string
  lastDocumentedAt?: string
  lastRunStatus?: RunStatus
  lastError?: string
  lastErrorAt?: string
  lastSessionID?: string
}

type PluginContext = Parameters<typeof Plugin.define>[0] extends {
  setup: (context: infer Context) => unknown
}
  ? Context
  : never

function log(message: string) {
  console.log(`[${PLUGIN_ID}] ${message}`)

  // Diagnóstico opcional: DOC_AUTOSYNC_DEBUG=1 escribe también en un archivo.
  if (process.env.DOC_AUTOSYNC_DEBUG !== "1") return

  try {
    appendFileSync(
      "/tmp/opencode/doc-autosync-debug.log",
      `${new Date().toISOString()} [${PLUGIN_ID}] ${message}\n`,
    )
  } catch {
    // El log de diagnóstico es opcional.
  }
}

function errorMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  return String(error)
}

function toPositiveNumber(value: unknown, fallback: number): number {
  const number = typeof value === "number" ? value : Number(value)
  return Number.isFinite(number) && number >= 0 ? number : fallback
}

type ModelRef = { providerID: string; id: string }

function parseModel(value: unknown): ModelRef | undefined {
  if (typeof value === "string" && value.includes("/")) {
    const separator = value.indexOf("/")
    const providerID = value.slice(0, separator)
    const id = value.slice(separator + 1)
    if (providerID && id) return { providerID, id }
  }

  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>
    if (
      typeof record.providerID === "string" &&
      typeof record.id === "string"
    ) {
      return { providerID: record.providerID, id: record.id }
    }
  }

  return undefined
}

function normalizePath(path: string): string {
  return path.replaceAll("\\", "/").replace(/^\.\//, "")
}

function isRelevant(path: string): boolean {
  const normalized = normalizePath(path)
  if (!normalized) return false
  if (IGNORED_FILES.has(normalized)) return false
  if (
    IGNORED_PREFIXES.some(
      (prefix) =>
        normalized === prefix.slice(0, -1) || normalized.startsWith(prefix),
    )
  ) {
    return false
  }
  return !IGNORED_EXTENSIONS.test(normalized)
}

async function git(repo: string, args: string[]): Promise<string> {
  const { stdout } = await execFileAsync("git", ["-C", repo, ...args], {
    maxBuffer: 16 * 1024 * 1024,
    windowsHide: true,
  })
  return stdout
}

async function gitToplevel(directory: string): Promise<string | null> {
  if (!existsSync(directory)) return null
  try {
    const output = await git(directory, ["rev-parse", "--show-toplevel"])
    return output.trim() || null
  } catch {
    return null
  }
}

/**
 * Busca el repositorio `indie-now` a partir del directorio de la sesión.
 * La raíz del workspace no es un repositorio, así que se prueban tanto el
 * directorio actual como su subcarpeta `indie-now`, subiendo por los padres.
 */
async function resolveRepo(
  ctx: PluginContext,
  configured?: string,
): Promise<string | null> {
  if (configured) {
    const absolute = resolve(configured)
    const top = await gitToplevel(absolute)
    return top ?? (existsSync(join(absolute, ".git")) ? absolute : null)
  }

  const start = resolve(ctx.location?.directory || process.cwd())
  const seen = new Set<string>()
  let directory = start

  for (let depth = 0; depth < 8; depth += 1) {
    for (const candidate of [directory, join(directory, "indie-now")]) {
      if (seen.has(candidate)) continue
      seen.add(candidate)
      const top = await gitToplevel(candidate)
      if (top && basename(top) === "indie-now") return top
    }

    const parent = dirname(directory)
    if (parent === directory) break
    directory = parent
  }

  log(`no se encontró un repositorio llamado indie-now desde ${start}`)
  return null
}

/**
 * Reúne los archivos relevantes modificados desde el último commit
 * documentado: commits nuevos, cambios sin confirmar y archivos sin seguimiento.
 */
async function collectChanges(
  repo: string,
  lastCommit: string | undefined,
): Promise<string[]> {
  const paths = new Set<string>()

  if (lastCommit) {
    try {
      const committed = await git(repo, [
        "diff",
        "--name-only",
        "-z",
        `${lastCommit}..HEAD`,
      ])
      for (const path of committed.split("\0")) {
        if (path) paths.add(normalizePath(path))
      }
    } catch (error) {
      log(`no se pudo comparar con ${lastCommit}: ${errorMessage(error)}`)
    }
  }

  const status = await git(repo, [
    "status",
    "--porcelain=v1",
    "-z",
    "--untracked-files=all",
  ])
  const parts = status.split("\0")

  for (let index = 0; index < parts.length; index += 1) {
    const entry = parts[index]
    if (!entry) continue

    const code = entry.slice(0, 2)
    const path = entry.slice(3)
    if (code[0] === "R" || code[0] === "C") {
      // En renombrados/copias el siguiente fragmento es la ruta original.
      index += 1
    }
    if (path) paths.add(normalizePath(path))
  }

  return [...paths].filter(isRelevant).sort()
}

/**
 * Huella del estado real del repositorio. Incluye el commit actual y el
 * contenido de cada archivo relevante, para no repetir la misma actualización
 * cuando no hubo cambios de fondo.
 */
async function fingerprint(
  repo: string,
  head: string,
  files: string[],
): Promise<string> {
  const hash = createHash("sha256")
  hash.update(`head:${head}\n`)

  for (const file of files) {
    hash.update(`path:${file}\n`)
    const absolute = join(repo, file)

    try {
      const info = await stat(absolute)
      if (!info.isFile()) {
        hash.update("not-a-file\n")
        continue
      }
      if (info.size > 2 * 1024 * 1024) {
        hash.update(`large:${info.size}:${info.mtimeMs}\n`)
        continue
      }
      hash.update(await readFile(absolute))
      hash.update("\n")
    } catch {
      hash.update("missing\n")
    }
  }

  return hash.digest("hex")
}

function stateFilePath(repo: string, configured?: string): string {
  return configured
    ? resolve(repo, configured)
    : join(repo, ".opencode", "doc-sync-state.json")
}

async function readState(file: string): Promise<DocSyncState | null> {
  try {
    const raw = await readFile(file, "utf8")
    const parsed = JSON.parse(raw) as unknown
    if (!parsed || typeof parsed !== "object") return null
    return parsed as DocSyncState
  } catch {
    return null
  }
}

async function writeState(file: string, state: DocSyncState): Promise<void> {
  await mkdir(dirname(file), { recursive: true })
  const temporary = `${file}.${process.pid}.tmp`
  await writeFile(temporary, `${JSON.stringify(state, null, 2)}\n`, "utf8")

  try {
    await rename(temporary, file)
  } catch (error) {
    await unlink(temporary).catch(() => {})
    throw error
  }
}

export default Plugin.define({
  id: PLUGIN_ID,

  async setup(ctx) {
    const global = globalThis as Record<PropertyKey, unknown>
    const previousInstance = global[GUARD] as
      | { active?: boolean }
      | undefined

    if (previousInstance?.active) {
      log("ya está activo en otra instancia; se omite esta carga")
      return
    }

    const options = (ctx.options ?? {}) as Record<string, unknown>
    if (options.enabled === false) {
      log("deshabilitado por configuración")
      return
    }

    const agent =
      typeof options.agent === "string" && options.agent
        ? options.agent
        : DEFAULT_AGENT
    const prompt =
      typeof options.prompt === "string" && options.prompt
        ? options.prompt
        : DEFAULT_PROMPT
    const repoOption =
      typeof options.repo === "string" ? options.repo : undefined
    const stateOption =
      typeof options.stateFile === "string" ? options.stateFile : undefined
    const modelOption = parseModel(options.model)
    const debounceMs = toPositiveNumber(
      options.debounceMs,
      DEFAULT_DEBOUNCE_MS,
    )
    const cooldownMs = toPositiveNumber(
      options.cooldownMs,
      DEFAULT_COOLDOWN_MS,
    )

    const marker = { active: true }
    const ownSessions = new Set<string>()
    const controller = new AbortController()

    let timer: ReturnType<typeof setTimeout> | undefined
    let idleRegistration: { dispose: () => Promise<void> } | undefined
    let running = false
    let stopped = false

    global[GUARD] = marker

    const check = async (
      reason: string,
      triggerSessionID?: string,
    ): Promise<void> => {
      if (running || stopped) return

      const repo = await resolveRepo(ctx, repoOption)
      if (!repo) return

      let head: string
      try {
        head = (await git(repo, ["rev-parse", "HEAD"])).trim()
      } catch (error) {
        log(`no se pudo leer HEAD: ${errorMessage(error)}`)
        return
      }

      const file = stateFilePath(repo, stateOption)
      const previous = await readState(file)
      const files = await collectChanges(repo, previous?.lastCommit)
      const current = await fingerprint(repo, head, files)

      // Primer arranque: se guarda una línea base sin invocar al agente.
      if (!previous) {
        await writeState(file, {
          version: 1,
          lastCommit: head,
          lastFingerprint: current,
          lastDocumentedAt: new Date().toISOString(),
          lastRunStatus: "baseline",
        })
        log(
          `estado inicial en ${head.slice(0, 7)} ` +
            `(${files.length} archivo(s) relevantes)`,
        )
        return
      }

      if (current === previous.lastFingerprint) {
        log("sin cambios relevantes; no se actualiza la documentación")
        return
      }

      if (previous.lastRunStatus === "error" && previous.lastErrorAt) {
        const elapsed = Date.now() - Date.parse(previous.lastErrorAt)
        if (Number.isFinite(elapsed) && elapsed < cooldownMs) {
          const remaining = Math.ceil((cooldownMs - elapsed) / 1000)
          log(`error reciente; reintento en ${remaining}s`)
          return
        }
      }

      running = true

      try {
        // El agente documentador hereda el modelo de la sesión que disparó el
        // evento. Así usa un proveedor que ya está funcionando y no depende
        // del modelo por defecto del proyecto.
        let model = modelOption
        if (!model && triggerSessionID) {
          try {
            const trigger = await ctx.session.get({
              sessionID: triggerSessionID,
            })
            if (trigger?.model?.providerID && trigger.model.id) {
              model = {
                providerID: trigger.model.providerID,
                id: trigger.model.id,
              }
            }
          } catch (error) {
            log(
              `no se pudo leer el modelo de ${triggerSessionID}: ` +
                errorMessage(error),
            )
          }
        }

        log(
          `cambios detectados (${files.length} archivo(s), ${reason}); ` +
            `se inicia ${agent}${model ? ` con ${model.providerID}/${model.id}` : ""}`,
        )

        const session = await ctx.session.create({
          title: "docs: actualización automática",
          agent,
          ...(model ? { model } : {}),
          location: { directory: repo },
        })
        ownSessions.add(session.id)

        await ctx.session.prompt({ sessionID: session.id, text: prompt })
        await ctx.session.wait({ sessionID: session.id })

        const result = await ctx.session.get({ sessionID: session.id })
        if (result?.outcome && result.outcome !== "succeeded") {
          throw new Error(
            `la sesión ${agent} terminó con estado "${result.outcome}"`,
          )
        }

        // La huella se recalcula tomando `head` como nuevo punto de partida.
        // Si se guardara la huella calculada contra el commit anterior, la
        // siguiente comprobación vería un conjunto de archivos distinto y
        // lanzaría una actualización redundante.
        const nextFiles = await collectChanges(repo, head)
        const nextFingerprint = await fingerprint(repo, head, nextFiles)

        await writeState(file, {
          version: 1,
          lastCommit: head,
          lastFingerprint: nextFingerprint,
          lastDocumentedAt: new Date().toISOString(),
          lastRunStatus: "success",
          lastSessionID: session.id,
        })
        log(`documentación actualizada (sesión ${session.id})`)
      } catch (error) {
        await writeState(file, {
          ...previous,
          lastRunStatus: "error",
          lastError: errorMessage(error),
          lastErrorAt: new Date().toISOString(),
        }).catch(() => {})

        log(`error al actualizar la documentación: ${errorMessage(error)}`)
      } finally {
        running = false
      }
    }

    const schedule = (sessionID: string, reason: string): void => {
      if (stopped) return
      if (ownSessions.has(sessionID)) return
      if (timer) clearTimeout(timer)

      timer = setTimeout(() => {
        timer = undefined
        void check(reason, sessionID)
      }, debounceMs)
    }

    // Hook nativo del servidor: se ejecuta justo antes de que una sesión quede
    // inactiva. Es el disparador principal porque funciona aunque la
    // suscripción al evento `session.idle` no esté disponible.
    try {
      idleRegistration = await ctx.session.hook("experimental.idle", (input) => {
        const sessionID = input?.sessionID
        if (!sessionID) return
        log(`hook experimental.idle para ${sessionID}`)
        schedule(sessionID, "experimental.idle")
      })
    } catch (error) {
      log(
        `no se pudo registrar el hook experimental.idle: ` +
          errorMessage(error),
      )
    }

    // La suscripción al evento se ejecuta en segundo plano para no bloquear
    // `setup`. Se mantiene como respaldo del hook.
    void (async () => {
      try {
        for await (const event of ctx.event.subscribe({
          types: ["session.idle"],
          signal: controller.signal,
        })) {
          if (stopped) break

          const sessionID = event.data?.sessionID
          if (!sessionID) continue

          log(`evento session.idle para ${sessionID}`)
          schedule(sessionID, "session.idle")
        }
      } catch (error) {
        if (!stopped) {
          log(`suscripción a eventos interrumpida: ${errorMessage(error)}`)
        }
      }
    })()

    log(
      `activo (agente: ${agent}, debounce: ${debounceMs}ms, ` +
        `repo: ${repoOption ?? "automático"})`,
    )

    return () => {
      stopped = true
      controller.abort()
      if (timer) clearTimeout(timer)
      void idleRegistration?.dispose()

      if (global[GUARD] === marker) {
        delete global[GUARD]
      }

      log("detenido")
    }
  },
})
