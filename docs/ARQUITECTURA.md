# Arquitectura de Indie Now

> **Última actualización:** 30 de octubre de 2026.

Este documento explica cómo está armado el proyecto en lenguaje sencillo.
No hace falta ser programador para entenderlo: cada término técnico se explica
la primera vez que aparece.

---

## 1. La idea en una frase

Indie Now son **tres piezas que trabajan juntas**: un sitio web, un servidor que
guarda y entrega el contenido, y un pequeño programa que prepara los videos
cortos de los reels.

```
┌─────────────────────┐
│  Visitante / Admin  │
└──────────┬──────────┘
           │ abre el sitio
           ▼
┌─────────────────────┐        ┌──────────────────────┐
│  Sitio web (React)  │───────▶│  API (Node/Express)  │
│  alojado en Vercel  │        │  alojada en Vercel   │
└──────────┬──────────┘        └───────┬──────┬───────┘
           │                           │      │
           │ imágenes y clips          │      │ datos
           ▼                           ▼      ▼
┌─────────────────────┐        ┌──────────────────────┐
│ Cloudinary          │        │ Neon (PostgreSQL)    │
│ fotos y videos      │        │ base de datos        │
└─────────────────────┘        └──────────────────────┘
                                       ▲
                                       │
                              ┌────────┴─────────┐
                              │ Worker (Python)  │
                              │ corre en una PC  │
                              └──────────────────┘
```

---

## 2. Las tres piezas

### 2.1 El sitio web (frontend)

Es lo que ve el público y también el panel de administración.

- **Tecnología:** React 19 + Vite 8.
- **Navegación:** React Router 7 (las direcciones tipo `/noticias` o `/reels`).
- **Datos:** TanStack Query + Axios (pide la información a la API y la guarda
  en caché unos minutos para no repetir pedidos).
- **Componentes de interfaz:** Radix UI, lucide-react y react-icons.
- **Dónde vive:** carpeta `indie-now/`.
- **Dónde se publica:** Vercel.
- **Cómo funciona el ruteo en Vercel:** un archivo `vercel.json` redirige
  cualquier dirección a `index.html`, y React Router decide qué pantalla
  mostrar. Así funcionan los enlaces directos como `/noticias/mi-nota`.

**Dos zonas dentro del mismo sitio:**

| Zona | Direcciones | Quién entra |
| --- | --- | --- |
| Sitio público | `/`, `/noticias`, `/noticias/:slug`, `/reels`, `/merch`, `/resenas`, `/sesiones`, `/no-podes-perderte` | Cualquiera |
| Panel | `/admin`, `/admin/news`, `/admin/reels`, etc. | Solo usuarios con sesión |

La zona `/admin` está protegida: si no hay sesión iniciada, redirige al login.

### 2.2 La API (backend)

Es el "mostrador" al que el sitio le pide los datos. No tiene pantallas: solo
responde pedidos.

- **Tecnología:** Node.js + Express 5.
- **Base de datos:** PostgreSQL alojado en **Neon** (nube, región `sa-east-1`).
- **Acceso a datos:** Prisma 6 (traduce el código a consultas de base de datos).
- **Validación:** Zod (revisa que los datos que llegan sean correctos).
- **Seguridad:** JWT (token de sesión) + bcrypt (contraseñas cifradas).
- **Dónde vive:** carpeta `indie-now-api/`.
- **Dónde se publica:** Vercel, como función serverless.

**¿Qué es serverless?** Es un servidor que se enciende solo cuando alguien hace
un pedido y se apaga cuando termina. Es cómodo y barato, pero **no sirve para
tareas largas** como descargar y recortar videos. Por eso existe el worker.

**Módulos de la API:** cada tema tiene su carpeta con la misma estructura
(`controller`, `service`, `validation`, `routes`):

```
auth, categories, media, liveSessions, merch, news,
playlists, reels, videos, utils, worker
```

