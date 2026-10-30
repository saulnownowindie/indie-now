import "../NewsModal/NewsModal.css";
import "./ReelModal.css";

import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import ImageUploader from "../../ui/ImageUploader";
import Select from "../../ui/Select";

import {
  createReel,
  getReelCoverFromUrl,
  requestReelPreview,
  updateReel,
  uploadReelAsset,
} from "../../../../services/reelsService";
import { makePreview } from "../../../../utils/makePreview";
import { resolveMediaUrl } from "../../../../utils/mediaUrl";

const platforms = [
  {
    value: "INSTAGRAM",
    label: "Instagram",
  },
  {
    value: "TIKTOK",
    label: "TikTok",
  },
  {
    value: "YOUTUBE",
    label: "YouTube",
  },
];

const platformLabels = {
  INSTAGRAM: "Instagram",
  TIKTOK: "TikTok",
  YOUTUBE: "YouTube",
  FACEBOOK: "Facebook",
  X: "X",
  THREADS: "Threads",
  OTHER: "Otro",
};

const statuses = [
  {
    value: "DRAFT",
    label: "Borrador",
  },
  {
    value: "PUBLISHED",
    label: "Publicado",
  },
];

const homeSections = [
  { value: "LO_NUEVO", label: "Lo Nuevo Que Vale" },
  { value: "NOTICIAS", label: "Noticias" },
  { value: "REELS", label: "Reels" },
  { value: "NO_PODES_PERDERTE", label: "No Podés Perderte" },
];

const MAX_PREVIEW_BYTES = 2 * 1024 * 1024;

const previewStatusLabels = {
  ready: "Preview listo",
  pending: "Preview pendiente",
  processing: "Procesando…",
  failed: "Sin preview",
};

const emptyForm = {
  title: "",
  platform: "",
  url: "",
  videoUrl: "",
  previewStart: "1",
  status: "DRAFT",
  homeSection: "REELS",
  sortOrder: "0",
};

function getErrorMessage(error, fallback) {
  return (
    error.response?.data?.message ||
    error.message ||
    fallback
  );
}

