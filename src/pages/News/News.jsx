import "./News.css";

import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  FaExclamationTriangle,
  FaRedo,
  FaRegNewspaper,
} from "react-icons/fa";

import Card from "../../components/Card/Card";
import usePublicNews from "../../hooks/usePublicNews";
import {
  mapPublicList,
  normalizePublicNews,
} from "../../utils/publicContent";

const SKELETON_COUNT = 6;

function NewsCardSkeleton() {
  return (
    <div className="news-card-skeleton" aria-hidden="true">
      <div className="news-skeleton-media" />

      <div className="news-skeleton-body">
        <span className="news-skeleton-line news-skeleton-line--short" />
        <span className="news-skeleton-line" />
        <span className="news-skeleton-line news-skeleton-line--tiny" />
      </div>
    </div>
  );
}

export default function News() {
  const {
    data,
    isLoading,
    isError,
    refetch,
  } = usePublicNews();

  const news = useMemo(
    () => mapPublicList(data, normalizePublicNews),
    [data],
  );

  const showGrid = !isLoading && !isError && news.length > 0;

  return (
    <section className="news-page container" aria-busy={isLoading}>
      <header className="news-header">
        <span className="news-eyebrow">Indie Now</span>

        <h1 className="news-title">Últimas Noticias</h1>

        <p className="news-subtitle">
          Lanzamientos, sesiones y novedades de la escena indie.
        </p>
      </header>

      {isLoading && (
        <div className="news-grid" aria-label="Cargando noticias">
          {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
            <NewsCardSkeleton key={index} />
          ))}
        </div>
      )}

      {!isLoading && isError && (
        <div className="news-empty" role="alert">
          <span className="news-empty-icon" aria-hidden="true">
            <FaExclamationTriangle />
          </span>

          <h2>No pudimos cargar las noticias</h2>

          <p>
            Revisá tu conexión e intentá de nuevo en unos segundos.
          </p>

          <button
            type="button"
            className="news-empty-action"
            onClick={() => refetch()}
          >
            <FaRedo aria-hidden="true" />
            Reintentar
          </button>
        </div>
      )}

      {!isLoading && !isError && news.length === 0 && (
        <div className="news-empty">
          <span className="news-empty-icon" aria-hidden="true">
            <FaRegNewspaper />
          </span>

          <h2>Todavía no hay noticias publicadas</h2>

          <p>
            Estamos preparando las últimas novedades de la escena.
            Volvé pronto para no perdértelas.
          </p>

          <Link to="/" className="news-empty-action">
            Volver al inicio
          </Link>
        </div>
      )}

      {showGrid && (
        <div className="news-grid">
          {news.map((item) => (
            <Card
              key={item.id}
              image={item.image}
              category={item.category}
              title={item.title}
              date={item.date}
              url={item.url}
            />
          ))}
        </div>
      )}
    </section>
  );
}
