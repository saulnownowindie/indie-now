import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Trash2 } from "lucide-react";

import "./Reels.css";

import PageLayout from "../../../components/admin/PageLayout/PageLayout";
import Button from "../../../components/admin/ui/Button";
import Badge from "../../../components/admin/ui/Badge";
import DataTable from "../../../components/admin/ui/DataTable";
import TableEmpty from "../../../components/admin/ui/TableEmpty";
import SearchInput from "../../../components/admin/ui/SearchInput/SearchInput";
import ReelModal from "../../../components/admin/modals/ReelModal";

import useReels from "../../../hooks/useReels";
import {
  deleteReel,
  requestReelPreview,
} from "../../../services/reelsService";
import { resolveMediaUrl } from "../../../utils/mediaUrl";

const platformLabels = {
  INSTAGRAM: "Instagram",
  TIKTOK: "TikTok",
  YOUTUBE: "YouTube",
  FACEBOOK: "Facebook",
  X: "X",
  THREADS: "Threads",
  OTHER: "Otro",
};

const previewStatusConfig = {
  ready: { label: "Preview listo", variant: "success" },
  pending: { label: "Preview pendiente", variant: "warning" },
  processing: { label: "Procesando…", variant: "info" },
  failed: { label: "Sin preview", variant: "danger" },
};

function getPreviewStatus(reel) {
  if (reel.previewStatus) {
    return (
      previewStatusConfig[reel.previewStatus] ||
      previewStatusConfig.failed
    );
  }

  if (reel.previewUrl) {
    return previewStatusConfig.ready;
  }

  return previewStatusConfig.failed;
}

function canQueuePreview(reel) {
  if (
    reel.previewStatus === "pending" ||
    reel.previewStatus === "processing" ||
    reel.previewStatus === "ready"
  ) {
    return false;
  }

  if (reel.previewStatus === "failed") {
    return true;
  }

  return !reel.previewUrl;
}

function formatDate(reel) {
  const value = reel.publishedAt || reel.createdAt;

  if (!value) {
    return "—";
  }

  return new Date(value).toLocaleDateString("es-PY");
}

