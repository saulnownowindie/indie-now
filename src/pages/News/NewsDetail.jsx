import "./NewsDetail.css";

import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaExclamationTriangle,
  FaExternalLinkAlt,
  FaRedo,
  FaRegNewspaper,
} from "react-icons/fa";

import usePublicNewsDetail from "../../hooks/usePublicNewsDetail";
import { normalizePublicNews } from "../../utils/publicContent";

function getReadingTime(content) {
  if (!content) return 0;

  const words = content.trim().split(/\s+/).filter(Boolean).length;

  return Math.max(1, Math.ceil(words / 200));
}

function NewsDetailSkeleton() {
  return (
    <div
      className="news-detail news-detail--skeleton"
      aria-hidden="true"
    >
      <span className="detail-skeleton detail-skeleton--back" />

      <div className="detail-skeleton-heading">
        <span className="detail-skeleton detail-skeleton--category" />
        <span className="detail-skeleton detail-skeleton--title" />
        <span className="detail-skeleton detail-skeleton--title detail-skeleton--title-short" />
        <span className="detail-skeleton detail-skeleton--meta" />
      </div>

      <span className="detail-skeleton detail-skeleton--cover" />

      <div className="detail-skeleton-body">
        {Array.from({ length: 5 }).map((_, index) => (
          <span
            key={index}
            className="detail-skeleton detail-skeleton--line"
          />
        ))}
      </div>
    </div>
  );
}

export default function NewsDetail() {
  const { slug } = useParams();

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = usePublicNewsDetail(slug);

  const news = useMemo(
    () => (data ? normalizePublicNews(data) : null),
    [data],
  );

  const paragraphs = useMemo(() => {
    if (!news?.content) return [];

    return news.content
      .split(/\n{2,}/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean);
  }, [news]);

  const readingTime = getReadingTime(news?.content);

  if (isLoading) {
    return <NewsDetailSkeleton />;
  }

  if (isError && error?.response?.status !== 404) {
    return (
      <section className="news-detail news-detail--state">
        <div className="news-detail-empty" role="alert">
          <span className="news-detail-empty-icon" aria-hidden="true">
            <FaExclamationTriangle />
          </span>

          <h1>No pudimos cargar la noticia</h1>

          <p>
            Revisá tu conexión e intentá de nuevo en unos segundos.
          </p>

          <div className="news-detail-empty-actions">
            <button
              type="button"
              className="news-detail-action"
              onClick={() => refetch()}
            >
              <FaRedo aria-hidden="true" />
              Reintentar
            </button>

            <Link to="/noticias" className="news-detail-action">
              <FaArrowLeft aria-hidden="true" />
              Volver a Noticias
            </Link>
          </div>
        </div>
      </section>
    );
  }

  if (!news) {
    return (
      <section className="news-detail news-detail--state">
        <div className="news-detail-empty">
          <span className="news-detail-empty-icon" aria-hidden="true">
            <FaRegNewspaper />
          </span>

          <h1>Esta noticia no está disponible</h1>

          <p>
            Puede que haya sido despublicada o que el enlace ya no
            exista.
          </p>

          <Link to="/noticias" className="news-detail-action">
            <FaArrowLeft aria-hidden="true" />
            Volver a Noticias
          </Link>
        </div>
      </section>
    );
  }

  return (
    <article className="news-detail">
      <div className="news-detail-container">
        <Link to="/noticias" className="news-detail-back">
          <FaArrowLeft aria-hidden="true" />
          Volver a Noticias
        </Link>

        <header className="news-detail-header">
          <span className="news-detail-category">
            {news.category}
          </span>

          <h1 className="news-detail-title">{news.title}</h1>

          <div className="news-detail-meta">
            {news.author && (
              <span className="news-detail-author">
                Por {news.author}
              </span>
            )}

            {news.date && (
              <time dateTime={news.publishedAt || undefined}>
                {news.date}
              </time>
            )}

            {readingTime > 0 && (
              <span>{readingTime} min de lectura</span>
            )}
          </div>
        </header>

        {news.image && (
          <figure className="news-detail-cover">
            <img src={news.image} alt={news.title} />
          </figure>
        )}

        <div className="news-detail-body">
          {paragraphs.length > 0 ? (
            paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))
          ) : (
            <p className="news-detail-no-content">
              Esta noticia todavía no tiene el cuerpo completo.
              {news.url && news.url !== "#" && (
                <>
                  {" "}
                  Puedes leer la publicación original en{" "}
                  <a
                    href={news.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    la fuente
                  </a>
                  .
                </>
              )}
            </p>
          )}

          {paragraphs.length > 0 &&
            news.url &&
            news.url !== "#" && (
              <a
                className="news-detail-source"
                href={news.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                Ver la publicación original
                <FaExternalLinkAlt aria-hidden="true" />
              </a>
            )}

          <div className="news-detail-footer">
            <Link to="/noticias" className="news-detail-action">
              <FaArrowLeft aria-hidden="true" />
              Seguir leyendo noticias
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
