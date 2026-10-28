import { useState } from "react";
import "./ReelCard.css";

export default function ReelCard({ image, title, platform, url }) {
  const [failedImage, setFailedImage] = useState(null);

  const showImage = Boolean(image) && failedImage !== image;

  const isExternal = Boolean(url) && /^https?:\/\//.test(url);

  const content = (
    <>
      {showImage ? (
        <img
          src={image}
          alt={title}
          loading="lazy"
          onError={() => setFailedImage(image)}
        />
      ) : (
        <div
          className="reel-placeholder"
          role="img"
          aria-label="Imagen no disponible"
        >
          <span>INDIE NOW</span>
        </div>
      )}

      <span className="reel-play" aria-hidden="true">
        ▶
      </span>

      <div className="reel-overlay">
        {platform && <span className="reel-platform">{platform}</span>}

        <h3 className="reel-title">{title}</h3>
      </div>
    </>
  );

  if (url) {
    return (
      <a
        className="reel-card"
        href={url}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
      >
        {content}
      </a>
    );
  }

  return <article className="reel-card">{content}</article>;
}
