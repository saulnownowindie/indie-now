import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Trash2 } from "lucide-react";

import "./Merch.css";

import PageLayout from "../../../components/admin/PageLayout/PageLayout";
import Button from "../../../components/admin/ui/Button";
import Badge from "../../../components/admin/ui/Badge";
import DataTable from "../../../components/admin/ui/DataTable";
import TableEmpty from "../../../components/admin/ui/TableEmpty";
import SearchInput from "../../../components/admin/ui/SearchInput/SearchInput";
import MerchModal from "../../../components/admin/modals/MerchModal/MerchModal";

import useMerch from "../../../hooks/useMerch";
import { deleteMerch } from "../../../services/merchService";
import { resolveMediaUrl } from "../../../utils/mediaUrl";

export default function MerchPage() {
  const queryClient = useQueryClient();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingMerch, setEditingMerch] = useState(null);
  const [search, setSearch] = useState("");
  const [actionError, setActionError] = useState("");

  const { data: merch = [], isLoading, isError } = useMerch();

  const removeMerch = useMutation({
    mutationFn: deleteMerch,
    onSuccess: async () => {
      setActionError("");
      await queryClient.invalidateQueries({ queryKey: ["merch"] });
    },
    onError: (error) => {
      setActionError(error.response?.data?.message || "No se pudo eliminar el producto.");
    },
  });

  const normalizedSearch = search.trim().toLowerCase();

  const filteredMerch = merch.filter((item) => {
    if (!normalizedSearch) return true;
    const name = item.name?.toLowerCase() ?? "";
    const collection = item.collection?.toLowerCase() ?? "";
    return name.includes(normalizedSearch) || collection.includes(normalizedSearch);
  });

  function handleDelete(item) {
    if (window.confirm(`¿Eliminar el producto "${item.name}"?`)) {
      removeMerch.mutate(item.id);
    }
  }

  return (
    <>
      <PageLayout
        title="Merch"
        description="Administra los productos de Indie Now."
        action={
          <Button icon={<Plus size={18} />} onClick={() => { setEditingMerch(null); setModalOpen(true); }}>
            Crear Nuevo Producto
          </Button>
        }
      >
        <div className="merch-toolbar">
          <SearchInput
            placeholder="Buscar productos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span className="merch-count">{filteredMerch.length} productos</span>
        </div>

        {actionError && <div className="merch-error" role="alert">{actionError}</div>}

        <DataTable
          columns={[
            { key: "cover", label: "Imagen" },
            { key: "name", label: "Nombre" },
            { key: "collection", label: "Colección" },
            { key: "price", label: "Precio" },
            { key: "status", label: "Estado" },
            { key: "actions", label: "Acciones" },
          ]}
        >
          {isLoading && (
            <tr><td colSpan={6}><TableEmpty title="Cargando productos" description="Obteniendo datos..." /></td></tr>
          )}

          {isError && (
            <tr><td colSpan={6}><TableEmpty title="Error" description="No se pudieron cargar los productos." /></td></tr>
          )}

          {!isLoading && !isError && filteredMerch.length === 0 && (
            <tr><td colSpan={6}><TableEmpty title="No hay productos" description="Crea el primer producto." /></td></tr>
          )}

          {!isLoading && !isError && filteredMerch.map((item) => {
            const coverUrl = resolveMediaUrl(item.coverImage?.url || item.imageUrl);
            return (
              <tr key={item.id}>
                <td>
                  {coverUrl ? (
                    <img src={coverUrl} alt={item.name} className="merch-table-cover" loading="lazy" />
                  ) : (
                    <span className="merch-table-no-cover">Sin imagen</span>
                  )}
                </td>
                <td><strong>{item.name}</strong></td>
                <td>{item.collection || "—"}</td>
                <td>{item.price || "—"}</td>
                <td>
                  {item.status === "PUBLISHED" ? (
                    <Badge variant="success">Publicado</Badge>
                  ) : (
                    <Badge variant="warning">Borrador</Badge>
                  )}
                </td>
                <td>
                  <div className="merch-actions">
                    <Button variant="outline" size="sm" icon={<Pencil size={15} />} onClick={() => { setEditingMerch(item); setModalOpen(true); }}>
                      Editar
                    </Button>
                    <Button variant="ghost" size="sm" icon={<Trash2 size={15} />} className="merch-delete-button" onClick={() => handleDelete(item)}>
                      Eliminar
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </DataTable>
      </PageLayout>

      {modalOpen && (
        <MerchModal
          key={editingMerch?.id ?? "new"}
          onClose={() => setModalOpen(false)}
          merch={editingMerch}
        />
      )}
    </>
  );
}