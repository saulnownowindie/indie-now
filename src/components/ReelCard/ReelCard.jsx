import { useEffect, useRef, useState } from "react";
import ReelVideo from "./ReelVideo";
import { isDirectVideoUrl } from "../../utils/videoUrl";
import "./ReelCard.css";

function ReelLightbox({ embedUrl, title, platform, onClose }) {
  const closeRef = useRef(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className="reel-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="reel-lightbox__panel">
        <button
          ref={closeRef}
          type="button"
          className="reel-lightbox__close"
          onClick={onClose}
          aria-label="Cerrar video"
        >
          ✕
        </button>

        <div className="reel-lightbox__frame">
          <iframe
            src={embedUrl}
            title={title}
            allow="autoplay; encrypted-media; picture-in-picture; clipboard-write"
            allowFullScreen
          />
        </div>

        <div className="reel-lightbox__meta">
          {platform && (
            <span className="reel-lightbox__platform">
              {platform}
            </span>
          )}

          <strong>{title}</strong>
        </div>
      </div>
    </div>
  );
}

export default function ReelCard({
  image,
  title,
  platform,
  url,
  embedUrl = null,
  videoUrl = null,
}) {
  const [failedImage, setFailedImage] = useState(null);
  const [open, setOpen] = useState(false);

  const showImage = Boolean(image) && failedImage !== image;

  const isExternal = Boolean(url) && /^https?:\/\//.test(url);

  const directVideoSrc =
    videoUrl || (isDirectVideoUrl(url) ? url : null);

  if (directVideoSrc) {
    return (
      <article className="reel-card reel-card--video">
        <ReelVideo
          src={directVideoSrc}
          poster={image}
          title={title}
        />

        <div className="reel-overlay">
          {platform && <span className="reel-platform">{platform}</span>}

          <h3 className="reel-title">{title}</h3>
        </div>
      </article>
    );
  }

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

  if (url && embedUrl) {
    const handleClick = (event) => {
      if (
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      event.preventDefault();
      setOpen(true);
    };

    return (
      <>
        <a
          className="reel-card"
          href={url}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          onClick={handleClick}
          aria-haspopup="dialog"
        >
          {content}
        </a>

        {open && (
          <ReelLightbox
            embedUrl={embedUrl}
            title={title}
            platform={platform}
            onClose={() => setOpen(false)}
          />
        )}
      </>
    );
  }

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
