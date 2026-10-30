import { memo, useEffect, useRef, useState } from "react";

import ReelVideo from "./ReelVideo";
import {
  getPreviewPosterUrl,
  getPreviewVideoUrl,
  getYouTubeVideoId,
  isDirectVideoUrl,
  isYouTubeUrl,
} from "../../utils/videoUrl";
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

function getCanHover() {
  if (typeof window === "undefined" || !window.matchMedia) {
    return false;
  }

  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

function getReducedMotion() {
  if (typeof window === "undefined" || !window.matchMedia) {
    return false;
  }

  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getSaveData() {
  if (typeof navigator === "undefined") {
    return false;
  }

  return Boolean(navigator.connection?.saveData);
}

function getPreviewWidth() {
  if (typeof window === "undefined" || !window.matchMedia) {
    return 800;
  }

  return window.matchMedia("(max-width: 768px)").matches ? 360 : 800;
}

function ReelCard({
  image,
  title,
  platform,
  platformCode = null,
  url,
  embedUrl = null,
  videoUrl = null,
  previewUrl = null,
  posterUrl = null,
}) {
  const [failedImage, setFailedImage] = useState(null);
  const [open, setOpen] = useState(false);
  const [showIframe, setShowIframe] = useState(false);
  const [canHover] = useState(getCanHover);
  const [reducedMotion] = useState(getReducedMotion);
  const [saveData] = useState(getSaveData);
  const [previewWidth, setPreviewWidth] = useState(getPreviewWidth);

  const showImage = Boolean(image) && failedImage !== image;

  const isExternal = Boolean(url) && /^https?:\/\//.test(url);

  const directVideoSrc =
    videoUrl || (isDirectVideoUrl(url) ? url : null);

  const hasPreview = Boolean(previewUrl);
  const previewSrc = hasPreview
    ? getPreviewVideoUrl(previewUrl, previewWidth)
    : null;
  const previewPoster = posterUrl
    ? getPreviewPosterUrl(posterUrl, previewWidth)
    : image;

  const youtubeId =
    getYouTubeVideoId(url) || getYouTubeVideoId(embedUrl);

  const isYouTube =
    Boolean(youtubeId) ||
    platformCode === "YOUTUBE" ||
    isYouTubeUrl(url) ||
    isYouTubeUrl(embedUrl);

  const canHoverIframe =
    isYouTube &&
    Boolean(youtubeId) &&
    !hasPreview &&
    !directVideoSrc &&
    canHover &&
    !reducedMotion &&
    !saveData;

  const strategy = hasPreview
    ? "preview propio"
    : directVideoSrc
      ? "video directo"
      : canHoverIframe
        ? "iframe YouTube"
        : "solo portada";

  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log(`[ReelCard] ${title}: ${strategy}`);
    }
  }, [strategy, title]);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) {
      return undefined;
    }

    const query = window.matchMedia("(max-width: 768px)");
    const handleChange = () => setPreviewWidth(getPreviewWidth());

    query.addEventListener?.("change", handleChange);

    return () => {
      query.removeEventListener?.("change", handleChange);
    };
  }, []);

  const handleCardEnter = () => {
    if (canHoverIframe) {
      setShowIframe(true);
    }
  };

  const handleCardLeave = () => {
    setShowIframe(false);
  };

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

  let media;

  if (hasPreview) {
    media = (
      <ReelVideo
        src={previewSrc}
        poster={previewPoster}
        title={title}
        preview
      />
    );
  } else if (showImage) {
    media = (
      <img
        className="reel-media-cover"
        src={image}
        alt={title}
        loading="lazy"
        decoding="async"
        onError={() => setFailedImage(image)}
      />
    );
  } else {
    media = (
      <div
        className="reel-placeholder"
        role="img"
        aria-label="Imagen no disponible"
      >
        <span>INDIE NOW</span>
      </div>
    );
  }

  const content = (
    <>
      {media}

      {showIframe && canHoverIframe && (
        <iframe
          className="reel-embed"
          src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&loop=1&playlist=${youtubeId}&controls=0&playsinline=1`}
          title={`${title} (vista previa)`}
          allow="autoplay; encrypted-media; picture-in-picture"
          tabIndex={-1}
          aria-hidden="true"
        />
      )}

      {!hasPreview && (
        <span className="reel-play" aria-hidden="true">
          ▶
        </span>
      )}

      <div className="reel-overlay">
        {platform && <span className="reel-platform">{platform}</span>}

        <h3 className="reel-title">{title}</h3>
      </div>
    </>
  );

  const cardClassName = [
    "reel-card",
    hasPreview && "reel-card--preview",
    !hasPreview && "reel-card--cover",
    showIframe && canHoverIframe && "reel-card--iframe",
  ]
    .filter(Boolean)
    .join(" ");

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
          className={cardClassName}
          href={url}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          onClick={handleClick}
          onMouseEnter={handleCardEnter}
          onMouseLeave={handleCardLeave}
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
        className={cardClassName}
        href={url}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        onMouseEnter={handleCardEnter}
        onMouseLeave={handleCardLeave}
      >
        {content}
      </a>
    );
  }

  return (
    <article
      className={cardClassName}
      onMouseEnter={handleCardEnter}
      onMouseLeave={handleCardLeave}
    >
      {content}
    </article>
  );
}

export default memo(ReelCard);
