import "../NewsModal/NewsModal.css";
import "./PlaylistModal.css";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import ImageUploader from "../../ui/ImageUploader";
import Select from "../../ui/Select";

import {
  createPlaylist,
  updatePlaylist,
  uploadPlaylistCover,
} from "../../../../services/playlistsService";
import { resolveMediaUrl } from "../../../../utils/mediaUrl";
import { playlistPlatformOptions } from "../../../../utils/playlistPlatforms";

const statuses = [
  { value: "DRAFT", label: "Borrador" },
  { value: "PUBLISHED", label: "Publicado" },
];

const emptyForm = {
  title: "",
  platform: "SPOTIFY",
  url: "",
  description: "",
  ownerName: "",
  tracksCount: "",
  status: "DRAFT",
  featured: false,
  isVisible: true,
  sortOrder: "0",
};

export default function PlaylistModal({ onClose, playlist = null }) {
  const queryClient = useQueryClient();
  const isEditing = Boolean(playlist);

  const [form, setForm] = useState({
    title: playlist?.title ?? "",
    platform: playlist?.platform ?? emptyForm.platform,
    url: playlist?.url || playlist?.spotifyUrl || "",
    description: playlist?.description ?? "",
    ownerName: playlist?.ownerName ?? "",
    tracksCount:
      playlist?.tracksCount !== null && playlist?.tracksCount !== undefined
        ? String(playlist.tracksCount)
        : "",
    status: playlist?.status ?? emptyForm.status,
    featured: playlist?.featured ?? false,
    isVisible: playlist?.isVisible ?? true,
    sortOrder: String(playlist?.sortOrder ?? emptyForm.sortOrder),
  });

  const [coverFile, setCoverFile] = useState(null);
  const [existingCoverUrl, setExistingCoverUrl] = useState(
    resolveMediaUrl(playlist?.coverUrl),
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

  function validateForm() {
    const newErrors = {};
    const title = form.title.trim();
    const url = form.url.trim();

    if (!title) {
      newErrors.title = "El título es obligatorio.";
    } else if (title.length < 2) {
      newErrors.title = "El título debe tener al menos 2 caracteres.";
    }

    if (!form.platform) {
      newErrors.platform = "Selecciona una plataforma.";
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

    const tracksCount = Number(form.tracksCount);

    if (
      form.tracksCount !== "" &&
      (!Number.isInteger(tracksCount) || tracksCount < 0)
    ) {
      newErrors.tracksCount =
        "Ingresa un número entero mayor o igual a 0.";
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
        platform: form.platform,
        url: form.url.trim(),
        description: form.description.trim() || null,
        ownerName: form.ownerName.trim() || null,
        tracksCount:
          form.tracksCount === "" ? null : Number(form.tracksCount),
        status: form.status,
        featured: form.featured,
        isVisible: form.isVisible,
        sortOrder: Number(form.sortOrder),
      };

      if (coverFile) {
        payload.coverUrl = await uploadPlaylistCover(coverFile);
      } else if (removeCover) {
        payload.coverUrl = null;
      }

      if (isEditing) {
        await updatePlaylist(playlist.id, payload);
      } else {
        await createPlaylist(payload);
      }

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["playlists"] }),
        queryClient.invalidateQueries({ queryKey: ["public-playlists"] }),
      ]);

      onClose();
    } catch (error) {
      setErrors({
        submit:
          error.response?.data?.message ||
          error.message ||
          "No se pudo guardar la playlist. Intenta nuevamente.",
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="modal-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !saving) {
          onClose();
        }
      }}
    >
      <form className="modal playlist-modal" onSubmit={handleSubmit}>
        <div className="modal-header">
          <h2>{isEditing ? "Editar playlist" : "Nueva playlist"}</h2>

          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            disabled={saving}
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        <div className="modal-body">
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="playlist-title">
                Título <span className="required">*</span>
              </label>

              <input
                id="playlist-title"
                type="text"
                placeholder="Ej. Rock Paraguayo"
                value={form.title}
                onChange={(event) =>
                  updateField("title", event.target.value)
                }
                disabled={saving}
                aria-invalid={Boolean(errors.title)}
              />

              {errors.title && (
                <span className="form-error">{errors.title}</span>
              )}
            </div>

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
                placeholder="Selecciona una plataforma"
                disabled={saving}
              >
                {playlistPlatformOptions.map((platform) => {
                  const Icon = platform.icon;

                  return (
                    <Select.Item
                      key={platform.value}
                      value={platform.value}
                    >
                      <span className="playlist-platform-option">
                        <Icon aria-hidden="true" />
                        {platform.label}
                      </span>
                    </Select.Item>
                  );
                })}
              </Select>

              {errors.platform && (
                <span className="form-error">{errors.platform}</span>
              )}
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="playlist-url">
                URL de la playlist <span className="required">*</span>
              </label>

              <input
                id="playlist-url"
                type="url"
                placeholder="https://open.spotify.com/playlist/..."
                value={form.url}
                onChange={(event) =>
                  updateField("url", event.target.value)
                }
                disabled={saving}
                aria-invalid={Boolean(errors.url)}
              />

              {errors.url && (
                <span className="form-error">{errors.url}</span>
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
                {statuses.map((status) => (
                  <Select.Item
                    key={status.value}
                    value={status.value}
                  >
                    {status.label}
                  </Select.Item>
                ))}
              </Select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="playlist-description">Descripción</label>

            <textarea
              id="playlist-description"
              placeholder="Contá de qué se trata la playlist..."
              value={form.description}
              onChange={(event) =>
                updateField("description", event.target.value)
              }
              disabled={saving}
              rows={3}
            />
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="playlist-owner">Creador</label>

              <input
                id="playlist-owner"
                type="text"
                placeholder="Ej. Indie Now"
                value={form.ownerName}
                onChange={(event) =>
                  updateField("ownerName", event.target.value)
                }
                disabled={saving}
              />
            </div>

            <div className="form-group">
              <label htmlFor="playlist-tracks">Cantidad de canciones</label>

              <input
                id="playlist-tracks"
                type="number"
                min="0"
                step="1"
                placeholder="Ej. 40"
                value={form.tracksCount}
                onChange={(event) =>
                  updateField("tracksCount", event.target.value)
                }
                disabled={saving}
                aria-invalid={Boolean(errors.tracksCount)}
              />

              {errors.tracksCount && (
                <span className="form-error">{errors.tracksCount}</span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="playlist-sort-order">Orden de aparición</label>

            <input
              id="playlist-sort-order"
              type="number"
              min="0"
              step="1"
              value={form.sortOrder}
              onChange={(event) =>
                updateField("sortOrder", event.target.value)
              }
              disabled={saving}
              aria-invalid={Boolean(errors.sortOrder)}
            />

            {errors.sortOrder && (
              <span className="form-error">{errors.sortOrder}</span>
            )}
          </div>

          <div className="playlist-toggles">
            <label className="playlist-toggle">
              <span>
                <strong>Destacar en la Home</strong>
                <small>Aparecerá en “No Podés Perderte”.</small>
              </span>

              <input
                type="checkbox"
                checked={form.featured}
                onChange={(event) =>
                  updateField("featured", event.target.checked)
                }
                disabled={saving}
              />
            </label>

            <label className="playlist-toggle">
              <span>
                <strong>Visible</strong>
                <small>Se puede mostrar en el sitio público.</small>
              </span>

              <input
                type="checkbox"
                checked={form.isVisible}
                onChange={(event) =>
                  updateField("isVisible", event.target.checked)
                }
                disabled={saving}
              />
            </label>
          </div>

          <ImageUploader
            label="Portada de la playlist"
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
            onClick={onClose}
            disabled={saving}
          >
            Cancelar
          </button>

          <button type="submit" className="modal-save" disabled={saving}>
            {saving ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </form>
    </div>
  );
}
