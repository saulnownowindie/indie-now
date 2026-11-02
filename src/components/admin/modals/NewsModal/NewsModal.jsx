import "../NewsModal/NewsModal.css";
import "./NewsModal.css";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { 
  Type, 
  Tag, 
  Activity, 
  Link as LinkIcon, 
  Image as ImageIcon, 
  FileText // <-- Icono para el botón de pegar
} from "lucide-react";
import {
  FaFacebook,
  FaGlobe,
  FaInstagram,
  FaThreads,
  FaTiktok,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";

import ImageUploader from "../../ui/ImageUploader";
import Select from "../../ui/Select";

import {
  createNews,
  updateNews,
  uploadNewsCover,
} from "../../../../services/newsService";
import { resolveMediaUrl } from "../../../../utils/mediaUrl";
import { readImageFromClipboard } from "../../../../utils/clipboardImage";
import useCategories from "../../../../hooks/useCategories";

const platforms = [
  {
    value: "INSTAGRAM",
    label: "Instagram",
    icon: FaInstagram,
    iconClass: "platform-instagram",
  },
  {
    value: "TIKTOK",
    label: "TikTok",
    icon: FaTiktok,
    iconClass: "platform-tiktok",
  },
  {
    value: "YOUTUBE",
    label: "YouTube",
    icon: FaYoutube,
    iconClass: "platform-youtube",
  },
  {
    value: "FACEBOOK",
    label: "Facebook",
    icon: FaFacebook,
    iconClass: "platform-facebook",
  },
  {
    value: "X",
    label: "X (Twitter)",
    icon: FaXTwitter,
    iconClass: "platform-x",
  },
  {
    value: "THREADS",
    label: "Threads",
    icon: FaThreads,
    iconClass: "platform-threads",
  },
  {
    value: "OTHER",
    label: "Otro",
    icon: FaGlobe,
    iconClass: "platform-other",
  },
];

const statuses = [
  { value: "DRAFT", label: "Borrador" },
  { value: "PUBLISHED", label: "Publicado" },
];

function isValidUrl(value) {
  if (!value) return false;
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    // Fallback leniente para enlaces con caracteres especiales (ej. Instagram con ?img_index=1)
    return /^https?:\/\/.+/i.test(value.trim());
  }
}

