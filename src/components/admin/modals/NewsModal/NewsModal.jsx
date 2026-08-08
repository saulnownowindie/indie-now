import "./NewsModal.css";

import { useEffect, useState } from "react";
import useCategories from "../../../../hooks/useCategories";

import api from "../../../../services/api";

import Select from "../../ui/Select";
import ImageUploader from "../../ui/ImageUploader";

export default function NewsModal({ open, onClose }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [platform, setPlatform] = useState("");
  const [url, setUrl] = useState("");
  const [cover, setCover] = useState(null);

  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const {
    data: categories = [],
    isLoading,
  } = useCategories();

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
      value: "FACEBOOK",
      label: "Facebook",
    },
    {
      value: "X",
      label: "X",
    },
    {
      value: "THREADS",
      label: "Threads",
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
      setErrors({});
      setSaving(false);
    }
  }, [open]);

  function validateForm() {
    const newErrors = {};

    if (!title.trim()) {
      newErrors.title = "El título es obligatorio.";
    }

    if (!category) {
      newErrors.category = "Selecciona una categoría.";
    }

    if (!platform) {
      newErrors.platform = "Selecciona una plataforma.";
    }

    if (!url.trim()) {
      newErrors.url = "La URL es obligatoria.";
    } else {
      try {
        new URL(url.trim());
      } catch {
        newErrors.url = "Ingresa una URL válida.";
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit() {
    const isValid = validateForm();

    if (!isValid || saving) {
      return;
    }

    setSaving(true);

    try {
      let coverImageId = null;

      if (cover) {
        const formData = new FormData();

        formData.append("file", cover);

        const mediaResponse = await api.post(
          "/media",
          formData
        );

        coverImageId = mediaResponse.data.media.id;
      }

      const newsResponse = await api.post("/news", {
        title: title.trim(),
        platform,
        url: url.trim(),
        categoryId: Number(category),
        coverImageId,
      });

      console.log(
        "Noticia creada:",
        newsResponse.data
      );

      handleClose();
    } catch (error) {
      console.error(
        "Error al crear la noticia:",
        error.response?.data || error
      );
    } finally {
      setSaving(false);
    }
  }

  function handleClose() {
    setTitle("");
    setCategory("");
    setPlatform("");
    setUrl("");
    setCover(null);
    setErrors({});
    setSaving(false);

    onClose();
  }

  function handleTitleChange(event) {
    setTitle(event.target.value);

    if (errors.title) {
      setErrors((current) => ({
        ...current,
        title: "",
      }));
    }
  }

  function handleCategoryChange(value) {
    setCategory(value);

    if (errors.category) {
      setErrors((current) => ({
        ...current,
        category: "",
      }));
    }
  }

  function handlePlatformChange(value) {
    setPlatform(value);

    if (errors.platform) {
      setErrors((current) => ({
        ...current,
        platform: "",
      }));
    }
  }

  function handleUrlChange(event) {
    setUrl(event.target.value);

    if (errors.url) {
      setErrors((current) => ({
        ...current,
        url: "",
      }));
    }
  }

  if (!open) {
    return null;
  }

  return (
    <div
      className="modal-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          handleClose();
        }
      }}
    >
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-news-title"
      >
        <div className="modal-header">
          <h2 id="new-news-title">
            Nueva noticia
          </h2>

          <button
            type="button"
            className="modal-close"
            onClick={handleClose}
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        <div className="modal-body">
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="news-title">
                Título{" "}
                <span className="required">*</span>
              </label>

              <input
                id="news-title"
                type="text"
                placeholder="Título de la noticia"
                value={title}
                onChange={handleTitleChange}
                aria-invalid={Boolean(errors.title)}
                aria-describedby={
                  errors.title
                    ? "news-title-error"
                    : undefined
                }
              />

              {errors.title && (
                <span
                  id="news-title-error"
                  className="form-error"
                >
                  {errors.title}
                </span>
              )}
            </div>

            <div className="form-group">
              <Select
                label={
                  <>
                    Categoría{" "}
                    <span className="required">*</span>
                  </>
                }
                value={category}
                onValueChange={handleCategoryChange}
                placeholder={
                  isLoading
                    ? "Cargando categorías..."
                    : "Seleccione una categoría"
                }
                disabled={isLoading}
              >
                {categories.map((item) => (
                  <Select.Item
                    key={item.id}
                    value={String(item.id)}
                  >
                    {item.name}
                  </Select.Item>
                ))}
              </Select>

              {errors.category && (
                <span className="form-error">
                  {errors.category}
                </span>
              )}
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <Select
                label={
                  <>
                    Plataforma{" "}
                    <span className="required">*</span>
                  </>
                }
                value={platform}
                onValueChange={handlePlatformChange}
                placeholder="Seleccione una plataforma"
              >
                {platforms.map((item) => (
                  <Select.Item
                    key={item.value}
                    value={item.value}
                  >
                    {item.label}
                  </Select.Item>
                ))}
              </Select>

              {errors.platform && (
                <span className="form-error">
                  {errors.platform}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="news-url">
                URL{" "}
                <span className="required">*</span>
              </label>

              <input
                id="news-url"
                type="url"
                placeholder="Pega la URL del contenido"
                value={url}
                onChange={handleUrlChange}
                aria-invalid={Boolean(errors.url)}
                aria-describedby={
                  errors.url
                    ? "news-url-error"
                    : undefined
                }
              />

              {errors.url && (
                <span
                  id="news-url-error"
                  className="form-error"
                >
                  {errors.url}
                </span>
              )}
            </div>
          </div>

          <ImageUploader
            label="Portada"
            value={cover}
            onChange={setCover}
          />
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="modal-cancel"
            onClick={handleClose}
            disabled={saving}
          >
            Cancelar
          </button>

          <button
            type="button"
            className="modal-save"
            onClick={handleSubmit}
            disabled={saving}
          >
            {saving ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}