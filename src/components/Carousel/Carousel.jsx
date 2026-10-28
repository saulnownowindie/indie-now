import { useRef } from "react";
import "./Carousel.css";

export default function Carousel({ children, label, className = "" }) {
  const trackRef = useRef(null);

  const scroll = (direction) => {
    const track = trackRef.current;

    if (!track) return;

    track.scrollBy({
      left: direction * track.clientWidth * 0.85,
      behavior: "smooth",
    });
  };

  return (
    <div className={`carousel ${className}`} role="region" aria-label={label}>
      <div className="carousel-track" ref={trackRef} tabIndex={0}>
        {children}
      </div>

      <div className="carousel-nav">
        <button
          type="button"
          className="carousel-arrow"
          aria-label={`Anterior: ${label}`}
          onClick={() => scroll(-1)}
        >
          ←
        </button>

        <button
          type="button"
          className="carousel-arrow"
          aria-label={`Siguiente: ${label}`}
          onClick={() => scroll(1)}
        >
          →
        </button>
      </div>
    </div>
  );
}
