import { User, Mail, LockKeyhole, Image as ImageIcon, FileText } from "lucide-react";
import "../NewsModal/NewsModal.css";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../../../auth/useAuth";

import ImageUploader from "../../ui/ImageUploader";

import { createUser, updateUser, uploadUserAvatar } from "../../../../services/usersService";
import { readImageFromClipboard } from "../../../../utils/clipboardImage";

export default function UserModal({ onClose, user = null }) {
  const { user: authUser, updateUserContext } = useAuth();
  const queryClient = useQueryClient();
  const isEditing = Boolean(user);

  const [form, setForm] = useState({
    name: user?.name ?? "",
    email: user?.email ?? "",
    password: "",
  });

  const [avatarFile, setAvatarFile] = useState(null);
  const [removeAvatar, setRemoveAvatar] = useState(false);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    if (errors[field] || errors.submit) {
      setErrors((current) => ({ ...current, [field]: "", submit: "" }));
    }
  }

  function handleAvatarChange(file) {
    setAvatarFile(file);
    if (file) {
      setRemoveAvatar(false);
      return;
    }
    setRemoveAvatar(true);
  }

  async function handlePasteFromClipboard() {
    try {
      const file = await readImageFromClipboard();
      handleAvatarChange(file);
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

    if (!form.name.trim()) {
      newErrors.name = "El nombre es obligatorio.";
    }

    if (!form.email.trim()) {
      newErrors.email = "El email es obligatorio.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      newErrors.email = "Ingresá un email válido.";
    }

    if (isEditing) {
      if (form.password && form.password.length < 6) {
        newErrors.password = "La contraseña debe tener al menos 6 caracteres.";
      }
    } else {
      if (!form.password) {
        newErrors.password = "La contraseña es obligatoria.";
      } else if (form.password.length < 6) {
        newErrors.password = "La contraseña debe tener al menos 6 caracteres.";
      }
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
        name: form.name.trim(),
        email: form.email.trim(),
      };

      if (form.password) {
        payload.password = form.password;
      }

      if (avatarFile) {
        const media = await uploadUserAvatar(avatarFile);
        payload.avatarUrl = media.url;
      } else if (removeAvatar) {
        payload.avatarUrl = null;
      } else {
        payload.avatarUrl = authUser?.avatarUrl;
      }

      if (isEditing) {
        const data = await updateUser(user.id, payload);

        await queryClient.invalidateQueries({ queryKey: ["users"] });

        // Si estamos editando al usuario logueado, actualizar el contexto inmediatamente
        if (isEditing && authUser && String(user.id) === String(authUser.id)) {
          const updatedUser = {
            ...authUser,
            name: data?.name ?? form.name.trim(),
            email: data?.email ?? form.email.trim(),
            avatarUrl: data?.avatarUrl ?? payload.avatarUrl,
          };
          updateUserContext(updatedUser);
        }

        onClose();
      } else {
        await createUser(payload);

        await queryClient.invalidateQueries({ queryKey: ["users"] });
        onClose();
      }
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
          : data?.message || "No se pudo guardar el usuario.";

      setErrors({ ...fieldErrors, submit: submitMessage });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="modal-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !saving) onClose();
      }}
    >
      <form className="modal user-modal" onSubmit={handleSubmit} noValidate>
        <div className="modal-header">
          <h2 style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <User size={24} color="var(--color-primary)" />
            {isEditing ? "Editar usuario" : "Nuevo usuario"}
          </h2>
          <button type="button" className="modal-close" onClick={onClose} disabled={saving}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          <div className="modal-col">
            <div className={`form-group${errors.name ? " has-error" : ""}`}>
              <label className="modal-label">
                <User size={14} className="label-icon" /> Nombre *
              </label>
              <input
                type="text"
                placeholder="Nombre del usuario"
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                disabled={saving}
                aria-invalid={Boolean(errors.name)}
              />
              {errors.name && <span className="form-error">{errors.name}</span>}
            </div>

            <div className={`form-group${errors.email ? " has-error" : ""}`}>
              <label className="modal-label">
                <Mail size={14} className="label-icon" /> Email *
              </label>
              <input
                type="email"
                placeholder="correo@indienow.com"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
                disabled={saving}
                aria-invalid={Boolean(errors.email)}
              />
              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>

            <div className={`form-group${errors.password ? " has-error" : ""}`}>
              <label className="modal-label">
                <LockKeyhole size={14} className="label-icon" /> Contraseña {isEditing ? "" : "*"}
              </label>
              <input
                type="password"
                placeholder={isEditing ? "Dejar en blanco para no cambiar" : "••••••••"}
                value={form.password}
                onChange={(e) => updateField("password", e.target.value)}
                disabled={saving}
                aria-invalid={Boolean(errors.password)}
              />
              {errors.password && (
                <span className="form-error">{errors.password}</span>
              )}
            </div>

            {errors.submit && !errors.name && !errors.email && !errors.password && (
              <div className="form-error form-error-submit">{errors.submit}</div>
            )}
          </div>

          <div className="modal-col">
            <div className="form-group">
              <div className="cover-toolbar">
                <label className="modal-label">
                  <ImageIcon size={14} className="label-icon" /> Avatar
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
                value={avatarFile}
                onChange={handleAvatarChange}
                existingUrl={removeAvatar ? null : (user?.avatarUrl ?? null)}
              />
              {errors.avatarUrl && (
                <span className="form-error">{errors.avatarUrl}</span>
              )}
              {errors.submit && (
                <div className="form-error form-error-submit">{errors.submit}</div>
              )}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="modal-cancel" onClick={onClose} disabled={saving}>
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