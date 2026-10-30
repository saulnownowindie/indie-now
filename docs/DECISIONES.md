# Registro de decisiones de Indie Now

> **Última actualización:** 30 de octubre de 2026.

Este documento explica **por qué** el proyecto está armado como está. No es un
cambio de versión ni una lista de tareas: es un registro para no volver a
discutir cosas ya decididas y para que cualquier persona nueva entienda el
contexto.

> **Relación con otros documentos**
>
> - `specs/11-decisions.txt` contiene las decisiones de producto y **tiene
>   prioridad** ante cualquier duda.
> - `indie-now-api/docs/DECISIONS.md` contiene las decisiones técnicas del
>   backend.
> - Este archivo traduce y amplía esas decisiones para todo el equipo, en
>   lenguaje sencillo.

**Estados posibles:** Vigente · En revisión · Reemplazada.

---

## D-001 — Las imágenes y los clips viven en Cloudinary

**Estado:** Vigente

**Decisión:** todas las portadas, fotos de merch, posters y clips de preview se
guardan en Cloudinary. La base de datos solo guarda el enlace.

**Por qué:**

- Los servidores serverless (Vercel) no tienen disco permanente: un archivo
  subido ahí se pierde.
- Cloudinary entrega las imágenes desde una red global (CDN), más rápido para
  visitantes de cualquier país.
- Permite transformar la imagen al vuelo: formato moderno, calidad automática y
  ancho a medida.

**Consecuencia:** si Cloudinary no está disponible, las imágenes no cargan,
aunque el texto del sitio sí.

---

## D-002 — El preview de un reel dura 4 segundos y no tiene audio

**Estado:** Vigente

**Decisión:** cada reel puede tener un clip de 4 segundos, sin sonido, que se
reproduce al pasar el mouse o tocar la tarjeta.

**Por qué:**

- Un clip de 4 segundos pesa muy poco y carga rápido en datos móviles.
- Sin audio no molesta al visitante ni obliga a silenciar nada.
- Se repite en bucle y da sensación de movimiento sin distraer.
- Evita incrustar el reproductor de Instagram o TikTok en la grilla, que sería
  mucho más pesado y menos privado.

**Consecuencia:** el clip no cuenta la historia completa del reel; su función es
invitar a abrirlo en la plataforma original.

---

## D-003 — El video original nunca se sube al sitio

**Estado:** Vigente

**Decisión:** el sistema descarga el video, recorta 4 segundos, sube solo ese
clip y su poster, y borra el archivo temporal. El video completo no se almacena.

**Por qué:**

- Ahorra espacio y costo de almacenamiento.
- Respeta el contenido original: el reel se consume en su plataforma.
- Evita problemas de derechos y de peso.

**Consecuencia:** si el enlace original se cae, el preview sigue existiendo, pero
el botón para ver el reel completo deja de funcionar.

---

## D-004 — El worker de previews es un programa aparte

**Estado:** Vigente

**Decisión:** la descarga y el recorte de videos los hace un worker en Python
que corre en una computadora, no la API en Vercel.

**Por qué:**

- Descargar y recortar puede tardar minutos y consumir mucha memoria.
- Vercel corta las tareas largas y no incluye `ffmpeg` ni `yt-dlp`.
- Un worker separado se puede instalar en otra PC, reiniciar sin afectar el
  sitio y escalar ejecutando varios a la vez.

**Consecuencia:** los previews dependen de que al menos una PC con el worker
esté encendida. Si no lo está, los reels quedan en “Preview pendiente”.

---

## D-005 — Hay dos formas de generar un preview

**Estado:** Vigente

**Decisión:** se puede generar en el navegador del administrador (con el archivo
local) o encolarlo para el worker (con el enlace).

**Por qué:**

- El navegador es inmediato y no depende de otra máquina.
- El worker sirve cuando solo se tiene el enlace o cuando el navegador no
  soporta la grabación.
- Tener las dos opciones evita que el equipo quede bloqueado.

**Consecuencia:** hay que explicar bien ambas opciones en el manual y mostrar el
estado del preview en la tabla de reels.

---

## D-006 — PostgreSQL en Neon y Prisma como única vía de acceso

**Estado:** Vigente

**Decisión:** la base de datos es PostgreSQL alojado en Neon y se consulta
siempre con Prisma.

**Por qué:**

- Neon ofrece PostgreSQL administrado, con respaldo y conexión desde la nube.
- Prisma evita escribir SQL a mano, ordena el esquema y maneja las migraciones.
- Tener una sola vía de acceso reduce errores y facilita el mantenimiento.

