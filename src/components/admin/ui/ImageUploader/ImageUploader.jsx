import "./ImageUploader.css";

import { useRef } from "react";
import { ImagePlus, Trash2 } from "lucide-react";

export default function ImageUploader({
  label,
  value,
  onChange,
}) {
  const inputRef = useRef(null);

  function handleFile(file) {
    if (!file) return;

    onChange(file);
  }

  function handleInput(e) {
    handleFile(e.target.files[0]);
  }

  function handleDrop(e) {
    e.preventDefault();

    handleFile(e.dataTransfer.files[0]);
  }

  function removeImage() {
    onChange(null);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  return (
    <div className="image-uploader">

      {label && (
        <label className="image-uploader-label">
          {label}
        </label>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={handleInput}
      />

      {!value ? (
        <div
          className="image-dropzone"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <ImagePlus size={46} />

          <h3>Arrastra una imagen</h3>

          <p>o haz clic para seleccionarla</p>

          <small>
            JPG · PNG · WEBP
          </small>

        </div>
      ) : (
        <div className="image-preview">

          <img
            src={URL.createObjectURL(value)}
            alt="Preview"
          />

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

    </div>
  );
}