import { useState } from "react";

import "./News.css";

import PageLayout from "../../../components/admin/PageLayout/PageLayout";
import SearchInput from "../../../components/admin/ui/SearchInput/SearchInput";
import Tabs from "../../../components/admin/ui/Tabs/Tabs";
import Button from "../../../components/admin/ui/Button";
import Badge from "../../../components/admin/ui/Badge";
import DataTable from "../../../components/admin/ui/DataTable";
import TableEmpty from "../../../components/admin/ui/TableEmpty";
import NewsModal from "../../../components/admin/modals/NewsModal";

import { Clock3, Archive, Trash2, Sparkles } from "lucide-react";

import useNews from "../../../hooks/useNews";

export default function News() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");

  const { data: news = [], isLoading, isError } = useNews();

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
              onChange={(e) => setSearch(e.target.value)}
            />

            <Button onClick={() => setOpen(true)}>+ Nueva noticia</Button>
          </div>
        </div>

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
                      src={
                        item.coverImage.url.startsWith("http")
                          ? item.coverImage.url
                          : `${import.meta.env.VITE_API_URL.replace(
                              "/api",
                              "",
                            )}${item.coverImage.url}`
                      }
                      alt={item.title}
                      className="news-table-cover"
                    />
                  ) : (
                    <span className="news-table-no-cover">Sin portada</span>
                  )}
                </td>

                <td>
                  <strong>{item.title}</strong>
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

                <td>—</td>
              </tr>
            ))}
        </DataTable>
      </PageLayout>

      <NewsModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