**Consecuencia:** las consultas directas a la base quedan reservadas para casos
excepcionales y deben justificarse.

---

## D-007 — Vercel aloja el sitio y la API

**Estado:** Vigente

**Decisión:** el sitio React y la API Node se despliegan en Vercel.

**Por qué:**

- El sitio es estático y Vercel lo entrega desde su red global.
- La API se ejecuta como función serverless: se enciende por pedido y no hay que
  administrar un servidor.
- El despliegue se hace desde el repositorio, sin pasos manuales.

**Consecuencia:** la API no puede guardar archivos ni ejecutar procesos largos;
para eso están Cloudinary y el worker.

---

## D-008 — Las direcciones públicas usan slugs

**Estado:** Vigente

**Decisión:** las URLs públicas usan una versión legible del título
(`/noticias/nuevo-disco-de-wallows`) y no el número interno (`/noticias/15`).

**Por qué:**

- Es más claro para las personas y mejor para los buscadores (SEO).
- El enlace no cambia si se edita el título.
- Los IDs quedan solo para el panel de administración.

**Consecuencia:** el slug debe ser único; si se repite, el sistema lo ajusta.

---

## D-009 — El backend se organiza por módulos

**Estado:** Vigente

**Decisión:** cada recurso (noticias, reels, merch, playlists…) tiene su propia
carpeta con `controller`, `service`, `validation` y `routes`.

**Por qué:**

- Todos los módulos se ven igual: es fácil encontrar dónde está cada cosa.
- El controller solo recibe y responde; la lógica vive en el service.
- Las validaciones viven en un solo lugar (Zod).

**Consecuencia:** no se agregan capas nuevas sin una razón concreta.

---

## D-010 — El contenido editorial manda sobre los metadatos externos

**Estado:** Vigente

**Decisión:** si YouTube, Instagram o TikTok aportan un título o una portada,
nunca sobrescriben lo que cargó el administrador.

**Por qué:**

- El equipo editorial tiene la última palabra.
- Las plataformas cambian títulos y miniaturas sin avisar.
- Evita que el sitio se actualice solo con información incorrecta.

**Consecuencia:** las integraciones externas solo enriquecen; no reemplazan.

---

## D-011 — La Home es una portada editorial, no un feed cronológico

**Estado:** Vigente

**Decisión:** la página principal muestra contenido elegido y ordenado por el
equipo, no una lista automática por fecha.

**Por qué:**

- Indie Now es una portada de revista: importa la curaduría.
- Permite destacar lanzamientos, sesiones y campañas.
- Evita que una noticia menor tape un contenido importante.

**Consecuencia:** existen los campos **Destacar** y **Orden de aparición**, y el
equipo debe mantenerlos.

---

## D-012 — La Home se carga primero; el resto, bajo demanda

**Estado:** Vigente

**Decisión:** la pantalla de inicio se incluye en la carga inicial y las demás
páginas se descargan recién cuando se visitan (`React.lazy` + `Suspense`).

**Por qué:**

- El primer archivo que baja el celular es mucho más chico.
- La Home aparece antes y consume menos datos.
- Las páginas internas se cargan solo si hacen falta.

**Consecuencia:** al entrar por primera vez a una sección puede aparecer un
indicador breve de “Cargando…”.

---

## D-013 — Las librerías grandes se separan en archivos propios

**Estado:** Vigente

**Decisión:** el build divide React, el router, TanStack Query, Radix, los
íconos y el resto de las dependencias en grupos separados.

**Por qué:**

- El navegador puede cachear cada grupo por separado.
- Un cambio en el código del sitio no obliga a volver a bajar React entero.
- La carga inicial queda más equilibrada.

**Consecuencia:** hay más archivos, pero cada uno se cachea mejor.

---

## D-014 — Las imágenes se piden optimizadas y con ancho limitado

**Estado:** Vigente

**Decisión:** las URLs de Cloudinary agregan `f_auto,q_auto` y, según el lugar,
un ancho máximo (`w_960`, `w_720`, `w_160`, etc.).

**Por qué:**

- `f_auto` entrega el formato más liviano que el navegador entiende (WebP o
  AVIF).
- `q_auto` ajusta la calidad sin que se note.
- Limitar el ancho evita bajar una imagen de 2000 px para una miniatura de
  160 px.

**Consecuencia:** si se sube una imagen muy grande, el sitio igual la entrega
liviana.

---

## D-015 — Logos y favicon livianos

**Estado:** Vigente

