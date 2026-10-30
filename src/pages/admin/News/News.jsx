import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import "./News.css";

import PageLayout from "../../../components/admin/PageLayout/PageLayout";
import SearchInput from "../../../components/admin/ui/SearchInput/SearchInput";
import Tabs from "../../../components/admin/ui/Tabs/Tabs";
import Button from "../../../components/admin/ui/Button";
import Badge from "../../../components/admin/ui/Badge";
import DataTable from "../../../components/admin/ui/DataTable";
import TableEmpty from "../../../components/admin/ui/TableEmpty";
import NewsModal from "../../../components/admin/modals/NewsModal";

import {
  Clock3,
  Archive,
  Trash2,
  Sparkles,
  Pencil,
} from "lucide-react";

import useNews from "../../../hooks/useNews";
import { deleteNews } from "../../../services/newsService";

import { resolveMediaUrl } from "../../../utils/mediaUrl";

export default function News() {
  const queryClient = useQueryClient();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");
  const [actionError, setActionError] = useState("");

  const { data: news = [], isLoading, isError } = useNews();

  const removeNews = useMutation({
    mutationFn: deleteNews,

    onSuccess: async () => {
      setActionError("");

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["news"] }),
        queryClient.invalidateQueries({ queryKey: ["public-news"] }),
      ]);
    },

    onError: (error) => {
      setActionError(
        error.response?.data?.message ||
          "No se pudo eliminar la noticia. Intenta nuevamente.",
      );
    },
  });

  const filteredNews = news.filter((item) => {
    const matchesSearch = item.title
      ?.toLowerCase()
      .includes(search.toLowerCase());

    if (!matchesSearch) {
      return false;
    }

    if (tab === "published") {
      return item.status === "PUBLISHED";
    }

    if (tab === "draft") {
      return item.status === "DRAFT";
    }

    if (tab === "archived") {
      return false;
    }

    if (tab === "trash") {
      return false;
    }

    return true;
  });

  const tabs = [
    {
      value: "all",
      label: "Todos",
      count: news.length,
    },
    {
      value: "published",
      label: "Publicadas",
      count: news.filter((item) => item.status === "PUBLISHED").length,
    },
    {
      value: "draft",
      label: "Borradores",
      count: news.filter((item) => item.status === "DRAFT").length,
    },
    {
      value: "archived",
      label: "Archivadas",
      count: 0,
    },
    {
      value: "trash",
      label: "Papelera",
      count: 0,
    },
  ];

  function openCreateModal() {
    setEditingNews(null);
    setModalOpen(true);
  }

  function openEditModal(item) {
    setEditingNews(item);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingNews(null);
  }

  function handleDelete(item) {
    const confirmed = window.confirm(
      `¿Eliminar la noticia "${item.title}"? Esta acción no se puede deshacer.`,
    );

    if (!confirmed) {
      return;
    }

    removeNews.mutate(item.id);
  }

  const isDeleting = removeNews.isPending;

  return (
    <>
      <PageLayout title="Noticias" eyebrow="Panel de Administración">
        <div className="news-status-legend">
          <Badge variant="success">Publicado</Badge>

          <Badge variant="warning" icon={<Clock3 size={12} />}>
            Borrador
          </Badge>

          <Badge variant="neutral" icon={<Archive size={12} />}>
            Archivado
          </Badge>

          <Badge variant="danger" icon={<Trash2 size={12} />}>
            Papelera
          </Badge>

          <Badge variant="info" icon={<Sparkles size={12} />}>
            Nuevo
          </Badge>
        </div>

        <div className="news-toolbar">
          <Tabs items={tabs} value={tab} onChange={setTab} />

          <div className="news-toolbar__actions">
            <SearchInput
              placeholder="Buscar noticias..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />

            <Button onClick={openCreateModal}>+ Nueva noticia</Button>
          </div>
        </div>

        {actionError && (
          <div className="news-error" role="alert">
            {actionError}
          </div>
        )}

        <DataTable
          columns={[
            {
              key: "cover",
              label: "Portada",
            },
            {
              key: "title",
              label: "Título",
            },
            {
              key: "category",
              label: "Categoría",
            },
            {
              key: "status",
              label: "Estado",
            },
            {
              key: "date",
              label: "Fecha",
            },
            {
              key: "actions",
              label: "Acciones",
            },
          ]}
        >
          {isLoading && (
            <tr>
              <td colSpan={6}>
                <TableEmpty
                  title="Cargando noticias"
                  description="Obteniendo noticias desde el servidor."
                />
              </td>
            </tr>
          )}

          {isError && (
            <tr>
              <td colSpan={6}>
                <TableEmpty
                  title="No se pudieron cargar las noticias"
                  description="Verifica que la API esté funcionando."
                />
              </td>
            </tr>
          )}

          {!isLoading && !isError && filteredNews.length === 0 && (
            <tr>
              <td colSpan={6}>
                <TableEmpty
                  title="No hay noticias"
                  description="No se encontraron noticias para esta selección."
                />
              </td>
            </tr>
          )}

          {!isLoading &&
            !isError &&
            filteredNews.map((item) => (
              <tr key={item.id}>
                <td>
                  {item.coverImage?.url ? (
                    <img
                      src={resolveMediaUrl(item.coverImage.url, 160)}
                      alt={item.title}
                      className="news-table-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <span className="news-table-no-cover">Sin portada</span>
                  )}
                </td>

                <td>
                  <strong className="news-table-title">
                    {item.title}
                  </strong>
                </td>

                <td>{item.category?.name || "Sin categoría"}</td>

                <td>
                  {item.status === "PUBLISHED" ? (
                    <Badge variant="success">Publicado</Badge>
                  ) : (
                    <Badge variant="warning">Borrador</Badge>
                  )}
                </td>

                <td>
                  {item.publishedAt
                    ? new Date(item.publishedAt).toLocaleDateString("es-PY")
                    : new Date(item.createdAt).toLocaleDateString("es-PY")}
                </td>

                <td>
                  <div className="news-actions">
                    <Button
                      variant="outline"
                      size="sm"
                      icon={<Pencil size={15} />}
                      onClick={() => openEditModal(item)}
                      disabled={isDeleting}
                      aria-label={`Editar ${item.title}`}
                    >
                      Editar
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      icon={<Trash2 size={15} />}
                      className="news-delete-button"
                      onClick={() => handleDelete(item)}
                      disabled={isDeleting}
                      aria-label={`Eliminar ${item.title}`}
                    >
                      {isDeleting && removeNews.variables === item.id
                        ? "Eliminando..."
                        : "Eliminar"}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
        </DataTable>
      </PageLayout>

      {modalOpen && (
        <NewsModal
          key={editingNews?.id ?? "new"}
          onClose={closeModal}
          news={editingNews}
        />
      )}
    </>
  );
}
