import { useState } from "react";

import "./Media.css";

import PageLayout from "../../../components/admin/PageLayout/PageLayout";
import DataTable from "../../../components/admin/ui/DataTable";
import TableEmpty from "../../../components/admin/ui/TableEmpty";
import Pagination from "../../../components/admin/ui/Pagination/Pagination";

import useMedia from "../../../hooks/useMedia";
import { resolveMediaUrl } from "../../../utils/mediaUrl";

export default function MediaPage() {
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useMedia(page);
  const items = Array.isArray(data) ? data : data?.data ?? [];
  const pagination = data?.pagination;

  function formatDate(value) {
    if (!value) return "—";
    return new Date(value).toLocaleDateString("es-PY");
  }

  return (
    <PageLayout title="Media" eyebrow="Panel de Administración">
      <DataTable
        columns={[
          { key: "preview", label: "Vista previa" },
          { key: "name", label: "Archivo" },
          { key: "type", label: "Tipo" },
          { key: "date", label: "Fecha" },
        ]}
      >
        {isLoading && (
          <tr>
            <td colSpan={4}>
              <TableEmpty
                title="Cargando archivos"
                description="Obteniendo archivos desde el servidor."
              />
            </td>
          </tr>
        )}

        {isError && (
          <tr>
            <td colSpan={4}>
              <TableEmpty
                title="No se pudieron cargar los archivos"
                description="Verifica que la API esté funcionando."
              />
            </td>
          </tr>
        )}

        {!isLoading && !isError && items.length === 0 && (
          <tr>
            <td colSpan={4}>
              <TableEmpty
                title="No hay archivos"
                description="Todavía no se subieron archivos."
              />
            </td>
          </tr>
        )}

        {!isLoading &&
          !isError &&
          items.map((item) => {
            const previewUrl = resolveMediaUrl(item.url, 120);

            return (
              <tr key={item.id}>
                <td>
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt={item.originalName || "Archivo"}
                      className="media-table-preview"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <span>Sin vista previa</span>
                  )}
                </td>
                <td>{item.originalName || item.url || "—"}</td>
                <td>{item.type || "—"}</td>
                <td>{formatDate(item.createdAt)}</td>
              </tr>
            );
          })}
      </DataTable>

      <Pagination
        currentPage={page}
        totalPages={pagination?.totalPages ?? 1}
        onPageChange={setPage}
      />
    </PageLayout>
  );
}