export default function Reels() {
  const queryClient = useQueryClient();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingReel, setEditingReel] = useState(null);
  const [search, setSearch] = useState("");
  const [actionError, setActionError] = useState("");

  const { data: reels = [], isLoading, isError } = useReels();

  const removeReel = useMutation({
    mutationFn: deleteReel,

    onSuccess: async () => {
      setActionError("");

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["reels"] }),
        queryClient.invalidateQueries({ queryKey: ["public-reels"] }),
      ]);
    },

    onError: (error) => {
      setActionError(
        error.response?.data?.message ||
          "No se pudo eliminar el reel. Intenta nuevamente.",
      );
    },
  });

  const queuePreview = useMutation({
    mutationFn: ({ id, previewStart, regenerate = false }) =>
      requestReelPreview(id, previewStart ?? 1, regenerate),

    onSuccess: async () => {
      setActionError("");

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["reels"] }),
        queryClient.invalidateQueries({ queryKey: ["public-reels"] }),
      ]);
    },

    onError: (error) => {
      setActionError(
        error.response?.data?.message ||
          "No se pudo encolar el preview. Intenta nuevamente.",
      );
    },
  });

  const normalizedSearch = search.trim().toLowerCase();

  const filteredReels = reels.filter((reel) => {
    if (!normalizedSearch) {
      return true;
    }

    const title = reel.title?.toLowerCase() ?? "";
    const platform = platformLabels[reel.platform]?.toLowerCase() ?? "";

    return (
      title.includes(normalizedSearch) ||
      platform.includes(normalizedSearch)
    );
  });

  function openCreateModal() {
    setEditingReel(null);
    setModalOpen(true);
  }

  function openEditModal(reel) {
    setEditingReel(reel);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingReel(null);
  }

  function handleDelete(reel) {
    const confirmed = window.confirm(
      `¿Eliminar el reel "${reel.title}"? Esta acción no se puede deshacer.`,
    );

    if (!confirmed) {
      return;
    }

    removeReel.mutate(reel.id);
  }

  const isDeleting = removeReel.isPending;

  return (
    <>
      <PageLayout
        title="Reels"
        description="Administra los reels de Indie Now."
        action={
          <Button icon={<Plus size={18} />} onClick={openCreateModal}>
            Crear Nuevo Reel
          </Button>
        }
      >
        <div className="reels-toolbar">
          <SearchInput
            placeholder="Buscar reels..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <span className="reels-count">
            {filteredReels.length}{" "}
            {filteredReels.length === 1 ? "reel" : "reels"}
          </span>
        </div>

        {actionError && (
          <div className="reels-error" role="alert">
            {actionError}
          </div>
        )}

        <DataTable
          columns={[
            { key: "cover", label: "Portada" },
            { key: "title", label: "Título" },
            { key: "platform", label: "Plataforma" },
            { key: "preview", label: "Preview" },
            { key: "status", label: "Estado" },
            { key: "date", label: "Fecha" },
            { key: "actions", label: "Acciones" },
          ]}
        >
          {isLoading && (
            <tr>
              <td colSpan={7}>
                <TableEmpty
                  title="Cargando reels"
                  description="Obteniendo reels desde el servidor."
                />
              </td>
            </tr>
          )}

          {isError && (
            <tr>
              <td colSpan={7}>
                <TableEmpty
                  title="No se pudieron cargar los reels"
                  description="Verifica que la API esté funcionando."
                />
              </td>
            </tr>
          )}

          {!isLoading && !isError && filteredReels.length === 0 && (
            <tr>
              <td colSpan={7}>
                <TableEmpty
                  title={search ? "Sin resultados" : "No hay reels"}
                  description={
                    search
                      ? "No se encontraron reels para esta búsqueda."
                      : "Crea el primer reel para verlo en la lista."
                  }
                />
              </td>
            </tr>
          )}

          {!isLoading &&
            !isError &&
            filteredReels.map((reel) => {
              const coverUrl = resolveMediaUrl(
                reel.coverImage?.url || reel.coverUrl,
                160,
              );
              const previewStatus = getPreviewStatus(reel);
              const isQueueing =
                queuePreview.isPending &&
                queuePreview.variables?.id === reel.id;

              return (
                <tr key={reel.id}>
                  <td>
                    {coverUrl ? (
                      <img
                        src={coverUrl}
                        alt={reel.title}
                        className="reels-table-cover"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <span className="reels-table-no-cover">
                        Sin portada
                      </span>
                    )}
                  </td>

                  <td>
                    <strong className="reels-table-title">
                      {reel.title}
                    </strong>
                  </td>

                  <td>
                    {platformLabels[reel.platform] || reel.platform || "—"}
                  </td>

                  <td>
                    <div className="reels-preview-cell">
                      <Badge variant={previewStatus.variant}>
                        {previewStatus.label}
                      </Badge>

                      {canQueuePreview(reel) && (
                        <div className="reels-preview-actions">
                          <button
                            type="button"
                            className="reels-inline-action"
                            onClick={() => openEditModal(reel)}
                            disabled={isDeleting}
                          >
                            Subir archivo
                          </button>

                          <button
                            type="button"
                            className="reels-inline-action"
                            onClick={() =>
                              queuePreview.mutate({
                                id: reel.id,
                                previewStart: reel.previewStart ?? 1,
                                regenerate: Boolean(reel.previewUrl),
                              })
                            }
                            disabled={isQueueing || isDeleting}
                          >
                            {isQueueing
                              ? "Encolando…"
                              : "Generar con worker"}
                          </button>
                        </div>
                      )}
                    </div>
                  </td>

                  <td>
                    {reel.status === "PUBLISHED" ? (
                      <Badge variant="success">Publicado</Badge>
                    ) : (
                      <Badge variant="warning">Borrador</Badge>
                    )}
                  </td>

                  <td>{formatDate(reel)}</td>

                  <td>
                    <div className="reels-actions">
                      <Button
                        variant="outline"
                        size="sm"
                        icon={<Pencil size={15} />}
                        onClick={() => openEditModal(reel)}
                        disabled={isDeleting}
                        aria-label={`Editar ${reel.title}`}
                      >
                        Editar
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        icon={<Trash2 size={15} />}
                        className="reels-delete-button"
                        onClick={() => handleDelete(reel)}
                        disabled={isDeleting}
                        aria-label={`Eliminar ${reel.title}`}
                      >
                        {isDeleting && removeReel.variables === reel.id
                          ? "Eliminando..."
                          : "Eliminar"}
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
        </DataTable>
      </PageLayout>

      {modalOpen && (
        <ReelModal
          key={editingReel?.id ?? "new"}
          onClose={closeModal}
          reel={editingReel}
        />
      )}
    </>
  );
}
