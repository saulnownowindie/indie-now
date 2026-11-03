import { Link } from "react-router-dom";
import { resolveMediaUrl } from "../../utils/mediaUrl";
import { FaNewspaper } from "react-icons/fa";
import "./NewsCard.css";

export default function NewsCard({ news }) {
  // 1. Resolvemos la imagen (con la transformación de Cloudinary si aplica)
  const imageUrl = resolveMediaUrl(news.coverImage?.url || news.imageUrl, 720);
  
  // 2. Verificamos si hay contenido local para mostrar el detalle
  const hasContent = Boolean(news.content && news.content.trim().length > 0);
  const isExternal = !hasContent && news.url;

  const content = (
    <>
      <div className="news-card-media">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={news.title}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="news-card-placeholder" aria-label="Sin imagen">
            <FaNewspaper size={32} />
          </div>
        )}
      </div>
      <div className="news-card-body">
        {news.category?.name && (
          <span className="news-card-category">{news.category.name}</span>
        )}
        <h3 className="news-card-title">{news.title}</h3>
        {news.publishedAt && (
          <span className="news-card-date">
            {new Date(news.publishedAt).toLocaleDateString("es-PY", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        )}
      </div>
    </>
  );

  // 3. Si no hay contenido, redirigimos a la red social original
  if (isExternal) {
    return (
      <a
        href={news.url}
        target="_blank"
        rel="noopener noreferrer"
        className="news-card"
      >
        {content}
      </a>
    );
  }

  // 4. Si hay contenido, navegamos a la página de detalle
  return (
    <Link to={`/noticias/${news.slug}`} className="news-card">
      {content}
    </Link>
  );
}
