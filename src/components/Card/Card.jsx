import { memo, useState } from "react";
import { Link } from "react-router-dom";
import "./Card.css";

function Card({
  image,
  category,
  title,
  date,
  url,
  to,
  showPlay = false,
}) {
  const [failedImage, setFailedImage] = useState(null);

  const showImage = Boolean(image) && failedImage !== image;

  const isExternal = Boolean(url) && /^https?:\/\//.test(url);

  const content = (
    <>
      <div className="card-media">
        {showImage ? (
          <img
            src={image}
            alt={title}
            loading="lazy"
            decoding="async"
            onError={() => setFailedImage(image)}
          />
        ) : (
          <div
            className="card-placeholder"
            role="img"
            aria-label="Imagen no disponible"
          >
            <span>INDIE NOW</span>
          </div>
        )}

        {showPlay && (
          <span className="card-play" aria-hidden="true">
            ▶
          </span>
        )}
      </div>

      <div className="card-body">
        {category && <span className="card-category">{category}</span>}

        <h3 className="card-title">{title}</h3>

        {date && <small className="card-date">{date}</small>}
      </div>
    </>
  );

  if (to) {
    return (
      <Link className="card" to={to}>
        {content}
      </Link>
    );
  }

  if (url) {
    return (
      <a
        className="card"
        href={url}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
      >
        {content}
      </a>
    );
  }

  return <article className="card">{content}</article>;
}

export default memo(Card);
