# Manual de usuario — Panel de administración de Indie Now

> **Última actualización:** 30 de octubre de 2026.

Este manual explica, paso a paso y sin tecnicismos, cómo usar el panel de
administración del sitio. Está pensado para el equipo editorial de Indie Now,
no para programadores.

> **Idea general:** todo el contenido del sitio (noticias, reels, merch y
> playlists) se carga desde el panel. Lo que está en **Borrador** no lo ve el
> público; lo que está en **Publicado** sí.

---

## 1. Cómo entrar al panel

1. Abrí en el navegador la dirección del sitio seguida de `/admin/login`.
   Por ejemplo: `https://indienow.com/admin/login`.
2. Escribí tu **correo** y tu **contraseña**.
3. Presioná **Ingresar**.

Si el correo o la contraseña no son correctos, el sistema muestra un mensaje de
error. Si olvidaste la contraseña, pedile a la persona encargada de la cuenta
que la restablezca.

> **Seguridad:** no compartas tu contraseña y cerrá sesión con el botón
> **Cerrar sesión** (abajo a la izquierda) si usás una computadora compartida.

---

## 2. Panorama del panel

Al entrar vas a ver un menú lateral con estas secciones:

| Sección | Para qué sirve |
| --- | --- |
| **Dashboard** | Resumen general. Por ahora muestra tarjetas informativas. |
| **Noticias** | Crear, editar y borrar noticias. |
| **Categorías** | Sección en preparación. |
| **Sesiones** | Sección en preparación. |
| **Reels** | Crear, editar y borrar reels, y generar sus previews. |
| **Merch** | Crear, editar y borrar productos. |
| **Playlists** | Crear, editar y borrar playlists. |
| **Configuración** | Sección en preparación. |

Cada listado tiene un buscador y botones para **editar** (lápiz) y **eliminar**
(tacho de basura).

> **Importante:** eliminar un contenido es permanente. Si solo querés ocultarlo
> del sitio, cambialo a **Borrador** en lugar de borrarlo.

---

## 3. Reglas que se repiten en todos los formularios

### 3.1 Estado: Borrador o Publicado

- **Borrador:** el contenido queda guardado en el panel, pero no aparece en el
  sitio público.
- **Publicado:** el contenido aparece en el sitio (siempre que esté marcado
  como visible, cuando esa opción exista).

### 3.2 Sección de la Home

Algunos contenidos permiten elegir en qué parte de la página principal se
muestran:

- **Lo Nuevo Que Vale**
- **Noticias**
- **Reels**
- **No Podés Perderte**

### 3.3 Orden de aparición

Es un número. Cuanto **más bajo**, más arriba aparece dentro de su sección.
Por ejemplo: `0` aparece antes que `1`, y `1` antes que `2`.

### 3.4 Destacar en la Home

Es un interruptor. Si está activado, el contenido tiene prioridad para
aparecer en la portada.

### 3.5 Imágenes

- Usá imágenes **verticales** para reels y **horizontales o cuadradas** para
  noticias y merch.
- El sistema optimiza las imágenes automáticamente al mostrarlas, así que no
  hace falta subirlas ya comprimidas.
- Evitá archivos de varios megabytes: una imagen de hasta ~2 MB es más que
  suficiente.

### 3.6 Guardar y cancelar

- **Guardar** confirma los cambios.
- **Cancelar** cierra el formulario sin guardar.
- Mientras se guarda, los botones se bloquean para evitar duplicados.

---

## 4. Noticias

### Crear una noticia

1. Entrá a **Noticias** en el menú lateral.
2. Presioná **+ Nueva noticia**.
3. Completá:
   - **Título** (obligatorio).
   - **Plataforma** de origen (Instagram, TikTok, YouTube, etc.).
   - **Estado**: Borrador o Publicado.
   - **Sección de la Home**.
   - **Orden de aparición**.
   - **Enlace original**: la publicación de donde sale la noticia.
   - **Contenido**: el cuerpo de la noticia.
   - **Destacar en la Home**, si corresponde.
   - **Portada**: subí una imagen.
4. Presioná **Guardar**.

### Editar o eliminar

- En la tabla, usá el lápiz para editar o el tacho para eliminar.
- El buscador filtra por título mientras escribís.

> **Consejo:** antes de publicar, revisá que el enlace original abra
> correctamente y que la portada se vea bien en el celular.

---

## 5. Reels

Los reels son las piezas verticales que se muestran en la sección **Reels** y,
si las destacás, en la Home.

### 5.1 Crear un reel

1. Entrá a **Reels**.
2. Presioná **+ Nuevo reel**.
3. Completá:
   - **Título** (obligatorio).
   - **Plataforma**: Instagram, TikTok o YouTube.
   - **Enlace original** del reel.
   - **Estado** y **Sección de la Home**.
   - **Orden de aparición**.
   - **Video directo (opcional)**: si tenés el archivo en formato MP4, WebM u
     OGG, podés pegar su enlace. Si lo completás, el reel se reproduce solo en
     la grilla. Si lo dejás vacío, se muestra la portada y el enlace social.
4. Presioná **Guardar**.

### 5.2 La portada del reel

Tenés dos caminos:

- **Obtener portada:** el sistema intenta traer la miniatura automáticamente.
  Funciona bien con **YouTube** y **TikTok**. En **Instagram** suele ser
  necesario subir la imagen a mano.
- **Imagen de portada:** subila desde tu computadora con el selector de
  archivos.

### 5.3 El preview animado (clip de 4 segundos)

El preview es un clip corto, **sin audio**, que se reproduce cuando alguien
pasa el mouse o toca la tarjeta del reel. Sirve para que la página se sienta
viva sin cargar el video completo.