La API expone direcciones como `/api/news`, `/api/reels`, `/api/merch`,
`/api/playlists` y `/api/worker`.

### 2.3 El worker (Python)

Es un programa aparte que prepara los **previews** de los reels: clips de 4
segundos sin audio.

- **Tecnología:** Python 3.10+ con `yt-dlp` (descarga videos) y `ffmpeg`
  (recorta y convierte).
- **Dónde vive:** `indie-now-api/worker/`.
- **Dónde corre:** en una computadora (Windows, Linux o macOS), **no** en
  Vercel.
- **Cómo se comunica:** pide trabajo a la API y le avisa cuando termina, usando
  un token secreto (`WORKER_TOKEN`).

**¿Por qué no corre en Vercel?** Porque descargar un video y recortarlo puede
tardar minutos y consumir mucha memoria. Vercel corta ese tipo de tareas. El
worker separado puede trabajar con calma y además se puede copiar a otra PC.

---

## 3. Los servicios externos

### Vercel

Aloja las dos partes web:

- El sitio React (archivos estáticos).
- La API Node (funciones serverless).

Cada repositorio tiene su propio `vercel.json`. En la API, el comando de build
ejecuta `prisma generate && prisma migrate deploy`, es decir, prepara Prisma y
aplica los cambios de base de datos al desplegar.

### Neon (PostgreSQL)

Es la base de datos en la nube. Guarda usuarios, noticias, reels, merch,
playlists, categorías y relaciones entre ellos.

- Se usa la **URL con pooler** para las consultas normales (muchas conexiones
  cortas).
- Se usa la **URL directa** para las migraciones.
- Prisma es la única vía autorizada para consultar la base.

### Cloudinary

Guarda y entrega **imágenes y clips de video**.

- Las portadas, fotos de merch y posters viven acá.
- Los clips de preview de 4 segundos también.
- El sitio pide las imágenes con transformaciones automáticas
  (`f_auto,q_auto`) para que pesen menos y se vean bien en cada pantalla.

**¿Por qué no guardar los archivos en la API?** Porque los servidores
serverless no tienen disco permanente y porque una CDN como Cloudinary entrega
las imágenes mucho más rápido en cualquier país.

---

## 4. Cómo funciona una visita al sitio

1. La persona entra a `indienow.com`.
2. Vercel entrega el sitio React.
3. El sitio pide a la API las noticias, reels, merch y playlists.
4. La API consulta Neon con Prisma y devuelve los datos.
5. El sitio muestra las imágenes y clips desde Cloudinary.
6. TanStack Query guarda la respuesta unos minutos: si la persona navega entre
   secciones, no se repiten los pedidos.

---

## 5. Cómo se publica un contenido

1. El equipo entra al panel y completa el formulario.
2. El panel envía los datos a la API con el token de sesión.
3. La API valida con Zod y guarda en Neon con Prisma.
4. Si hay una imagen nueva, primero se sube a Cloudinary y se guarda su enlace.
5. Cuando el contenido está en **Publicado**, la API lo devuelve en los
   listados públicos.
6. El sitio lo muestra en la sección correspondiente.

---

## 6. Cómo se genera un preview de reel

Hay dos caminos y ambos terminan en el mismo lugar: un clip de 4 segundos y un
poster en Cloudinary.

### Camino A — en el navegador del administrador

1. El admin elige un archivo de video local (ese archivo **no se sube**).
2. El navegador reproduce el video, toma el segundo inicial elegido y graba 4
   segundos con `MediaRecorder`, a 720 px de ancho y sin audio.
3. Genera también una imagen (poster) del primer fotograma.
4. Al guardar, el clip y el poster se suben a Cloudinary.
5. La API guarda los enlaces en el reel.

Ventaja: no depende del worker. Limitación: necesita un navegador compatible y
la pestaña visible durante la grabación.

### Camino B — con el worker de Python

1. El admin presiona **Generar con worker**. La API marca el reel como
   `previewStatus = "pending"`.
