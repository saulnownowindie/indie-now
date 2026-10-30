import "./ImageUploader.css";

import { useEffect, useMemo, useRef, useState } from "react";
import { ImagePlus, Trash2 } from "lucide-react";

const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4 MB

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

export default function ImageUploader({
  label,
  value,
  onChange,
  existingUrl = null,
}) {
  const inputRef = useRef(null);
  const dragDepth = useRef(0);

  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");

  const objectUrl = useMemo(
    () => (value ? URL.createObjectURL(value) : null),
    [value],
  );

  useEffect(() => {
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [objectUrl]);

  const previewUrl = objectUrl || existingUrl;

  function validateFile(file) {
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Formato no válido. Usa JPG, PNG o WEBP.");
      return false;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("La imagen supera los 4MB.");
      return false;
    }

    setError("");
    return true;
  }

  function handleFile(file) {
    if (!file || !validateFile(file)) return;

    onChange(file);
  }

  function handleInput(e) {
    handleFile(e.target.files[0]);

    e.target.value = "";
  }

  function handleDragEnter(e) {
    e.preventDefault();
    e.stopPropagation();

    dragDepth.current += 1;
    setIsDragging(true);
  }

  function handleDragOver(e) {
    // Sin preventDefault el navegador no permite soltar el archivo.
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = "copy";
    }
  }

  function handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();

    dragDepth.current = Math.max(0, dragDepth.current - 1);

    if (dragDepth.current === 0) {
      setIsDragging(false);
    }
  }

  function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();

    dragDepth.current = 0;
    setIsDragging(false);

    handleFile(e.dataTransfer.files?.[0]);
  }

  function resetDragState() {
    dragDepth.current = 0;
    setIsDragging(false);
  }

  function openFilePicker() {
    inputRef.current?.click();
  }

  function handleDropzoneKeyDown(e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openFilePicker();
    }
  }

  function removeImage() {
    setError("");

    onChange(null);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  return (
    <div
      className={`image-uploader${isDragging ? " is-dragging" : ""}`}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onDragEnd={resetDragState}
    >

      {label && (
        <label className="image-uploader-label">
          {label}
        </label>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        hidden
        onChange={handleInput}
      />

      {!previewUrl ? (
        <div
          className={`image-dropzone${isDragging ? " is-dragging" : ""}`}
          role="button"
          tabIndex={0}
          aria-label="Seleccionar imagen"
          onClick={openFilePicker}
          onKeyDown={handleDropzoneKeyDown}
        >
          <ImagePlus size={46} />

          <h3>{isDragging ? "Suelta la imagen aquí" : "Arrastra una imagen"}</h3>

          <p>o haz clic para seleccionarla</p>

          <small>
            JPG · PNG · WEBP · Máx. 4MB
          </small>

        </div>
      ) : (
        <div
          className={`image-preview${isDragging ? " is-dragging" : ""}`}
        >

          <img
            src={previewUrl}
            alt="Preview"
            decoding="async"
          />

          {isDragging && (
            <div className="image-preview-overlay">
              Suelta para reemplazar la imagen
            </div>
          )}

          <button
            type="button"
            className="image-remove"
            onClick={removeImage}
          >
            <Trash2 size={18} />

            Eliminar
          </button>

        </div>
      )}

      {error && (
        <p className="image-uploader-error" role="alert">
          {error}
        </p>
      )}

    </div>
  );
}
