import "./Pagination.css";

export default function Pagination({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
}) {
  if (!totalPages || totalPages <= 1) {
    return null;
  }

  const previousPage = Math.max(1, currentPage - 1);
  const nextPage = Math.min(totalPages, currentPage + 1);

  return (
    <nav className="admin-pagination" aria-label="Paginación">
      <button
        type="button"
        className="admin-pagination__button"
        disabled={currentPage <= 1}
        onClick={() => onPageChange?.(previousPage)}
      >
        Anterior
      </button>

      <span className="admin-pagination__status">
        Página {currentPage} de {totalPages}
      </span>

      <button
        type="button"
        className="admin-pagination__button"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange?.(nextPage)}
      >
        Siguiente
      </button>
    </nav>
  );
}
