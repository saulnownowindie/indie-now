import { useState } from "react";
import "./Card.css";

export default function Card({ image, category, title, date, url }) {
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
      </div>

      <div className="card-body">
        {category && <span className="card-category">{category}</span>}

        <h3 className="card-title">{title}</h3>

        {date && <small className="card-date">{date}</small>}
      </div>
    </>
  );

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