**Decisión:** el logo del header/footer se sirve en WebP de ~512 px (~10 KB) y
el favicon es un PNG de 64 px (~3 KB).

**Por qué:**

- Los PNG originales pesaban ~860 KB y se descargaban en cada visita.
- El logo se muestra pequeño: no necesita 2048 px.

**Consecuencia:** si se rediseña la marca, hay que exportar de nuevo el WebP y
el favicon en esos tamaños.

---

## D-016 — Evitar re-renders innecesarios

**Estado:** Vigente

**Decisión:** los componentes que se repiten mucho (tarjetas, sidebars) usan
`React.memo`, `useMemo` y `useCallback` cuando aporta una mejora real.

**Por qué:**

- Cada re-render consume batería y CPU en el celular.
- Las listas de reels y noticias pueden tener muchas tarjetas.
- Evita que se recalculen datos que no cambiaron.

**Consecuencia:** no se agrega `memo` a todo por reflejo: solo donde se midió o
se justifica.

---

## D-017 — Borrador y Publicado

**Estado:** Vigente

**Decisión:** todo contenido tiene un estado: `DRAFT` (borrador) o `PUBLISHED`
(publicado). Solo lo publicado se muestra en el sitio.

**Por qué:**

- Permite preparar contenido sin que el público lo vea.
- Evita publicar por error.
- Da un paso de revisión antes de salir al aire.

**Consecuencia:** si algo no aparece, lo primero que hay que revisar es el
estado.

---

## D-018 — Destacar y ordenar son decisiones editoriales

**Estado:** Vigente

**Decisión:** cada contenido puede marcarse como destacado y tener un número de
orden. Los números más bajos aparecen primero.

**Por qué:**

- La Home necesita jerarquía visual.
- El equipo puede cambiar la portada sin tocar código.
- Permite armar campañas y prioridades por semana.

**Consecuencia:** el orden debe revisarse cuando se agrega contenido nuevo.

---

## D-019 — La documentación se escribe en lenguaje sencillo

**Estado:** Vigente

**Decisión:** además de la documentación técnica, el proyecto mantiene un manual
de usuario y una explicación de arquitectura sin jerga, actualizados por el
agente **@documentador**.

**Por qué:**

- El equipo editorial no tiene por qué leer código para usar el panel.
- Una explicación clara reduce errores y preguntas repetidas.
- La documentación técnica y la humana se complementan.

**Consecuencia:** cada cambio importante debe actualizar `docs/`. Desde D-021,
ese trabajo se hace de forma automática al quedar inactiva una sesión.

---

## D-020 — Las specs tienen prioridad

**Estado:** Vigente

**Decisión:** si una decisión de este documento entra en conflicto con
`specs/11-decisions.txt`, gana la spec.

**Por qué:**

- Evita interpretaciones personales.
- Mantiene una única fuente de verdad para el producto.

**Consecuencia:** este registro se actualiza para reflejar la spec, no al revés.

---

## D-021 — La documentación se actualiza sola al terminar una sesión

**Estado:** Vigente

**Decisión:** un complemento del entorno de desarrollo revisa los cambios de
código y, cuando la sesión de trabajo queda inactiva, encarga al agente
**@documentador** la actualización de `docs/`.

**Por qué:**

- D-019 pedía actualizar la documentación con cada cambio importante, pero
  dependía de que alguien se acordara de hacerlo.
- La documentación desactualizada genera dudas y errores en el equipo
  editorial.
- Revisar solo lo que cambió evita reescribir documentos enteros y mantiene el
  tono y la numeración existentes.

**Consecuencia:** pueden aparecer cambios en `docs/` sin que nadie los haya
pedido; conviene revisarlos antes de darlos por buenos. El complemento corre en
el entorno local (no en el sitio publicado) y se puede desactivar si molesta.

---

## Cómo agregar una decisión nueva

1. Copiá el formato de arriba.
2. Usá el siguiente número libre (`D-022`, `D-023`…).
3. Explicá la decisión, el motivo y la consecuencia.
4. Si reemplaza a otra, marcá la anterior como **Reemplazada** y aclará por cuál.
5. Si la decisión es de producto, actualizá también `specs/11-decisions.txt`.
6. Pedile a **@documentador** que revise los tres archivos de `docs/`.

---

## Cuándo revisar una decisión

Una decisión se revisa cuando:

- Cambia una regla del producto.
- Aparece una limitación técnica nueva.
- El costo o el rendimiento dejan de tener sentido.
- El equipo detecta que la decisión ya no representa cómo trabaja.

Revisar no es borrar: se deja el historial y se marca el estado.
