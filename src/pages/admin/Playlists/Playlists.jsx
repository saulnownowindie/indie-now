import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Trash2 } from "lucide-react";

import "./Playlists.css";

import PageLayout from "../../../components/admin/PageLayout/PageLayout";
import Button from "../../../components/admin/ui/Button";
import Badge from "../../../components/admin/ui/Badge";
import DataTable from "../../../components/admin/ui/DataTable";
import TableEmpty from "../../../components/admin/ui/TableEmpty";
import SearchInput from "../../../components/admin/ui/SearchInput/SearchInput";
import PlaylistModal from "../../../components/admin/modals/PlaylistModal/PlaylistModal";

import usePlaylists from "../../../hooks/usePlaylists";
import { deletePlaylist } from "../../../services/playlistsService";
import { resolveMediaUrl } from "../../../utils/mediaUrl";
import { getPlaylistPlatform } from "../../../utils/playlistPlatforms";

export default function PlaylistsPage() {
  const queryClient = useQueryClient();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingPlaylist, setEditingPlaylist] = useState(null);
  const [search, setSearch] = useState("");
  const [actionError, setActionError] = useState("");

  const { data: playlists = [], isLoading, isError } = usePlaylists();

  const removePlaylist = useMutation({
    mutationFn: deletePlaylist,
    onSuccess: async () => {
      setActionError("");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["playlists"] }),
        queryClient.invalidateQueries({ queryKey: ["public-playlists"] }),
      ]);
    },
    onError: (error) => {
      setActionError(
        error.response?.data?.message || "No se pudo eliminar la playlist.",
      );
    },
  });

  const normalizedSearch = search.trim().toLowerCase();

  const filteredPlaylists = playlists.filter((item) => {
    if (!normalizedSearch) return true;

    const title = item.title?.toLowerCase() ?? "";
    const owner = item.ownerName?.toLowerCase() ?? "";
    const platform = getPlaylistPlatform(item.platform).label.toLowerCase();

    return (
      title.includes(normalizedSearch) ||
      owner.includes(normalizedSearch) ||
      platform.includes(normalizedSearch)
    );
  });

  function handleDelete(item) {
    if (window.confirm(`¿Eliminar la playlist "${item.title}"?`)) {
      removePlaylist.mutate(item.id);
    }
  }

  return (
    <>
      <PageLayout
        title="Playlists"
        description="Administra las playlists de Spotify, YouTube y TikTok."
        action={
          <Button
            icon={<Plus size={18} />}
            onClick={() => {
              setEditingPlaylist(null);
              setModalOpen(true);
            }}
          >
            Crear Nueva Playlist
          </Button>
        }
      >
        <div className="playlists-toolbar">
          <SearchInput
            placeholder="Buscar playlists..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <span className="playlists-count">
            {filteredPlaylists.length} playlists
          </span>
        </div>

        {actionError && (
          <div className="playlists-error" role="alert">
            {actionError}
          </div>
        )}

        <DataTable
          columns={[
            { key: "cover", label: "Portada" },
            { key: "title", label: "Título" },
            { key: "platform", label: "Plataforma" },
            { key: "tracks", label: "Canciones" },
            { key: "status", label: "Estado" },
            { key: "featured", label: "Home" },
            { key: "actions", label: "Acciones" },
          ]}
        >
          {isLoading && (
            <tr>
              <td colSpan={7}>
                <TableEmpty
                  title="Cargando playlists"
                  description="Obteniendo datos..."
                />
              </td>
            </tr>
          )}

          {isError && (
            <tr>
              <td colSpan={7}>
                <TableEmpty
                  title="Error"
                  description="No se pudieron cargar las playlists."
                />
              </td>
            </tr>
          )}

          {!isLoading && !isError && filteredPlaylists.length === 0 && (
            <tr>
              <td colSpan={7}>
                <TableEmpty
                  title="No hay playlists"
                  description="Crea la primera playlist."
                />
              </td>
            </tr>
          )}

          {!isLoading &&
            !isError &&
            filteredPlaylists.map((item) => {
              const coverUrl = resolveMediaUrl(item.coverUrl);
              const platform = getPlaylistPlatform(item.platform);
              const PlatformIcon = platform.icon;

              return (
                <tr key={item.id}>
                  <td>
                    {coverUrl ? (
                      <img
                        src={coverUrl}
                        alt={item.title}
                        className="playlists-table-cover"
                        loading="lazy"
                      />
                    ) : (
                      <span className="playlists-table-no-cover">
                        Sin portada
                      </span>
                    )}
                  </td>
                  <td>
                    <strong>{item.title}</strong>
                    {item.ownerName && (
                      <span className="playlists-table-owner">
                        {item.ownerName}
                      </span>
                    )}
                  </td>
                  <td>
                    <span className="playlists-platform">
                      <PlatformIcon aria-hidden="true" />
                      {platform.label}
                    </span>
                  </td>
                  <td>{item.tracksCount ?? "—"}</td>
                  <td>
                    {item.status === "PUBLISHED" ? (
                      <Badge variant="success">Publicado</Badge>
                    ) : (
                      <Badge variant="warning">Borrador</Badge>
                    )}
                  </td>
                  <td>
                    {item.featured ? (
                      <Badge variant="info">Destacada</Badge>
                    ) : (
                      <Badge variant="neutral">No</Badge>
                    )}
                  </td>
                  <td>
                    <div className="playlists-actions">
                      <Button
                        variant="outline"
                        size="sm"
                        icon={<Pencil size={15} />}
                        onClick={() => {
                          setEditingPlaylist(item);
                          setModalOpen(true);
                        }}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={<Trash2 size={15} />}
                        className="playlists-delete-button"
                        onClick={() => handleDelete(item)}
                      >
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
        <PlaylistModal
          key={editingPlaylist?.id ?? "new"}
          onClose={() => setModalOpen(false)}
          playlist={editingPlaylist}
        />
      )}
    </>
  );
}
