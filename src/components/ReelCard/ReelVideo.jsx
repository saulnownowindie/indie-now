import { useCallback, useEffect, useRef, useState } from "react";
import { FaPause, FaPlay } from "react-icons/fa";

import "./ReelVideo.css";

const HOVER_DELAY = 250;
const VISIBILITY_THRESHOLD = 0.6;

/* Solo un video puede reproducirse a la vez en toda la página. */
let activeVideo = null;

function pauseVideo(video, reset = true) {
  if (!video) return;

  video.pause();

  if (reset) {
    video.currentTime = 0;
  }

  if (activeVideo === video) {
    activeVideo = null;
  }
}

function playVideo(video) {
  if (!video) return;

  if (activeVideo && activeVideo !== video) {
    pauseVideo(activeVideo);
  }

  activeVideo = video;

  try {
    const promise = video.play();

    if (promise?.catch) {
      promise.catch(() => {
        /* El navegador puede bloquear el autoplay: se ignora. */
      });
    }
  } catch {
    /* Navegadores antiguos: se ignora el error de reproducción. */
  }
}

function getReducedMotion() {
  if (typeof window === "undefined" || !window.matchMedia) {
    return false;
  }

  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getCanHover() {
  if (typeof window === "undefined" || !window.matchMedia) {
    return false;
  }

  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

export default function ReelVideo({ src, poster, title = "Reel" }) {
  const videoRef = useRef(null);
  const hoverTimerRef = useRef(null);

  const [reducedMotion, setReducedMotion] = useState(getReducedMotion);
  const [canHover] = useState(getCanHover);
  const [isPlaying, setIsPlaying] = useState(false);

  const stop = useCallback((reset = true) => {
    pauseVideo(videoRef.current, reset);
    setIsPlaying(false);
  }, []);

  const start = useCallback(() => {
    playVideo(videoRef.current);
  }, []);

  /* Mantiene el video silenciado incluso si el navegador ignora el atributo. */
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
    }
  }, []);

  /* Escucha cambios en la preferencia de movimiento reducido. */
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) {
      return undefined;
    }

    const query = window.matchMedia("(prefers-reduced-motion: reduce)");

    const handleChange = (event) => {
      if (event.matches) {
        window.clearTimeout(hoverTimerRef.current);
        pauseVideo(videoRef.current);
      }

      setReducedMotion(event.matches);
    };

    query.addEventListener?.("change", handleChange);

    return () => {
      query.removeEventListener?.("change", handleChange);
    };
  }, []);

  /* Limpieza al desmontar. */
  useEffect(() => {
    const video = videoRef.current;

    return () => {
      window.clearTimeout(hoverTimerRef.current);

      if (video) {
        video.pause();
      }

      if (activeVideo === video) {
        activeVideo = null;
      }
    };
  }, []);

  /* Móvil / táctil: reproduce cuando el 60% del video es visible. */
  useEffect(() => {
    if (canHover || reducedMotion) {
      return undefined;
    }

    const video = videoRef.current;

    if (!video || !("IntersectionObserver" in window)) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (
            entry.isIntersecting &&
            entry.intersectionRatio >= VISIBILITY_THRESHOLD
          ) {
            playVideo(video);
            return;
          }

          if (activeVideo === video) {
            pauseVideo(video);
          }
        });
      },
      { threshold: [0, VISIBILITY_THRESHOLD, 1] },
    );

    observer.observe(video);

    return () => {
      observer.disconnect();

      if (activeVideo === video) {
        pauseVideo(video);
      }
    };
  }, [canHover, reducedMotion]);

  /* Escritorio: reproduce al pasar el mouse con un pequeño delay. */
  const handleMouseEnter = () => {
    if (!canHover || reducedMotion) return;

    window.clearTimeout(hoverTimerRef.current);

    hoverTimerRef.current = window.setTimeout(() => {
      start();
    }, HOVER_DELAY);
  };

  const handleMouseLeave = () => {
    if (!canHover || reducedMotion) return;

    window.clearTimeout(hoverTimerRef.current);
    stop();
  };

  const handleManualToggle = () => {
    if (isPlaying) {
      stop(false);
      return;
    }

    start();
  };

  return (
    <div
      className="reel-video"
      data-playing={isPlaying ? "true" : "false"}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <video
        ref={videoRef}
        className="reel-video__media"
        src={src}
        poster={poster || undefined}
        muted
        loop
        playsInline
        preload="none"
        aria-label={title}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {reducedMotion && (
        <button
          type="button"
          className="reel-video__toggle"
          onClick={handleManualToggle}
          aria-label={
            isPlaying
              ? `Pausar video: ${title}`
              : `Reproducir video: ${title}`
          }
        >
          {isPlaying ? (
            <FaPause aria-hidden="true" />
          ) : (
            <FaPlay aria-hidden="true" />
          )}
        </button>
      )}
    </div>
  );
}