**El video original nunca se sube al sitio.** Solo se guarda el clip de 4
segundos y su imagen de portada.

Hay dos formas de generarlo:

#### Opción A — Generar en el navegador (rápido)

1. En el formulario del reel, buscá **Preview animado (opcional)**.
2. En **Video para sacar el preview (no se sube)**, elegí el archivo de video
   desde tu computadora.
3. Movés el control **Segundo inicial** hasta el momento que querés mostrar.
4. Presioná **Generar preview**.
5. **No cambies de pestaña ni minimices el navegador** mientras graba: el
   proceso dura 4 segundos y necesita la pestaña visible.
6. Cuando termina, vas a ver el clip y su poster. Se suben a la nube recién
   cuando presionás **Guardar**.

> Esta opción funciona en Chrome y Edge actualizados. Si tu navegador no la
> soporta, el panel te avisa y podés usar la Opción B.

#### Opción B — Generar con el worker (para enlaces)

1. No selecciones ningún archivo.
2. Asegurate de que el **Enlace original** esté completo.
3. Presioná **Generar con worker**.
4. El reel queda en estado **Preview pendiente**.
5. Una computadora con el *worker* encendido lo procesa (puede tardar unos
   minutos). Cuando termina, el estado cambia a **Preview listo**.

Si el reel ya tiene un preview, el botón cambia a **Regenerar preview**.

#### Qué significan los estados del preview

| Estado | Significado |
| --- | --- |
| **Preview listo** | El clip y el poster están disponibles. |
| **Preview pendiente** | Esperando que el worker lo tome. |
| **Procesando…** | El worker lo está descargando y recortando. |
| **Sin preview** | No se pudo generar (enlace privado, error de descarga, etc.). |

#### Consejos para un buen preview

- Elegí un momento con movimiento o un plano claro, no una intro con logo.
- Evitá los primeros segundos si el video arranca en negro.
- Revisá el resultado antes de publicar.
- Si el enlace es privado o la plataforma bloquea la descarga, usá la Opción A
  con el archivo descargado.

#### Si algo falla

- **“Este navegador no puede generar previews”**: usá Chrome o Edge, o la
  Opción B.
- **El preview sale vacío**: mantené la pestaña visible durante los 4 segundos
  y volvé a intentar.
- **Queda en “Preview pendiente”**: el worker no está encendido o no tiene
  conexión. Encendelo en la computadora correspondiente.
- **“Sin preview” con enlaces de YouTube**: actualizá `yt-dlp` en la
  computadora del worker (ver el manual técnico del worker).

---

## 6. Merch

### Crear un producto

1. Entrá a **Merch**.
2. Presioná **+ Nuevo producto**.
3. Completá:
   - **Nombre** (obligatorio).
   - **Precio** (obligatorio). Es texto libre: por ejemplo `$20.000`.
   - **Colección** (opcional): por ejemplo `Verano 2026`.
   - **Estado**.
   - **Descripción**.
   - **Destacar en la Home**.
   - **Imagen del producto**.
4. Presioná **Guardar**.

### Editar o eliminar

Igual que en Noticias: lápiz para editar, tacho para eliminar. El buscador
filtra por nombre.

---

## 7. Playlists

### Crear una playlist

1. Entrá a **Playlists**.
2. Presioná el botón de crear playlist.
3. Completá:
   - **Título**.
   - **Plataforma** (Spotify, YouTube Music, TikTok, etc.).
   - **Enlace** de la playlist.
   - **Estado**.
   - **Descripción**.
   - **Creador**.
   - **Cantidad de canciones**.
   - **Orden de aparición**.
   - **Destacar en la Home**: la muestra en “No Podés Perderte”.
   - **Visible**: permite que se muestre en el sitio público.
   - **Portada de la playlist**.
4. Presioná **Guardar**.

> Si una playlist no debe aparecer todavía, dejala en **Borrador** o
> desactivá **Visible**.

---

## 8. Secciones en preparación

Las siguientes secciones ya aparecen en el menú, pero todavía son pantallas en
construcción:

- **Dashboard**: muestra tarjetas de resumen; los números pueden aparecer en
  cero.
- **Categorías**: por ahora las categorías se administran desde la base de
  datos.
- **Sesiones**: las sesiones en vivo se gestionan por ahora desde la API; el
  video principal de la Home se define en el código del sitio.
- **Configuración**: pantalla reservada para futuras opciones.

Cuando estas secciones estén terminadas, este manual se actualizará.

---

## 9. Preguntas frecuentes

**¿Por qué no veo mi contenido publicado en el sitio?**
Revisá tres cosas: que el estado sea **Publicado**, que esté **Visible** (si la
opción existe) y que estés mirando la sección correcta de la Home.

**¿Puedo cambiar el orden sin borrar y volver a crear?**
Sí. Editá el contenido y cambiá **Orden de aparición**. Los números más bajos
van primero.

**¿Se puede recuperar algo eliminado?**
No desde el panel. Si dudás, pasalo a **Borrador** en lugar de eliminarlo.

**¿El video original queda guardado en el sitio?**
No. Solo se guardan el clip de 4 segundos y la portada.

**¿Cuánto tarda el worker?**
Depende del reel y de la conexión. Revisa el estado en la tabla de Reels.

**¿Puedo cargar contenido desde el celular?**
Sí, el panel es responsive. Para generar previews en el navegador conviene una
computadora, porque el celular puede suspender la pestaña.

---

## 10. Buenas prácticas editoriales

- Escribí títulos claros y cortos: se leen mejor en el celular.
- Usá portadas con rostros, instrumentos o acción; llaman más la atención.
- No repitas la misma noticia en varias secciones.
- Revisá siempre el enlace original antes de publicar.
- Publicá primero en Borrador, mirá cómo queda y después cambialo a Publicado.
