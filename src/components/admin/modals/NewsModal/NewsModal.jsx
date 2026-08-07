import "./NewsModal.css";

import { useState, useEffect } from "react";
import useCategories from "../../../../hooks/useCategories";

import Select from "../../ui/Select";
import ImageUploader from "../../ui/ImageUploader";

export default function NewsModal({ open, onClose }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [platform, setPlatform] = useState("");
  const [url, setUrl] = useState("");
  const [cover, setCover] = useState(null);

  const { data: categories = [], isLoading } = useCategories();

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
    {
      value: "OTHER",
      label: "Otro",
    },
  ];

  useEffect(() => {
    if (open) {
      setTitle("");
      setCategory("");
      setPlatform("");
      setUrl("");
      setCover(null);
    }
  }, [open]);

  function handleClose() {
    setTitle("");
    setCategory("");
    setPlatform("");
    setUrl("");
    setCover(null);

    onClose();
  }

  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>Nueva noticia</h2>

          <button className="modal-close" onClick={handleClose}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          <div className="form-grid">
            <div className="form-group">
              <label>
                Título <span>*</span>
              </label>

              <input
                type="text"
                placeholder="Título de la noticia"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <Select
              label="Categoría"
              value={category}
              onValueChange={setCategory}
              placeholder="Seleccione una categoría"
              disabled={isLoading}
            >
              {categories.map((item) => (
                <Select.Item key={item.id} value={String(item.id)}>
                  {item.name}
                </Select.Item>
              ))}
            </Select>
          </div>

          <div className="form-grid">
            <Select
              label="Plataforma *"
              value={platform}
              onValueChange={setPlatform}
              placeholder="Seleccione una plataforma"
            >
              {platforms.map((item) => (
                <Select.Item key={item.value} value={item.value}>
                  {item.label}
                </Select.Item>
              ))}
            </Select>

            <div className="form-group">
              <label>
                URL <span>*</span>
              </label>

              <input
                type="url"
                placeholder="Pega la URL del contenido"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
          </div>

          <ImageUploader label="Portada" value={cover} onChange={setCover} />
        </div>

        <div className="modal-footer">
          <button className="modal-cancel" onClick={handleClose}>
            Cancelar
          </button>

          <button className="modal-save" type="button">
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
