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

import {
  CheckCircle2,
  Clock3,
  Archive,
  Trash2,
  Sparkles,
} from "lucide-react";

export default function News() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");

  const tabs = [
    { value: "all", label: "Todos", count: 0 },
    { value: "published", label: "Publicadas", count: 0 },
    { value: "draft", label: "Borradores", count: 0 },
    { value: "archived", label: "Archivadas", count: 0 },
    { value: "trash", label: "Papelera", count: 0 },
  ];

  return (
    <>
      <PageLayout
        title="Noticias"
        description="Gestiona todas las noticias de Indie Now."
      >
        <div className="news-status-bar">
          <Badge
            variant="success"
            icon={<CheckCircle2 size={12} />}
          >
            Publicado
          </Badge>

          <Badge
            variant="warning"
            icon={<Clock3 size={12} />}
          >
            Borrador
          </Badge>

          <Badge
            variant="neutral"
            icon={<Archive size={12} />}
          >
            Archivado
          </Badge>

          <Badge
            variant="danger"
            icon={<Trash2 size={12} />}
          >
            Papelera
          </Badge>

          <Badge
            variant="info"
            icon={<Sparkles size={12} />}
          >
            Nuevo
          </Badge>
        </div>

        <div className="news-toolbar">
          <Tabs
            items={tabs}
            value={tab}
            onChange={setTab}
          />

          <div className="news-toolbar__actions">
            <SearchInput
              placeholder="Buscar noticias..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <Button onClick={() => setOpen(true)}>
              + Nueva noticia
            </Button>
          </div>
        </div>

        <DataTable
          columns={[
            { key: "cover", label: "Portada" },
            { key: "title", label: "Título" },
            { key: "category", label: "Categoría" },
            { key: "status", label: "Estado" },
            { key: "date", label: "Fecha" },
            { key: "actions", label: "Acciones" },
          ]}
        >
          <tr>
            <td colSpan={6}>
              <TableEmpty
                title="Todavía no hay noticias"
                description="Cuando publiques la primera noticia aparecerá aquí."
              />
            </td>
          </tr>
        </DataTable>
      </PageLayout>

      <NewsModal
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}