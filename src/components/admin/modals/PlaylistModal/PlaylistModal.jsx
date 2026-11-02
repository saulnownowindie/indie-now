import "../NewsModal/NewsModal.css";
import "./PlaylistModal.css";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Type, Music, Link, Activity, FileText, ListMusic, ArrowUpDown, Star, Image as ImageIcon } from "lucide-react";
import { FaSpotify, FaYoutube, FaTiktok } from "react-icons/fa6";

import ImageUploader from "../../ui/ImageUploader";
import Select from "../../ui/Select";

import {
  createPlaylist,
  updatePlaylist,
  uploadPlaylistCover,
} from "../../../../services/playlistsService";
import { resolveMediaUrl } from "../../../../utils/mediaUrl";
import { readImageFromClipboard } from "../../../../utils/clipboardImage";

const platforms = [
  { value: "SPOTIFY", label: "Spotify", icon: <FaSpotify className="platform-spotify" /> },
  { value: "YOUTUBE", label: "YouTube", icon: <FaYoutube className="platform-youtube" /> },
  { value: "TIKTOK", label: "TikTok", icon: <FaTiktok className="platform-tiktok" /> },
];

const statuses = [
  { value: "DRAFT", label: "Borrador" },
  { value: "PUBLISHED", label: "Publicado" },
];

function isValidUrl(value) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export default function PlaylistModal({ onClose, playlist = null }) {
  const queryClient = useQueryClient();
  const isEditing = Boolean(playlist);

  const [form, setForm] = useState({
    title: playlist?.title ?? "",
    platform: playlist?.platform ?? "SPOTIFY",
    url: playlist?.url ?? "",
    status: playlist?.status ?? "DRAFT",
    description: playlist?.description ?? "",
    sortOrder: playlist?.sortOrder ?? 0,
    featured: playlist?.featured ?? false,
  });

  const [coverFile, setCoverFile] = useState(null);
  const [existingCoverUrl, setExistingCoverUrl] = useState(
    resolveMediaUrl(playlist?.coverUrl || playlist?.coverImage?.url)
  );
  const [removeCover, setRemoveCover] = useState(false);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    if (errors[field] || errors.submit) setErrors((current) => ({ ...current, [field]: "", submit: "" }));
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

    if (!form.url.trim()) {
      newErrors.url = "La URL es obligatoria.";
    } else if (!isValidUrl(form.url.trim())) {
      newErrors.url = "Ingresá una URL válida (por ejemplo https://...).";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (saving || !validateForm()) return;

    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        platform: form.platform,
        url: form.url.trim(),
        status: form.status,
        description: form.description.trim(),
        sortOrder: Number(form.sortOrder),
        featured: form.featured,
        ownerName: "Indie Now",
        tracksCount: 0,
      };

      if (coverFile) {
        const media = await uploadPlaylistCover(coverFile);
        payload.coverImageId = media.id;
        payload.coverUrl = null;
      } else if (removeCover) {
        payload.coverImageId = null;
        payload.coverUrl = null;
      }

      if (isEditing) {
        await updatePlaylist(playlist.id, payload);
      } else {
        await createPlaylist(payload);
      }

      await queryClient.invalidateQueries({ queryKey: ["playlists"] });
      await queryClient.invalidateQueries({ queryKey: ["public-playlists"] });
      onClose();
    } catch (error) {
      setErrors({ submit: error.response?.data?.message || "No se pudo guardar la playlist." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <form className="modal playlist-modal" onSubmit={handleSubmit}>
        <div className="modal-header">
          <h2 style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <ListMusic size={24} color="var(--color-primary)" /> 
            {isEditing ? "Editar playlist" : "Nueva playlist"}
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
                  placeholder="Ej. Rock Paraguayo"
                  value={form.title}
                  onChange={(e) => updateField("title", e.target.value)}
                  disabled={saving}
                  aria-invalid={Boolean(errors.title)}
                />
                {errors.title && <span className="form-error">{errors.title}</span>}
              </div>

              <div className="form-group">
                <label className="modal-label"><Music size={14} className="label-icon" /> Plataforma *</label>
                <Select value={form.platform} onValueChange={(v) => updateField("platform", v)} disabled={saving}>
                  {platforms.map((p) => (
                    <Select.Item key={p.value} value={p.value}>
                      <span className="playlist-platform-option">
                        {p.icon}
                        {p.label}
                      </span>
                    </Select.Item>
                  ))}
                </Select>
              </div>
            </div>

            <div className={`form-group${errors.url ? " has-error" : ""}`}>
              <label className="modal-label"><Link size={14} className="label-icon" /> URL de la playlist *</label>
              <input
                type="url"
                placeholder="https://open.spotify.com/playlist/..."
                value={form.url}
                onChange={(e) => updateField("url", e.target.value)}
                disabled={saving}
                aria-invalid={Boolean(errors.url)}
              />
              {errors.url && <span className="form-error">{errors.url}</span>}
            </div>

            <div className="form-group">
              <label className="modal-label"><FileText size={14} className="label-icon" /> Descripción</label>
              <textarea
                placeholder="Contá de qué se trata la playlist..."
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
                disabled={saving}
                rows={3}
              />
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label className="modal-label"><Activity size={14} className="label-icon" /> Estado</label>
                <Select value={form.status} onValueChange={(v) => updateField("status", v)} disabled={saving}>
                  {statuses.map((s) => (
                    <Select.Item key={s.value} value={s.value}>{s.label}</Select.Item>
                  ))}
                </Select>
              </div>

              <div className="form-group">
                <label className="modal-label"><ArrowUpDown size={14} className="label-icon" /> Orden de aparición</label>
                <input
                  type="number"
                  value={form.sortOrder}
                  onChange={(e) => updateField("sortOrder", e.target.value)}
                  disabled={saving}
                  min="0"
                />
              </div>
            </div>

            <div className="form-group">
              <div className="merch-toggle-container">
                <div className="merch-toggle-text">
                  <label className="modal-label" style={{ border: 'none', marginBottom: 0 }}>
                    <Star size={14} className="label-icon" /> Destacar en la Home
                  </label>
                  <p>Aparecerá en "No Podés Perderte" y en el reproductor flotante.</p>
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
                  <ImageIcon size={14} className="label-icon" /> Portada de la playlist
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