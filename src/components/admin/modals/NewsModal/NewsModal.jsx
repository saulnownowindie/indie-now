import "./NewsModal.css";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import ImageUploader from "../../ui/ImageUploader";
import Select from "../../ui/Select";
import Toggle from "../../ui/Toggle";

import useCategories from "../../../../hooks/useCategories";
import {
  createNews,
  updateNews,
  uploadNewsCover,
} from "../../../../services/newsService";
import { resolveMediaUrl } from "../../../../utils/mediaUrl";

const platforms = [
  { value: "INSTAGRAM", label: "Instagram" },
  { value: "TIKTOK", label: "TikTok" },
  { value: "YOUTUBE", label: "YouTube" },
  { value: "FACEBOOK", label: "Facebook" },
  { value: "X", label: "X" },
  { value: "THREADS", label: "Threads" },
  { value: "OTHER", label: "Otro" },
];

const statuses = [
  { value: "DRAFT", label: "Borrador" },
  { value: "PUBLISHED", label: "Publicado" },
];

const homeSections = [
  { value: "LO_NUEVO", label: "Lo Nuevo Que Vale" },
  { value: "NOTICIAS", label: "Noticias" },
  { value: "REELS", label: "Reels" },
  { value: "NO_PODES_PERDERTE", label: "No Podés Perderte" },
];

