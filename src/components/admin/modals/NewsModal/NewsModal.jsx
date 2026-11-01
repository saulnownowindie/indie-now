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
  Loader2 
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
import api from "../../../../services/api";
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
  const [searchingImage, setSearchingImage] = useState(false);
  
  const [extractedCoverId, setExtractedCoverId] = useState(null);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    if (errors[field] || errors.submit) {
      setErrors((current) => ({ ...current, [field]: "", submit: "" }));
    }
  }

  function handleCoverChange(file) {
    setCoverFile(file);
    setExtractedCoverId(null);
    if (file) {
      setRemoveCover(false);
      return;
    }
    setExistingCoverUrl(null);
    setRemoveCover(true);
  }

  async function handleAutoImage() {
    const title = form.title.trim();
    const url = form.url.trim();

    if (!title && !url) {
      setErrors({
        ...errors,
        title: "Escribe un título o una URL para buscar una imagen",
      });
      return;
    }

    setSearchingImage(true);
    setErrors({ ...errors, submit: "" });

    try {
      const { data } = await api.post("/image-search", { title, url });

      if (data.suggestedTitle && !form.title.trim()) {
        setForm((prev) => ({
          ...prev,
          title: prev.title.trim() ? prev.title : data.suggestedTitle,
        }));
      }

      if (data.url) {
        setExistingCoverUrl(data.url);
        setCoverFile(null);
        setRemoveCover(false);
        if (data.mediaId) setExtractedCoverId(data.mediaId);
      }
    } catch (error) {
      setErrors({ 
        ...errors, 
        submit: error.response?.data?.message || "No se pudo encontrar una imagen automáticamente." 
      });
    } finally {
      setSearchingImage(false);
    }
  }

  function validateForm() {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = "El título es obligatorio.";
    if (!form.categoryId) newErrors.categoryId = "La categoría es obligatoria.";
    if (!form.url.trim()) newErrors.url = "La URL es obligatoria.";
    
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
        payload.imageUrl = null;
      } else if (removeCover) {
        payload.coverImageId = null;
        payload.imageUrl = null;
      } else if (extractedCoverId) {
        payload.coverImageId = extractedCoverId;
        payload.imageUrl = null;
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
      setErrors({
        submit: error.response?.data?.message || "No se pudo guardar la noticia.",
      });
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
      <form className="modal news-modal" onSubmit={handleSubmit}>
        <div className="modal-header">
          <h2 style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Type size={24} color="var(--color-primary)" /> 
            {isEditing ? "Editar noticia" : "Nueva noticia"}
          </h2>
          <button type="button" className="modal-close" onClick={onClose} disabled={saving}>✕</button>
        </div>

        <div className="modal-body">
          <div className="form-grid">
            <div className="form-group">
              <label className="modal-label"><Type size={14} className="label-icon" /> Título *</label>
              <input
                type="text"
                placeholder="Título de la noticia"
                value={form.title}
                onChange={(e) => updateField("title", e.target.value)}
                disabled={saving}
              />
              {errors.title && <span className="form-error">{errors.title}</span>}
            </div>

            <div className="form-group">
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

          <div className="form-group">
            <label className="modal-label"><LinkIcon size={14} className="label-icon" /> URL original *</label>
            <input
              type="url"
              placeholder="https://www.instagram.com/p/..."
              value={form.url}
              onChange={(e) => updateField("url", e.target.value)}
              disabled={saving}
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

          <div className="form-group">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
              <label className="modal-label" style={{ margin: 0, border: "none" }}>
                <ImageIcon size={14} className="label-icon" /> Portada
              </label>
              
              {/* BOTÓN CON LA NUEVA CLASE btn-extract */}
              <button
                type="button"
                onClick={handleAutoImage}
                disabled={saving || searchingImage}
                className="btn-extract"
              >
                {searchingImage ? <Loader2 className="animate-spin" size={14} /> : <ImageIcon size={14} />}
                {searchingImage ? "Buscando..." : "Buscar portada automáticamente"}
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