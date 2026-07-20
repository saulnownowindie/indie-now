import "./NewsCard.css";

import { FaInstagram, FaYoutube, FaTiktok } from "react-icons/fa";

export default function NewsCard({
  news,

  featured = false,
}) {
  return (
    <article className={featured ? "news-card featured" : "news-card"}>
      <a
        href={news.instagram}
        target="_blank"
        rel="noopener noreferrer"
        className="news-thumb"
      >
        <img src={news.thumbnail} alt={news.title} />

        <div className="news-overlay">
          <div className="play-button">▶</div>
        </div>
      </a>

      <div className="news-info">
        <span className="news-category">{news.category}</span>

        <h3>{news.title}</h3>

        <p>{news.description}</p>

        <small>{news.date}</small>

        <div className="news-socials">
          {news.instagram && (
            <a
              href={news.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <FaInstagram />
            </a>
          )}

          {news.youtube && (
            <a
              href={news.youtube}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
            >
              <FaYoutube />
            </a>
          )}

          {news.tiktok && (
            <a
              href={news.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
            >
              <FaTiktok />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