export default function ReelModal({ onClose, reel = null }) {
  const queryClient = useQueryClient();

  const isEditing = Boolean(reel);

  const [form, setForm] = useState({
    title: reel?.title ?? "",
    platform: reel?.platform ?? "",
    url: reel?.url ?? "",
    videoUrl: reel?.videoUrl ?? "",
    previewStart: String(reel?.previewStart ?? emptyForm.previewStart),
    status: reel?.status ?? emptyForm.status,
    homeSection: reel?.homeSection ?? emptyForm.homeSection,
    sortOrder: String(reel?.sortOrder ?? emptyForm.sortOrder),
  });
  const [coverFile, setCoverFile] = useState(null);
  const [existingCoverUrl, setExistingCoverUrl] = useState(
    resolveMediaUrl(reel?.coverImage?.url || reel?.coverUrl),
  );
  const [removeCover, setRemoveCover] = useState(false);
  const [extractedCoverId, setExtractedCoverId] = useState(null);
  const [coverFetching, setCoverFetching] = useState(false);
  const [coverError, setCoverError] = useState("");
  const [coverNotice, setCoverNotice] = useState("");

  const [previewFile, setPreviewFile] = useState(null);
  const [previewFileUrl, setPreviewFileUrl] = useState("");
  const [previewDuration, setPreviewDuration] = useState(0);
  const [generatedPreview, setGeneratedPreview] = useState(() =>
    reel?.previewUrl && reel?.posterUrl
      ? {
          clipUrl: reel.previewUrl,
          posterUrl: reel.posterUrl,
          isNew: false,
          size: 0,
        }
      : null,
  );
  const [generating, setGenerating] = useState(false);
  const [previewError, setPreviewError] = useState("");
  const [previewNotice, setPreviewNotice] = useState("");
  const [workerLoading, setWorkerLoading] = useState(false);

  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const autoCoverUrl = useRef("");

  const supportsMediaRecorder =
    typeof window !== "undefined" && Boolean(window.MediaRecorder);

  const platformOptions =
    reel?.platform && !platforms.some((item) => item.value === reel.platform)
      ? [
          ...platforms,
          {
            value: reel.platform,
            label: platformLabels[reel.platform] || reel.platform,
          },
        ]
      : platforms;

  useEffect(() => {
    return () => {
      if (previewFileUrl) {
        URL.revokeObjectURL(previewFileUrl);
      }
    };
  }, [previewFileUrl]);

  useEffect(() => {
    return () => {
      if (generatedPreview?.isNew) {
        URL.revokeObjectURL(generatedPreview.clipUrl);
        URL.revokeObjectURL(generatedPreview.posterUrl);
      }
    };
  }, [generatedPreview]);

  function updateField(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    if (errors[field] || errors.submit) {
      setErrors((current) => ({
        ...current,
        [field]: "",
        submit: "",
      }));
    }
  }

  function handleCoverChange(file) {
    setCoverFile(file);
    setExtractedCoverId(null);

    if (file) {
      setRemoveCover(false);
      setCoverError("");
      setCoverNotice("");
      return;
    }

    setExistingCoverUrl(null);
    setRemoveCover(true);
  }

  async function handleFetchCover({ silent = false } = {}) {
    const url = form.url.trim();

    if (!url) {
      if (!silent) {
        setCoverError("Ingresa primero la URL del video.");
      }
      return;
    }

    try {
      new URL(url);
    } catch {
      if (!silent) {
        setCoverError("Ingresa una URL válida.");
      }
      return;
    }

    setCoverFetching(true);
    setCoverError("");
    setCoverNotice("");

    try {
      const result = await getReelCoverFromUrl(url);

      autoCoverUrl.current = url;

      if (result?.manual) {
        setCoverNotice(
          result.message ||
            "Instagram no permite obtener la portada automáticamente. Subila a mano.",
        );
        return;
      }

      if (!result?.coverUrl) {
        throw new Error("La plataforma no devolvió una portada.");
      }

      setExistingCoverUrl(resolveMediaUrl(result.coverUrl));
      setExtractedCoverId(result.media?.id ?? null);
      setCoverFile(null);
      setRemoveCover(false);
      setCoverNotice("Portada obtenida correctamente.");
    } catch (error) {
      if (!silent) {
        setCoverError(
          getErrorMessage(error, "No se pudo obtener la portada."),
        );
      }
    } finally {
      setCoverFetching(false);
    }
  }

  function handleUrlBlur() {
    const url = form.url.trim();

    if (
      !url ||
      coverFile ||
      coverFetching ||
      autoCoverUrl.current === url
    ) {
      return;
    }

    handleFetchCover({ silent: true });
  }

  function handlePreviewFileChange(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("video/")) {
      setPreviewError("Selecciona un archivo de video válido.");
      return;
    }

    setPreviewFile(file);
    setPreviewDuration(0);
    setPreviewError("");
    setPreviewNotice("");
    setGeneratedPreview(null);
    setPreviewFileUrl(URL.createObjectURL(file));
  }

  async function handleGeneratePreview() {
    if (!previewFile) {
      setPreviewError("Selecciona primero un video para sacar el preview.");
      return;
    }

    if (!supportsMediaRecorder) {
      setPreviewError(
        "Este navegador no soporta la generación de previews. Usa el worker o una PC.",
      );
      return;
    }

    setGenerating(true);
    setPreviewError("");
    setPreviewNotice("");

    try {
      const start = Number(form.previewStart) || 0;
      const result = await makePreview(previewFile, start, 4, 360);

      if (!result.poster) {
        throw new Error("No se pudo generar el poster del preview.");
      }

      setGeneratedPreview({
        ...result,
        clipUrl: URL.createObjectURL(result.clip),
        posterUrl: URL.createObjectURL(result.poster),
        isNew: true,
      });

      if (result.clip.size > MAX_PREVIEW_BYTES) {
        setPreviewError(
          `El clip pesa ${(result.clip.size / (1024 * 1024)).toFixed(1)} MB. Probá con un inicio más cercano o una duración menor antes de guardar.`,
        );
      } else {
        setPreviewNotice(
          "Preview generado. Se subirá a Cloudinary al guardar.",
        );
      }
    } catch (error) {
      setPreviewError(
        getErrorMessage(error, "No se pudo generar el preview."),
      );
    } finally {
      setGenerating(false);
    }
  }

  function validateForm() {
    const newErrors = {};
    const title = form.title.trim();
    const url = form.url.trim();

    if (!title) {
      newErrors.title = "El título es obligatorio.";
    } else if (title.length < 3) {
      newErrors.title = "El título debe tener al menos 3 caracteres.";
    }

    if (!form.platform) {
      newErrors.platform = "Selecciona una plataforma.";
    }

    const sortOrder = Number(form.sortOrder);

    if (
      form.sortOrder === "" ||
      !Number.isInteger(sortOrder) ||
      sortOrder < 0
    ) {
      newErrors.sortOrder =
        "Ingresa un número entero mayor o igual a 0.";
    }

    if (!url) {
      newErrors.url = "La URL es obligatoria.";
    } else {
      try {
        const parsedUrl = new URL(url);

        if (!["http:", "https:"].includes(parsedUrl.protocol)) {
          throw new Error("Protocolo no válido");
        }
      } catch {
        newErrors.url = "Ingresa una URL válida.";
      }
    }

    const videoUrl = form.videoUrl.trim();

    if (videoUrl) {
      try {
        const parsedUrl = new URL(videoUrl);

        if (!["http:", "https:"].includes(parsedUrl.protocol)) {
          throw new Error("Protocolo no válido");
        }
      } catch {
        newErrors.videoUrl = "Ingresa una URL de video válida.";
      }
    }

    const previewStart = Number(form.previewStart);

    if (
      form.previewStart === "" ||
      Number.isNaN(previewStart) ||
      previewStart < 0 ||
      previewStart > 600
    ) {
      newErrors.previewStart =
        "El segundo inicial debe estar entre 0 y 600.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  async function buildPayload() {
    const payload = {
      title: form.title.trim(),
      platform: form.platform,
      url: form.url.trim(),
      videoUrl: form.videoUrl.trim() || null,
      previewStart: Number(form.previewStart) || 0,
      status: form.status,
      homeSection: form.homeSection,
      sortOrder: Number(form.sortOrder),
    };

    if (coverFile) {
      payload.coverUrl = await uploadReelAsset(coverFile, {
        resourceType: "image",
        folder: "reels-covers",
      });
      payload.coverImageId = null;
    } else if (extractedCoverId) {
      payload.coverImageId = extractedCoverId;
      payload.coverUrl = null;
    } else if (removeCover) {
      payload.coverImageId = null;
      payload.coverUrl = null;
    }

    return payload;
  }

  async function attachGeneratedPreview(payload) {
    if (!generatedPreview?.isNew) {
      return payload;
    }

    if (generatedPreview.clip.size > MAX_PREVIEW_BYTES) {
      throw new Error(
        "El preview supera los 2 MB. Generá uno más liviano antes de guardar.",
      );
    }

    const [previewUrl, posterUrl] = await Promise.all([
      uploadReelAsset(generatedPreview.clip, {
        resourceType: "video",
        folder: "reels-previews",
      }),
      uploadReelAsset(generatedPreview.poster, {
        resourceType: "image",
        folder: "reels-previews",
      }),
    ]);

    payload.previewUrl = previewUrl;
    payload.posterUrl = posterUrl;

    return payload;
  }

  async function invalidateReels() {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["reels"] }),
      queryClient.invalidateQueries({ queryKey: ["public-reels"] }),
    ]);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (saving || !validateForm()) {
      return;
    }

    setSaving(true);
    setPreviewError("");
    setPreviewNotice("");

    try {
      const payload = await attachGeneratedPreview(await buildPayload());

      if (isEditing) {
        await updateReel(reel.id, payload);
      } else {
        await createReel(payload);
      }

      await invalidateReels();
      onClose();
    } catch (error) {
      setErrors({
        submit: getErrorMessage(
          error,
          "No se pudo guardar el reel. Intenta nuevamente.",
        ),
      });
    } finally {
      setSaving(false);
    }
  }

  async function handleWorkerPreview() {
    if (workerLoading || saving) {
      return;
    }

    if (!validateForm()) {
      return;
    }

    setWorkerLoading(true);
    setPreviewError("");
    setPreviewNotice("");

    let createdId = null;

    try {
      if (isEditing) {
        await updateReel(reel.id, await buildPayload());
      } else {
        const created = await createReel(await buildPayload());
        createdId = created.id;
      }

      const id = createdId ?? reel.id;

      await requestReelPreview(
        id,
        Number(form.previewStart) || 0,
        Boolean(reel?.previewUrl),
      );

      await invalidateReels();
      onClose();
    } catch (error) {
      if (createdId) {
        await invalidateReels();
        setErrors({
          submit:
            "El reel se creó, pero no se pudo encolar el preview. Editalo para reintentar.",
        });
      } else {
        setPreviewError(
          getErrorMessage(
            error,
            "No se pudo encolar el preview para el worker.",
          ),
        );
      }
    } finally {
      setWorkerLoading(false);
    }
  }

  function handleClose() {
    if (saving || workerLoading || generating) {
      return;
    }

    onClose();
  }

  const reelPreviewStatus = generatedPreview?.isNew
    ? "ready"
    : reel?.previewStatus || (reel?.previewUrl ? "ready" : null);
  const previewStatusText = generatedPreview?.isNew
    ? "Preview generado"
    : previewStatusLabels[reelPreviewStatus] || "Sin preview";

  const previewStart = Number(form.previewStart) || 0;
  const sliderMax = previewFile
    ? Math.min(600, Math.max(1, Math.floor(previewDuration || 1)))
    : 600;

  return (
    <div
      className="modal-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          handleClose();
        }
      }}
    >
      <form className="modal reel-modal" onSubmit={handleSubmit}>
        <div className="modal-header">
          <h2>{isEditing ? "Editar reel" : "Nuevo reel"}</h2>

          <button
            type="button"
            className="modal-close"
            onClick={handleClose}
            disabled={saving || workerLoading || generating}
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        <div className="modal-body">
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="reel-title">
                Título <span className="required">*</span>
              </label>

              <input
                id="reel-title"
                type="text"
                placeholder="Título del reel"
                value={form.title}
                onChange={(event) =>
                  updateField("title", event.target.value)
                }
                disabled={saving}
                aria-invalid={Boolean(errors.title)}
                aria-describedby={
                  errors.title ? "reel-title-error" : undefined
                }
              />

              {errors.title && (
                <span id="reel-title-error" className="form-error">
                  {errors.title}
                </span>
              )}
            </div>

            <div className="form-group">
              <Select
                label={
                  <>
                    Plataforma <span className="required">*</span>
                  </>
                }
                value={form.platform}
                onValueChange={(value) =>
                  updateField("platform", value)
                }
                placeholder="Selecciona una plataforma"
                disabled={saving}
              >
                {platformOptions.map((platform) => (
                  <Select.Item
                    key={platform.value}
                    value={platform.value}
                  >
                    {platform.label}
                  </Select.Item>
                ))}
              </Select>

              {errors.platform && (
                <span className="form-error">{errors.platform}</span>
              )}
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="reel-url">
                URL del video <span className="required">*</span>
              </label>

              <input
                id="reel-url"
                type="url"
                placeholder="https://www.instagram.com/reel/..."
                value={form.url}
                onChange={(event) =>
                  updateField("url", event.target.value)
                }
                onBlur={handleUrlBlur}
                disabled={saving}
                aria-invalid={Boolean(errors.url)}
                aria-describedby={
                  errors.url ? "reel-url-error" : undefined
                }
              />

              {errors.url && (
                <span id="reel-url-error" className="form-error">
                  {errors.url}
                </span>
              )}
            </div>

            <div className="form-group">
              <Select
                label="Estado"
                value={form.status}
                onValueChange={(value) =>
                  updateField("status", value)
                }
                placeholder="Selecciona un estado"
                disabled={saving}
              >
                {statuses.map((status) => (
                  <Select.Item
                    key={status.value}
                    value={status.value}
                  >
                    {status.label}
                  </Select.Item>
                ))}
              </Select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="reel-video-url">
              URL del video directo (opcional)
            </label>

            <input
              id="reel-video-url"
              type="url"
              placeholder="https://res.cloudinary.com/.../reel.mp4"
              value={form.videoUrl}
              onChange={(event) =>
                updateField("videoUrl", event.target.value)
              }
              disabled={saving}
              aria-invalid={Boolean(errors.videoUrl)}
              aria-describedby={
                errors.videoUrl
                  ? "reel-video-url-error"
                  : "reel-video-url-hint"
              }
            />

            <span id="reel-video-url-hint" className="form-hint">
              Archivo MP4, WebM u OGG. Si lo completás, el reel se
              reproduce automáticamente en la grilla. Si lo dejás
              vacío, se mantiene el enlace social con lightbox.
            </span>

            {errors.videoUrl && (
              <span id="reel-video-url-error" className="form-error">
                {errors.videoUrl}
              </span>
            )}
          </div>

          <div className="form-grid">
            <div className="form-group">
              <Select
                label="Sección de la Home"
                value={form.homeSection}
                onValueChange={(value) =>
                  updateField("homeSection", value)
                }
                placeholder="Selecciona una sección"
                disabled={saving}
              >
                {homeSections.map((section) => (
                  <Select.Item
                    key={section.value}
                    value={section.value}
                  >
                    {section.label}
                  </Select.Item>
                ))}
              </Select>
            </div>

            <div className="form-group">
              <label htmlFor="reel-sort-order">
                Orden de aparición
              </label>

              <input
                id="reel-sort-order"
                type="number"
                min="0"
                step="1"
                value={form.sortOrder}
                onChange={(event) =>
                  updateField("sortOrder", event.target.value)
                }
                disabled={saving}
                aria-invalid={Boolean(errors.sortOrder)}
                aria-describedby={
                  errors.sortOrder
                    ? "reel-sort-order-error"
                    : undefined
                }
              />

              {errors.sortOrder && (
                <span
                  id="reel-sort-order-error"
                  className="form-error"
                >
                  {errors.sortOrder}
                </span>
              )}
            </div>
          </div>

          <div className="reel-cover-tools">
            <button
              type="button"
              className="reel-extract-button"
              onClick={() => handleFetchCover()}
              disabled={saving || coverFetching || !form.url.trim()}
            >
              {coverFetching ? "Obteniendo…" : "Obtener portada"}
            </button>

            <span className="reel-cover-hint">
              YouTube y TikTok traen la miniatura automáticamente.
              Instagram requiere subir la portada a mano.
            </span>
          </div>

          {coverError && (
            <div className="form-error" role="alert">
              {coverError}
            </div>
          )}

          {coverNotice && (
            <div className="reel-form-notice" role="status">
              {coverNotice}
            </div>
          )}

          <ImageUploader
            label="Imagen de portada"
            value={coverFile}
            onChange={handleCoverChange}
            existingUrl={existingCoverUrl}
          />

          <section className="reel-preview-block">
            <div className="reel-preview-heading">
              <h3>Preview animado (opcional)</h3>
              <span
                className={`reel-preview-status reel-preview-status-${reelPreviewStatus || "none"}`}
              >
                {previewStatusText}
              </span>
            </div>

            <p className="reel-cover-hint">
              Clip de 4 s sin audio para la tarjeta. Si tenés el
              archivo, se genera en este navegador y se sube directo
              a Cloudinary. Si solo tenés el enlace, encolalo para el
              worker. El video original nunca se sube.
            </p>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="reel-preview-file">
                  Video para sacar el preview (no se sube)
                </label>

                <input
                  id="reel-preview-file"
                  type="file"
                  accept="video/*"
                  onChange={handlePreviewFileChange}
                  disabled={saving || generating}
                />
              </div>

              <div className="form-group">
                <label htmlFor="reel-preview-start">
                  Segundo inicial: {previewStart}s
                </label>

                <input
                  id="reel-preview-start"
                  type="range"
                  min="0"
                  max={sliderMax}
                  step="0.5"
                  value={Math.min(previewStart, sliderMax)}
                  onChange={(event) =>
                    updateField("previewStart", event.target.value)
                  }
                  disabled={saving || generating}
                />

                {errors.previewStart && (
                  <span className="form-error">
                    {errors.previewStart}
                  </span>
                )}
              </div>
            </div>

            {previewFileUrl && (
              <div className="reel-local-preview">
                <video
                  src={previewFileUrl}
                  controls
                  muted
                  playsInline
                  onLoadedMetadata={(event) =>
                    setPreviewDuration(event.currentTarget.duration || 0)
                  }
                />
                <span className="reel-cover-hint">
                  Elegí el segundo inicial con el control de arriba.
                </span>
              </div>
            )}

            <div className="reel-preview-actions">
              {previewFile && supportsMediaRecorder && (
                <button
                  type="button"
                  className="reel-extract-button"
                  onClick={handleGeneratePreview}
                  disabled={saving || generating}
                >
                  {generating
                    ? "Grabando 4 s, no cambies de pestaña…"
                    : "Generar preview"}
                </button>
              )}

              {!previewFile && !generatedPreview?.isNew && (
                <button
                  type="button"
                  className="reel-extract-button"
                  onClick={handleWorkerPreview}
                  disabled={saving || workerLoading}
                >
                  {workerLoading
                    ? "Encolando…"
                    : "Generar con worker"}
                </button>
              )}

              {isEditing && reel?.previewUrl && !generatedPreview?.isNew && (
                <button
                  type="button"
                  className="reel-extract-button"
                  onClick={handleWorkerPreview}
                  disabled={saving || workerLoading || generating}
                >
                  {workerLoading
                    ? "Encolando…"
                    : "Regenerar preview"}
                </button>
              )}
            </div>

            {!supportsMediaRecorder && (
              <div className="reel-form-notice" role="status">
                Este navegador no puede generar previews. Usá
                “Generar con worker” o una PC con Chrome/Edge.
              </div>
            )}

            {previewError && (
              <div className="form-error" role="alert">
                {previewError}
              </div>
            )}

            {previewNotice && (
              <div className="reel-form-notice" role="status">
                {previewNotice}
              </div>
            )}

            {generatedPreview && (
              <div className="reel-generated-preview">
                <video
                  src={generatedPreview.clipUrl}
                  poster={generatedPreview.posterUrl}
                  autoPlay
                  muted
                  loop
                  playsInline
                />

                <div className="reel-generated-preview-meta">
                  <img
                    src={generatedPreview.posterUrl}
                    alt="Poster del preview"
                  />

                  <span className="reel-cover-hint">
                    {generatedPreview.isNew
                      ? `Clip de ${(generatedPreview.clip.size / 1024).toFixed(0)} KB. Se subirá al guardar.`
                      : "Preview actual del reel."}
                  </span>
                </div>
              </div>
            )}
          </section>

          {errors.submit && (
            <div className="form-error form-error-submit">
              {errors.submit}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="modal-cancel"
            onClick={handleClose}
            disabled={saving || workerLoading || generating}
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="modal-save"
            disabled={saving || workerLoading || generating}
          >
            {saving ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </form>
    </div>
  );
}
