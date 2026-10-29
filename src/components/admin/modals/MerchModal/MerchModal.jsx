import "../NewsModal/NewsModal.css";
import "./MerchModal.css";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import ImageUploader from "../../ui/ImageUploader";
import Select from "../../ui/Select";

import {
  createMerch,
  updateMerch,
  uploadMerchCover,
} from "../../../../services/merchService";
import { resolveMediaUrl } from "../../../../utils/mediaUrl";

const statuses = [
  { value: "DRAFT", label: "Borrador" },
  { value: "PUBLISHED", label: "Publicado" },
];

const emptyForm = {
  name: "",
  description: "",
  collection: "",
  price: "",
  status: "DRAFT",
  featured: false,
};

export default function MerchModal({ onClose, merch = null }) {
  const queryClient = useQueryClient();
  const isEditing = Boolean(merch);

  const [form, setForm] = useState({
    name: merch?.name ?? "",
    description: merch?.description ?? "",
    collection: merch?.collection ?? "",
    price: merch?.price ?? "",
    status: merch?.status ?? emptyForm.status,
    featured: merch?.featured ?? false,
  });

  const [coverFile, setCoverFile] = useState(null);
  const [existingCoverUrl, setExistingCoverUrl] = useState(
    resolveMediaUrl(merch?.coverImage?.url || merch?.imageUrl)
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
    if (!form.name.trim()) newErrors.name = "El nombre es obligatorio.";
    if (!form.price.trim()) newErrors.price = "El precio es obligatorio.";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (saving || !validateForm()) return;

    setSaving(true);

    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        collection: form.collection.trim(),
        price: form.price.trim(),
        status: form.status,
        featured: form.featured,
      };

      if (coverFile) {
        const media = await uploadMerchCover(coverFile);
        payload.coverImageId = media.id;
        payload.imageUrl = null;
      } else if (removeCover) {
        payload.coverImageId = null;
        payload.imageUrl = null;
      }

      if (isEditing) {
        await updateMerch(merch.id, payload);
      } else {
        await createMerch(payload);
      }

      await queryClient.invalidateQueries({ queryKey: ["merch"] });
      onClose();
    } catch (error) {
      setErrors({
        submit: error.response?.data?.message || "No se pudo guardar el producto.",
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-overlay" onMouseDown={(e) => e.target === e.currentTarget && !saving && onClose()}>
      <form className="modal merch-modal" onSubmit={handleSubmit}>
        <div className="modal-header">
          <h2>{isEditing ? "Editar producto" : "Nuevo producto"}</h2>
          <button type="button" className="modal-close" onClick={onClose} disabled={saving}>✕</button>
        </div>

        <div className="modal-body">
          <div className="form-grid">
            <div className="form-group">
              <label>Nombre <span className="required">*</span></label>
              <input
                type="text"
                placeholder="Ej. Remera Indie Now"
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                disabled={saving}
              />
              {errors.name && <span className="form-error">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label>Precio <span className="required">*</span></label>
              <input
                type="text"
                placeholder="Ej. $20.000"
                value={form.price}
                onChange={(e) => updateField("price", e.target.value)}
                disabled={saving}
              />
              {errors.price && <span className="form-error">{errors.price}</span>}
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>Colección</label>
              <input
                type="text"
                placeholder="Ej. Verano 2026"
                value={form.collection}
                onChange={(e) => updateField("collection", e.target.value)}
                disabled={saving}
              />
            </div>

            <div className="form-group">
              <Select
                label="Estado"
                value={form.status}
                onValueChange={(value) => updateField("status", value)}
                disabled={saving}
              >
                {statuses.map((s) => (
                  <Select.Item key={s.value} value={s.value}>{s.label}</Select.Item>
                ))}
              </Select>
            </div>
          </div>

          <div className="form-group">
            <label>Descripción</label>
            <textarea
              placeholder="Detalles del producto..."
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              disabled={saving}
              rows={3}
            />
          </div>

          <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '10px' }}>
            <input
              type="checkbox"
              id="featured"
              checked={form.featured}
              onChange={(e) => updateField("featured", e.target.checked)}
              disabled={saving}
            />
            <label htmlFor="featured" style={{ margin: 0 }}>Destacar en la Home</label>
          </div>

          <ImageUploader
            label="Imagen del producto"
            value={coverFile}
            onChange={handleCoverChange}
            existingUrl={existingCoverUrl}
          />

          {errors.submit && <div className="form-error form-error-submit">{errors.submit}</div>}
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