2. El worker consulta periódicamente los pendientes (cada 5 minutos).
3. La API le entrega hasta 5 reels por ciclo y marca cada uno como “reclamado”
   para que dos workers no procesen el mismo reel.
4. El worker descarga el video con `yt-dlp` (máximo 720p).
5. Con `ffmpeg` recorta 4 segundos desde el segundo elegido, sin audio, y
   genera el poster.
6. Sube el clip y el poster a Cloudinary.
7. Avisa a la API: `status: "ready"` con los enlaces, o `"failed"` con el
   motivo.
8. Borra siempre los archivos temporales.

Entre reel y reel espera 20–40 segundos para no saturar las plataformas.

**El video original nunca se sube.** Solo el clip de 4 segundos y su poster.

---

## 7. Modelo de datos (resumen)

| Tabla | Qué guarda |
| --- | --- |
| **User** | Usuarios del panel (nombre, correo, contraseña cifrada). |
| **Category** | Categorías de noticias y videos. |
| **Media** | Registro de archivos subidos (imágenes). |
| **News** | Noticias: título, slug, contenido, plataforma, estado, portada. |
| **Reel** | Reels: plataforma, enlace, preview, poster, estado, sección. |
| **Merch** | Productos: nombre, precio, colección, imagen, estado. |
| **Playlist** | Playlists: plataforma, enlace, portada, cantidad de canciones. |
| **LiveSession** | Sesiones en vivo (módulo propio, con datos de YouTube). |
| **Video** | Videos generales. |

**Slug:** es la versión “legible” del título para la dirección web. Por ejemplo,
`/noticias/nuevo-disco-de-wallows` en lugar de `/noticias/15`. Sirve para SEO y
para que los enlaces no cambien si se edita el título.

**Estados:** `DRAFT` (borrador) y `PUBLISHED` (publicado).

**Secciones de la Home:** `LO_NUEVO`, `NOTICIAS`, `REELS`,
`NO_PODES_PERDERTE`.

---

## 8. Estructura de carpetas

```
web/
├── indie-now/                  ← sitio web (React + Vite)
│   ├── src/
│   │   ├── components/         ← piezas reutilizables (Header, Card, ReelCard…)
│   │   ├── pages/              ← pantallas públicas y del panel
│   │   ├── layouts/            ← estructuras con header/footer o sidebar
│   │   ├── hooks/              ← lógica de datos reutilizable
│   │   ├── services/           ← llamadas a la API
│   │   ├── utils/              ← funciones auxiliares (URLs, fechas, previews)
│   │   ├── auth/               ← sesión del administrador
│   │   ├── context/            ← tema claro/oscuro
│   │   ├── styles/             ← estilos globales
│   │   └── data/               ← contenido de respaldo
│   ├── public/                 ← favicon, robots.txt, imágenes públicas
│   ├── docs/                   ← esta documentación
│   └── vite.config.js          ← build y división en chunks
│
└── indie-now-api/              ← API (Node + Express + Prisma)
    ├── src/
    │   ├── modules/            ← un módulo por recurso
    │   ├── integrations/       ← conexiones externas (Spotify, etc.)
    │   ├── middlewares/        ← autenticación, errores
    │   ├── config/             ← Prisma y Cloudinary
    │   └── utils/              ← utilidades compartidas
    ├── prisma/                 ← esquema y migraciones
    ├── worker/                 ← worker de previews en Python
    └── docs/                   ← documentación técnica del backend
```

---

## 9. Configuración y secretos

Las claves nunca se guardan en el código. Van en variables de entorno.

**API (`indie-now-api/.env`):**

