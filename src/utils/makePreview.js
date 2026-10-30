export async function makePreview(file, start, duration = 4, width = 360) {
  if (!window.MediaRecorder) throw new Error("Este navegador no soporta la generación de previews.");
  const url = URL.createObjectURL(file);
  try {
    const v = document.createElement("video");
    v.src = url; v.muted = true; v.playsInline = true; v.preload = "auto";
    await new Promise((res, rej) => { v.onloadedmetadata = res; v.onerror = () => rej(new Error("No se pudo leer el video.")); });
    const h = Math.round(((v.videoHeight / v.videoWidth) * width) / 2) * 2;
    const canvas = document.createElement("canvas");
    canvas.width = width; canvas.height = h;
    if (!canvas.captureStream) throw new Error("Este navegador no soporta la captura del preview.");
    const ctx = canvas.getContext("2d");

    v.currentTime = Math.max(start, 0.01);
    await new Promise((r) => (v.onseeked = r));
    ctx.drawImage(v, 0, 0, width, h);
    const poster = await new Promise((r) => canvas.toBlob(r, "image/jpeg", 0.8));

    const mime = ["video/mp4;codecs=avc1", "video/webm;codecs=vp9", "video/webm"].find((t) => MediaRecorder.isTypeSupported(t));
    if (!mime) throw new Error("No hay un formato de grabación compatible.");
    const rec = new MediaRecorder(canvas.captureStream(24), { mimeType: mime, videoBitsPerSecond: 700000 });
    const chunks = [];
    rec.ondataavailable = (e) => e.data.size && chunks.push(e.data);
    const stopped = new Promise((r) => (rec.onstop = r));
    let raf;
    const draw = () => { ctx.drawImage(v, 0, 0, width, h); raf = requestAnimationFrame(draw); };
    rec.start(); await v.play(); draw();
    await new Promise((r) => setTimeout(r, duration * 1000));
    cancelAnimationFrame(raf); v.pause(); rec.stop(); await stopped;

    const clip = new Blob(chunks, { type: mime.split(";")[0] });
    if (clip.size < 5000) throw new Error("El preview salió vacío. Mantén esta pestaña visible mientras graba e inténtalo de nuevo.");
    return { clip, poster };
  } finally {
    URL.revokeObjectURL(url);
  }
}
