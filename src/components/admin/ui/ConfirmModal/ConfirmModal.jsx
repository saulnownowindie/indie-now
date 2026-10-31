import { AlertTriangle } from "lucide-react";
import "./ConfirmModal.css";

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message, isDeleting }) {
  if (!isOpen) return null;

  return (
    <div className="confirm-modal-overlay" onClick={onClose}>
      <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="confirm-modal__icon">
          <AlertTriangle size={28} />
        </div>
        <h2 className="confirm-modal__title">{title || "Confirmar acción"}</h2>
        <p className="confirm-modal__message">{message}</p>
        
        <div className="confirm-modal__actions">
          <button type="button" className="confirm-modal__btn cancel" onClick={onClose} disabled={isDeleting}>
            Cancelar
          </button>
          <button type="button" className="confirm-modal__btn confirm" onClick={onConfirm} disabled={isDeleting}>
            {isDeleting ? "Eliminando..." : "Sí, eliminar"}
          </button>
        </div>
      </div>
    </div>
  );
}