| Variable | Para qué |
| --- | --- |
| `DATABASE_URL` | Conexión a Neon (con pooler). |
| `DIRECT_URL` | Conexión directa para migraciones. |
| `CLOUDINARY_CLOUD_NAME` | Nombre de la cuenta de Cloudinary. |
| `CLOUDINARY_API_KEY` | Clave de Cloudinary. |
| `CLOUDINARY_API_SECRET` | Secreto de Cloudinary. |
| `JWT_SECRET` | Firma de los tokens de sesión. |
| `WORKER_TOKEN` | Token que usa el worker para autenticarse. |

**Sitio (`indie-now`):**

| Variable | Para qué |
| --- | --- |
| `VITE_API_URL` | Dirección de la API. Si no se define, usa `http://localhost:3000/api`. |

**Worker (`indie-now-api/worker/.env`):**

| Variable | Para qué |
| --- | --- |
| `API_URL` | Dirección pública de la API. |
| `WORKER_TOKEN` | El mismo token configurado en Vercel. |
| `CLOUDINARY_*` | Las mismas credenciales de la API. |
| `ALLOWED_HOSTS` | Plataformas permitidas para descargar. |
| `ALLOWED_USERS` | Usuarios permitidos (opcional). |
| `COOKIES_BROWSER` | Navegador del que tomar cookies (opcional). |

---

## 10. Seguridad, en simple

- Las contraseñas se guardan **cifradas** con bcrypt; nadie puede leerlas.
- Al iniciar sesión se entrega un **token JWT** que el panel envía en cada
  pedido.
- Las rutas del panel están protegidas: sin token válido, no hay acceso.
- El worker usa un **token propio** (`WORKER_TOKEN`), distinto del de los
  usuarios.
- El video original de los reels nunca se sube: se descarga, se recorta y se
  borra.

**Pendiente de mejora:** hoy la API acepta pedidos desde cualquier origen
(CORS abierto). Conviene restringirlo al dominio del sitio en producción.

---

## 11. Rendimiento (por qué el sitio es rápido en celular)

- **La Home se carga primero; el resto de las pantallas se carga bajo demanda**
  (`React.lazy` + `Suspense`). Así el primer archivo que baja el celular es
  mucho más chico.
- **División en chunks:** las librerías grandes (React, router, íconos, Radix)
  se separan en archivos propios y se cachean.
- **Imágenes optimizadas:** Cloudinary entrega el formato y tamaño adecuados
  (`f_auto,q_auto,w_N,c_limit`), y las imágenes fuera de pantalla usan
  `loading="lazy"`.
- **Videos:** los reels usan `preload="none"` y solo muestran el poster; el
  clip se reproduce al interactuar. El video principal de la Home es una
  fachada que carga YouTube recién al hacer clic.
- **Logos livianos:** el logo del header/footer se sirve en WebP de ~10 KB (antes
  pesaba ~860 KB) y el favicon es un PNG pequeño.
- **Menos re-renders:** componentes frecuentes usan `React.memo` y `useMemo`.

---

## 12. Limitaciones conocidas

- El **worker necesita una PC encendida** con Python, `ffmpeg` y `yt-dlp`. Si
  está apagada, los previews quedan pendientes.
- Las secciones **Dashboard, Categorías, Sesiones y Configuración** del panel
  todavía son pantallas en construcción.
- La **Home usa contenido de respaldo** si la API no responde, para no quedar
  vacía.
- `yt-dlp` se rompe cuando YouTube cambia algo: hay que actualizarlo
  periódicamente.
- No hay tests automáticos completos; existe un smoke test básico en la API.

---

## 13. Para profundizar

La documentación técnica del backend está en `indie-now-api/docs/`:

- `ARCHITECTURE.md`: arquitectura por módulos.
- `DECISIONS.md`: decisiones técnicas del backend.
- `API.md`: endpoints.
- `CONTENT_MODEL.md`: modelo de contenido.
- `DEVELOPMENT_GUIDE.md`: reglas para desarrollar.

Y en este mismo `docs/`:

- `MANUAL_DE_USUARIO.md`: cómo usar el panel.
- `DECISIONES.md`: por qué se eligió cada cosa.
