import { memo, useCallback, useEffect, useRef, useState } from "react";
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

function getSaveData() {
  if (typeof navigator === "undefined") {
    return false;
  }

  return Boolean(navigator.connection?.saveData);
}

function ReelVideo({
  src,
  poster,
  title = "Reel",
  onClick = null,
  preview = false,
}) {
  const videoRef = useRef(null);
  const hoverTimerRef = useRef(null);

  const [reducedMotion, setReducedMotion] = useState(getReducedMotion);
  const [saveData, setSaveData] = useState(getSaveData);
  const [canHover] = useState(getCanHover);
  const [isPlaying, setIsPlaying] = useState(false);

  const staticOnly = preview && (reducedMotion || saveData);

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

  /* Escucha cambios en el ahorro de datos del navegador. */
  useEffect(() => {
    if (typeof navigator === "undefined") {
      return undefined;
    }

    const connection = navigator.connection;

    if (!connection?.addEventListener) {
      return undefined;
    }

    const handleChange = () => {
      setSaveData(Boolean(connection.saveData));
    };

    connection.addEventListener("change", handleChange);

    return () => {
      connection.removeEventListener("change", handleChange);
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
    if (canHover || reducedMotion || staticOnly) {
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
  }, [canHover, reducedMotion, staticOnly]);

  /* Escritorio: reproduce al pasar el mouse con un pequeño delay. */
  const handleMouseEnter = () => {
    if (!canHover || reducedMotion || staticOnly) return;

    window.clearTimeout(hoverTimerRef.current);

    hoverTimerRef.current = window.setTimeout(() => {
      start();
    }, HOVER_DELAY);
  };

  const handleMouseLeave = () => {
    if (!canHover || reducedMotion || staticOnly) return;

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

  const wrapperClassName = [
    "reel-video",
    staticOnly && "reel-video--static",
    onClick && "reel-video--clickable",
  ]
    .filter(Boolean)
    .join(" ");

  /* Con movimiento reducido o ahorro de datos solo se muestra el poster. */
  if (staticOnly) {
    return (
      <div className={wrapperClassName} onClick={onClick}>
        {poster ? (
          <img
            className="reel-video__poster"
            src={poster}
            alt=""
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="reel-video__poster reel-video__poster--empty" />
        )}
      </div>
    );
  }

  return (
    <div
      className={wrapperClassName}
      data-playing={isPlaying ? "true" : "false"}
      onClick={onClick}
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

      {reducedMotion && !preview && (
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

export default memo(ReelVideo);
