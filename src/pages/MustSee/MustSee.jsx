import "./MustSee.css";

import { useMemo } from "react";

import PlaylistCard from "../../components/PlaylistCard/PlaylistCard";
import usePublicPlaylists from "../../hooks/usePublicPlaylists";
import {
  mapPublicList,
  normalizePublicPlaylist,
} from "../../utils/publicContent";

export default function MustSee() {
  const { data, isLoading, isError, refetch } = usePublicPlaylists();

  const playlists = useMemo(
    () => mapPublicList(data, normalizePublicPlaylist),
    [data],
  );

  return (
    <section className="must-see container" aria-busy={isLoading}>
      <header className="must-see__header">
        <h1 className="must-see__title">No Podés Perderte</h1>

        <p className="must-see__subtitle">
          Nuestras playlists para escuchar en tu plataforma favorita.
        </p>
      </header>

      {isLoading && (
        <p className="must-see__state">Cargando playlists...</p>
      )}

      {!isLoading && isError && (
        <div className="must-see__state" role="alert">
          <p>No pudimos cargar las playlists.</p>

          <button
            type="button"
            className="button-primary"
            onClick={() => refetch()}
          >
            Reintentar
          </button>
        </div>
      )}

      {!isLoading && !isError && playlists.length === 0 && (
        <p className="must-see__state">
          Todavía no hay playlists publicadas.
        </p>
      )}

      {!isLoading && !isError && playlists.length > 0 && (
        <div className="must-see__grid">
          {playlists.map((playlist) => (
            <PlaylistCard key={playlist.id} playlist={playlist} />
          ))}
        </div>
      )}
    </section>
  );
}