export default function NewsModal({ onClose, news = null }) {
  const queryClient = useQueryClient();
  const isEditing = Boolean(news);
  const { data: categories = [] } = useCategories();

  const [form, setForm] = useState({
    title: news?.title ?? "",
    categoryId: news?.categoryId ?? "",
    platform: news?.platform ?? "INSTAGRAM",
    url: news?.url ?? "",
    status: news?.status ?? "DRAFT",
    featured: news?.featured ?? false,
  });

  const [coverFile, setCoverFile] = useState(null);
  const [existingCoverUrl, setExistingCoverUrl] = useState(
    resolveMediaUrl(news?.coverImage?.url || news?.imageUrl)
  );
  const [removeCover, setRemoveCover] = useState(false);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    if (errors[field] || errors.submit) {
      setErrors((current) => ({ ...current, [field]: "", submit: "" }));
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

  async function handlePasteFromClipboard() {
    try {
      const file = await readImageFromClipboard();
      handleCoverChange(file);
      setErrors((current) => ({ ...current, submit: "" }));
    } catch (error) {
      setErrors((current) => ({
        ...current,
        submit: error.message || "No se pudo leer el portapapeles.",
      }));
    }
  }

  function validateForm() {
    const newErrors = {};

    if (!form.title.trim()) {
      newErrors.title = "El título es obligatorio.";
    }

    if (!form.categoryId) {
      newErrors.categoryId = "La categoría es obligatoria.";
    }

    if (!form.platform) {
      newErrors.platform = "La plataforma es obligatoria.";
    }

    if (!form.url.trim()) {
      newErrors.url = "La URL es obligatoria.";
    } else if (!isValidUrl(form.url.trim())) {
      newErrors.url = "Ingresá una URL válida (por ejemplo https://...).";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (saving || !validateForm()) return;

    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        categoryId: Number(form.categoryId),
        platform: form.platform,
        url: form.url.trim(),
        status: form.status,
        featured: form.featured,
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

      await queryClient.invalidateQueries({ queryKey: ["news"] });
      await queryClient.invalidateQueries({ queryKey: ["public-news"] });
      onClose();
    } catch (error) {
      const data = error.response?.data;
      const fieldErrors = {};
      const messages = [];

      if (Array.isArray(data?.errors)) {
        for (const issue of data.errors) {
          const field = issue.path?.[0];
          if (field) {
            fieldErrors[field] = issue.message;
          }
          if (issue.message) messages.push(issue.message);
        }
      }

      const submitMessage =
        messages.length > 0
          ? messages.join(" ")
          : data?.message || "No se pudo guardar la noticia.";

      setErrors({ ...fieldErrors, submit: submitMessage });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="modal-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <form className="modal news-modal" onSubmit={handleSubmit} noValidate>
        <div className="modal-header">
          <h2 style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Type size={24} color="var(--color-primary)" /> 
            {isEditing ? "Editar noticia" : "Nueva noticia"}
          </h2>
          <button type="button" className="modal-close" onClick={onClose} disabled={saving}>✕</button>
        </div>

        <div className="modal-body">
          <div className="modal-col">
            <div className="form-grid">
              <div className={`form-group${errors.title ? " has-error" : ""}`}>
                <label className="modal-label"><Type size={14} className="label-icon" /> Título *</label>
                <input
                  type="text"
                  placeholder="Título de la noticia"
                  value={form.title}
                  onChange={(e) => updateField("title", e.target.value)}
                  disabled={saving}
                  aria-invalid={Boolean(errors.title)}
                />
                {errors.title && <span className="form-error">{errors.title}</span>}
              </div>

              <div className={`form-group${errors.categoryId ? " has-error" : ""}`}>
                <label className="modal-label"><Tag size={14} className="label-icon" /> Categoría *</label>
                <Select value={form.categoryId} onValueChange={(v) => updateField("categoryId", v)} disabled={saving}>
                  {categories.map((cat) => (
                    <Select.Item key={cat.id} value={String(cat.id)}>{cat.name}</Select.Item>
                  ))}
                </Select>
                {errors.categoryId && <span className="form-error">{errors.categoryId}</span>}
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label className="modal-label"><Activity size={14} className="label-icon" /> Plataforma *</label>
                <Select value={form.platform} onValueChange={(v) => updateField("platform", v)} disabled={saving}>
                  {platforms.map((p) => {
                    const PlatformIcon = p.icon;

                    return (
                      <Select.Item key={p.value} value={p.value}>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "10px",
                          }}
                        >
                          <PlatformIcon
                            className={p.iconClass}
                            aria-hidden="true"
                          />
                          {p.label}
                        </span>
                      </Select.Item>
                    );
                  })}
                </Select>
              </div>

              <div className="form-group">
                <label className="modal-label"><Activity size={14} className="label-icon" /> Estado</label>
                <Select value={form.status} onValueChange={(v) => updateField("status", v)} disabled={saving}>
                  {statuses.map((s) => (
                    <Select.Item key={s.value} value={s.value}>{s.label}</Select.Item>
                  ))}
                </Select>
              </div>
            </div>

            <div className={`form-group${errors.url ? " has-error" : ""}`}>
              <label className="modal-label"><LinkIcon size={14} className="label-icon" /> URL original *</label>
              <input
                type="url"
                placeholder="https://www.instagram.com/p/..."
                value={form.url}
                onChange={(e) => updateField("url", e.target.value)}
                disabled={saving}
                aria-invalid={Boolean(errors.url)}
              />
              {errors.url && <span className="form-error">{errors.url}</span>}
            </div>

            <div className="form-group">
              <div className="merch-toggle-container">
                <div className="merch-toggle-text">
                  <label className="modal-label" style={{ border: 'none', marginBottom: 0 }}>
                    Destacar en la Home
                  </label>
                  <p>Esta noticia aparecerá en la sección principal de la página.</p>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) => updateField("featured", e.target.checked)}
                    disabled={saving}
                  />
                  <span className="slider round"></span>
                </label>
              </div>
            </div>
          </div>

          <div className="modal-col">
            <div className="form-group">
              <div className="cover-toolbar">
                <label className="modal-label">
                  <ImageIcon size={14} className="label-icon" /> Portada
                </label>

                <button
                  type="button"
                  onClick={handlePasteFromClipboard}
                  disabled={saving}
                  className="btn-extract"
                >
                  <FileText size={14} /> Pegar Imagen
                </button>
              </div>

              <ImageUploader
                value={coverFile}
                onChange={handleCoverChange}
                existingUrl={existingCoverUrl}
              />
              {errors.submit && <div className="form-error form-error-submit">{errors.submit}</div>}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="modal-cancel" onClick={onClose} disabled={saving}>Cancelar</button>
          <button type="submit" className="modal-save" disabled={saving}>
            {saving ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </form>
    </div>
  );
}