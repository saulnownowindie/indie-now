import "./Reels.css";

import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaExclamationTriangle,
  FaRedo,
  FaRegPlayCircle,
  FaVideo,
} from "react-icons/fa";

import ReelCard from "../../components/ReelCard/ReelCard";
import usePublicReels from "../../hooks/usePublicReels";
import {
  mapPublicList,
  normalizePublicReel,
} from "../../utils/publicContent";

const SKELETON_COUNT = 6;

const FILTERS = [
  { value: "ALL", label: "Todos" },
  { value: "INSTAGRAM", label: "Instagram" },
  { value: "TIKTOK", label: "TikTok" },
  { value: "YOUTUBE", label: "YouTube" },
];

function ReelCardSkeleton() {
  return (
    <div className="reel-card-skeleton" aria-hidden="true">
      <span className="reel-skeleton-line reel-skeleton-line--short" />
      <span className="reel-skeleton-line" />
    </div>
  );
}

export default function Reels() {
  const {
    data,
    isLoading,
    isError,
    refetch,
  } = usePublicReels();

  const [platform, setPlatform] = useState("ALL");

  const reels = useMemo(
    () => mapPublicList(data, normalizePublicReel),
    [data],
  );

  const counts = useMemo(() => {
    return reels.reduce(
      (accumulator, reel) => {
        const code = reel.platformCode || "OTHER";

        accumulator.ALL += 1;
        accumulator[code] = (accumulator[code] || 0) + 1;

        return accumulator;
      },
      { ALL: 0 },
    );
  }, [reels]);

  const visibleReels = useMemo(() => {
    if (platform === "ALL") return reels;

    return reels.filter(
      (reel) => (reel.platformCode || "OTHER") === platform,
    );
  }, [reels, platform]);

  const showFilters = !isLoading && !isError && reels.length > 0;

  const showGrid =
    !isLoading && !isError && reels.length > 0;

  return (
    <section className="reels-page container" aria-busy={isLoading}>
      <header className="reels-header">
        <span className="reels-eyebrow">Indie Now</span>

        <h1 className="reels-title">Nuestros Reels</h1>

        <p className="reels-subtitle">
          Lo mejor de nuestras redes en formato vertical: sesiones,
          backstage y momentos de la escena indie.
        </p>
      </header>

      {showFilters && (
        <div className="reels-toolbar">
          <div
            className="reels-filters"
            role="group"
            aria-label="Filtrar reels por plataforma"
          >
            {FILTERS.map((filter) => {
              const count = counts[filter.value] || 0;
              const isActive = platform === filter.value;

              return (
                <button
                  key={filter.value}
                  type="button"
                  className={`reels-filter${isActive ? " is-active" : ""}`}
                  onClick={() => setPlatform(filter.value)}
                  aria-pressed={isActive}
                >
                  {filter.label}

                  <span className="reels-filter-count">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <span className="reels-count" aria-live="polite">
            {visibleReels.length}{" "}
            {visibleReels.length === 1 ? "reel" : "reels"}
          </span>
        </div>
      )}

      {isLoading && (
        <div className="reels-grid" aria-label="Cargando reels">
          {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
            <ReelCardSkeleton key={index} />
          ))}
        </div>
      )}

      {!isLoading && isError && (
        <div className="reels-empty" role="alert">
          <span className="reels-empty-icon" aria-hidden="true">
            <FaExclamationTriangle />
          </span>

          <h2>No pudimos cargar los reels</h2>

          <p>
            Revisá tu conexión e intentá de nuevo en unos segundos.
          </p>

          <button
            type="button"
            className="reels-empty-action"
            onClick={() => refetch()}
          >
            <FaRedo aria-hidden="true" />
            Reintentar
          </button>
        </div>
      )}

      {!isLoading && !isError && reels.length === 0 && (
        <div className="reels-empty">
          <span className="reels-empty-icon" aria-hidden="true">
            <FaVideo />
          </span>

          <h2>Todavía no hay reels publicados</h2>

          <p>
            Estamos preparando los mejores momentos de nuestras redes.
            Volvé pronto para verlos.
          </p>

          <Link to="/" className="reels-empty-action">
            Volver al inicio
          </Link>
        </div>
      )}

      {showGrid && visibleReels.length === 0 && (
        <div className="reels-filter-empty">
          <span className="reels-filter-empty-icon" aria-hidden="true">
            <FaRegPlayCircle />
          </span>

          <p>
            Todavía no hay reels de{" "}
            {FILTERS.find((filter) => filter.value === platform)?.label}.
          </p>

          <button
            type="button"
            className="reels-empty-action"
            onClick={() => setPlatform("ALL")}
          >
            Ver todos los reels
          </button>
        </div>
      )}

      {showGrid && visibleReels.length > 0 && (
        <div className="reels-grid">
          {visibleReels.map((reel) => (
            <ReelCard
              key={reel.id}
              image={reel.image}
              platform={reel.platform}
              title={reel.title}
              url={reel.url}
              videoUrl={reel.videoUrl}
              embedUrl={reel.embedUrl}
            />
          ))}
        </div>
      )}
    </section>
  );
}
