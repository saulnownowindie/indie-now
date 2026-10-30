import "./NewsCard.css";

import { memo } from "react";

import {
  FaInstagram,
  FaYoutube,
  FaTiktok,
  FaFacebook,
} from "react-icons/fa";

import { resolveMediaUrl } from "../../utils/mediaUrl";

function PlatformIcon({ platform }) {
  switch (platform) {
    case "INSTAGRAM":
      return <FaInstagram />;

    case "YOUTUBE":
      return <FaYoutube />;

    case "TIKTOK":
      return <FaTiktok />;

    case "FACEBOOK":
      return <FaFacebook />;

    default:
      return null;
  }
}

function formatDate(date) {
  if (!date) return null;

  return new Intl.DateTimeFormat("es-PY", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

function NewsCard({
  news,
  featured = false,
}) {
  const categoryName =
    news.category?.name || "Noticias";

  const description =
    news.seoDescription ||
    "Conocé esta noticia de Indie Now.";

  const date = formatDate(news.publishedAt);

  const coverUrl = resolveMediaUrl(news.coverImage?.url, 900);

  const supportedPlatform = [
    "INSTAGRAM",
    "YOUTUBE",
    "TIKTOK",
    "FACEBOOK",
  ].includes(news.platform);

  return (
    <article
      className={
        featured
          ? "news-card featured"
          : "news-card"
      }
    >
      <a
        className="news-thumb"
        href={news.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Ver contenido: ${news.title}`}
      >
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={news.title}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="news-placeholder">
            <span>INDIE NOW</span>
          </div>
        )}

        <div className="news-overlay">
          <div className="play-button">
            ▶
          </div>
        </div>
      </a>

      <div className="news-info">
        <span className="news-category">
          {categoryName}
        </span>

        <h3>{news.title}</h3>

        <p>{description}</p>

        {date && (
          <small>{date}</small>
        )}

        {news.url && (
          <div className="news-socials">
            <a
              href={news.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Ver en ${news.platform}`}
              title={`Ver en ${news.platform}`}
            >
              <PlatformIcon
                platform={news.platform}
              />

              {!supportedPlatform && (
                <span>{news.platform}</span>
              )}
            </a>
          </div>
        )}
      </div>
    </article>
  );
}

export default memo(NewsCard);