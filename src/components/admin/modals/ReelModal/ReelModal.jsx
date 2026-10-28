import "../NewsModal/NewsModal.css";
import "./ReelModal.css";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import ImageUploader from "../../ui/ImageUploader";
import Select from "../../ui/Select";

import {
  createReel,
  updateReel,
  uploadReelCover,
} from "../../../../services/reelsService";
import { resolveMediaUrl } from "../../../../utils/mediaUrl";

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
];

const platformLabels = {
  INSTAGRAM: "Instagram",
  TIKTOK: "TikTok",
  YOUTUBE: "YouTube",
  FACEBOOK: "Facebook",
  X: "X",
  THREADS: "Threads",
  OTHER: "Otro",
};

const statuses = [
  {
    value: "DRAFT",
    label: "Borrador",
  },
  {
    value: "PUBLISHED",
    label: "Publicado",
  },
];

const emptyForm = {
  title: "",
  platform: "",
  url: "",
  status: "DRAFT",
};

export default function ReelModal({ onClose, reel = null }) {
  const queryClient = useQueryClient();

  const isEditing = Boolean(reel);

  const [form, setForm] = useState({
    title: reel?.title ?? "",
    platform: reel?.platform ?? "",
    url: reel?.url ?? "",
    status: reel?.status ?? emptyForm.status,
  });
  const [coverFile, setCoverFile] = useState(null);
  const [existingCoverUrl, setExistingCoverUrl] = useState(
    resolveMediaUrl(reel?.coverImage?.url || reel?.coverUrl),
  );
  const [removeCover, setRemoveCover] = useState(false);

  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const platformOptions =
    reel?.platform && !platforms.some((item) => item.value === reel.platform)
      ? [
          ...platforms,
          {
            value: reel.platform,
            label: platformLabels[reel.platform] || reel.platform,
          },
        ]
      : platforms;

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
    } else if (title.length < 3) {
      newErrors.title = "El título debe tener al menos 3 caracteres.";
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
        status: form.status,
      };

      if (coverFile) {
        const media = await uploadReelCover(coverFile);

        payload.coverImageId = media.id;
        payload.coverUrl = null;
      } else if (removeCover) {
        payload.coverImageId = null;
        payload.coverUrl = null;
      }

      if (isEditing) {
        await updateReel(reel.id, payload);
      } else {
        await createReel(payload);
      }

      await queryClient.invalidateQueries({
        queryKey: ["reels"],
      });

      onClose();
    } catch (error) {
      setErrors({
        submit:
          error.response?.data?.message ||
          "No se pudo guardar el reel. Intenta nuevamente.",
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
      <form className="modal reel-modal" onSubmit={handleSubmit}>
        <div className="modal-header">
          <h2>{isEditing ? "Editar reel" : "Nuevo reel"}</h2>

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
              <label htmlFor="reel-title">
                Título <span className="required">*</span>
              </label>

              <input
                id="reel-title"
                type="text"
                placeholder="Título del reel"
                value={form.title}
                onChange={(event) =>
                  updateField("title", event.target.value)
                }
                disabled={saving}
                aria-invalid={Boolean(errors.title)}
                aria-describedby={
                  errors.title ? "reel-title-error" : undefined
                }
              />

              {errors.title && (
                <span id="reel-title-error" className="form-error">
                  {errors.title}
                </span>
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
                {platformOptions.map((platform) => (
                  <Select.Item
                    key={platform.value}
                    value={platform.value}
                  >
                    {platform.label}
                  </Select.Item>
                ))}
              </Select>

              {errors.platform && (
                <span className="form-error">{errors.platform}</span>
              )}
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="reel-url">
                URL del video <span className="required">*</span>
              </label>

              <input
                id="reel-url"
                type="url"
                placeholder="https://www.instagram.com/reel/..."
                value={form.url}
                onChange={(event) =>
                  updateField("url", event.target.value)
                }
                disabled={saving}
                aria-invalid={Boolean(errors.url)}
                aria-describedby={
                  errors.url ? "reel-url-error" : undefined
                }
              />

              {errors.url && (
                <span id="reel-url-error" className="form-error">
                  {errors.url}
                </span>
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

          <ImageUploader
            label="Imagen de portada"
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