export default function NewsModal({ onClose, news = null }) {
  const queryClient = useQueryClient();

  const isEditing = Boolean(news);

  const { data: categories = [], isLoading } = useCategories();

  const [form, setForm] = useState({
    title: news?.title ?? "",
    content: news?.content ?? "",
    category: news?.categoryId
      ? String(news.categoryId)
      : news?.category?.id
        ? String(news.category.id)
        : "",
    platform: news?.platform ?? "",
    url: news?.url ?? "",
    status: news?.status ?? "DRAFT",
    featured: news?.featured ?? false,
    homeSection: news?.homeSection ?? "NOTICIAS",
    sortOrder: String(news?.sortOrder ?? 0),
  });

  const [coverFile, setCoverFile] = useState(null);
  const [existingCoverUrl, setExistingCoverUrl] = useState(
    resolveMediaUrl(news?.coverImage?.url, 640),
  );
  const [removeCover, setRemoveCover] = useState(false);

  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

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

    if (file) {
      setRemoveCover(false);
      return;
    }

    setExistingCoverUrl(null);
    setRemoveCover(true);
  }

  function validateForm() {
    const newErrors = {};
    const title = form.title.trim();
    const url = form.url.trim();

    if (!title) {
      newErrors.title = "El título es obligatorio.";
    } else if (title.length < 5) {
      newErrors.title = "El título debe tener al menos 5 caracteres.";
    }

    if (!form.category) {
      newErrors.category = "Selecciona una categoría.";
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

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (saving || !validateForm()) {
      return;
    }

    setSaving(true);

    try {
      const payload = {
        title: form.title.trim(),
        content: form.content.trim() || null,
        platform: form.platform,
        url: form.url.trim(),
        categoryId: Number(form.category),
        status: form.status,
        featured: form.featured,
        homeSection: form.homeSection,
        sortOrder: Number(form.sortOrder),
      };

      if (coverFile) {
        const media = await uploadNewsCover(coverFile);

        payload.coverImageId = media.id;
      } else if (removeCover) {
        payload.coverImageId = null;
      }

      if (isEditing) {
        await updateNews(news.id, payload);
      } else {
        await createNews(payload);
      }

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["news"] }),
        queryClient.invalidateQueries({ queryKey: ["public-news"] }),
      ]);

      onClose();
    } catch (error) {
      setErrors({
        submit:
          error.response?.data?.message ||
          "No se pudo guardar la noticia. Intenta nuevamente.",
      });
    } finally {
      setSaving(false);
    }
  }

  function handleClose() {
    if (saving) {
      return;
    }

    onClose();
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
      <form className="modal news-modal" onSubmit={handleSubmit}>
        <div className="modal-header">
          <h2>{isEditing ? "Editar noticia" : "Nueva noticia"}</h2>

          <button
            type="button"
            className="modal-close"
            onClick={handleClose}
            disabled={saving}
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        <div className="modal-body">
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="news-title">
                Título <span className="required">*</span>
              </label>

              <input
                id="news-title"
                type="text"
                placeholder="Título de la noticia"
                value={form.title}
                onChange={(event) =>
                  updateField("title", event.target.value)
                }
                disabled={saving}
                aria-invalid={Boolean(errors.title)}
                aria-describedby={
                  errors.title ? "news-title-error" : undefined
                }
              />

              {errors.title && (
                <span id="news-title-error" className="form-error">
                  {errors.title}
                </span>
              )}
            </div>

            <div className="form-group">
              <Select
                label={
                  <>
                    Categoría <span className="required">*</span>
                  </>
                }
                value={form.category}
                onValueChange={(value) =>
                  updateField("category", value)
                }
                placeholder={
                  isLoading
                    ? "Cargando categorías..."
                    : "Seleccione una categoría"
                }
                disabled={isLoading || saving}
              >
                {categories.map((item) => (
                  <Select.Item key={item.id} value={String(item.id)}>
                    {item.name}
                  </Select.Item>
                ))}
              </Select>

              {errors.category && (
                <span className="form-error">{errors.category}</span>
              )}
            </div>
          </div>

          <div className="form-grid">
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
                placeholder="Seleccione una plataforma"
                disabled={saving}
              >
                {platforms.map((item) => (
                  <Select.Item key={item.value} value={item.value}>
                    {item.label}
                  </Select.Item>
                ))}
              </Select>

              {errors.platform && (
                <span className="form-error">{errors.platform}</span>
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
                {statuses.map((item) => (
                  <Select.Item key={item.value} value={item.value}>
                    {item.label}
                  </Select.Item>
                ))}
              </Select>
            </div>
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
              <label htmlFor="news-sort-order">
                Orden de aparición
              </label>

              <input
                id="news-sort-order"
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
                    ? "news-sort-order-error"
                    : undefined
                }
              />

              {errors.sortOrder && (
                <span
                  id="news-sort-order-error"
                  className="form-error"
                >
                  {errors.sortOrder}
                </span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="news-url">
              URL <span className="required">*</span>
            </label>

            <input
              id="news-url"
              type="url"
              placeholder="https://www.instagram.com/p/..."
              value={form.url}
              onChange={(event) =>
                updateField("url", event.target.value)
              }
              disabled={saving}
              aria-invalid={Boolean(errors.url)}
              aria-describedby={
                errors.url ? "news-url-error" : undefined
              }
            />

            {errors.url && (
              <span id="news-url-error" className="form-error">
                {errors.url}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="news-content">
              Contenido de la noticia
            </label>

            <textarea
              id="news-content"
              placeholder="Escribí aquí el cuerpo de la noticia..."
              value={form.content}
              onChange={(event) =>
                updateField("content", event.target.value)
              }
              disabled={saving}
              rows={10}
              maxLength={50000}
            />

            <span className="form-hint">
              Se muestra en la página de detalle de la noticia.
              Podés separar párrafos con saltos de línea.
            </span>
          </div>

          <Toggle
            id="news-featured"
            label="Destacar en la Home"
            description="Esta noticia aparecerá en la sección principal de la página."
            checked={form.featured}
            onChange={(checked) => updateField("featured", checked)}
            disabled={saving}
          />

          <ImageUploader
            label="Portada"
            value={coverFile}
            onChange={handleCoverChange}
            existingUrl={existingCoverUrl}
          />

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
            disabled={saving}
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="modal-save"
            disabled={saving}
          >
            {saving ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </form>
    </div>
  );
}
