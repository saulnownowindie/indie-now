import "./Hero.css";

import { useMemo, useState } from "react";
import { FaPlay } from "react-icons/fa";

import SidebarLatest from "./SidebarLatest/SidebarLatest";
import { homeData } from "../../data/homeData";
import useLatestContent from "../../hooks/useLatestContent";
import { getYouTubeVideoId } from "../../utils/videoUrl";

const heroVideoId =
  getYouTubeVideoId(homeData.hero.youtube) ||
  getYouTubeVideoId(homeData.hero.youtubeUrl);

export default function Hero() {
  const { items, isLoading } = useLatestContent();
  const [videoLoaded, setVideoLoaded] = useState(false);

  const splitIndex = Math.ceil(items.length / 2);

  const showFallback = !isLoading && items.length === 0;

  const leftItems = useMemo(
    () =>
      showFallback ? homeData.latestLeft : items.slice(0, splitIndex),
    [items, showFallback, splitIndex],
  );

  const rightItems = useMemo(
    () =>
      showFallback ? homeData.latestRight : items.slice(splitIndex),
    [items, showFallback, splitIndex],
  );

  return (
    <section className="hero container">
      <SidebarLatest
        title="Lo Último"
        items={leftItems}
        loading={isLoading}
        className="hero-left"
      />

      <section className="hero-center">
        <h1 className="hero-tag">{homeData.hero.title}</h1>

        <div className="video-wrapper">
          {videoLoaded && heroVideoId ? (
            <iframe
              src={`https://www.youtube.com/embed/${heroVideoId}?autoplay=1&rel=0`}
              title={homeData.hero.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : heroVideoId ? (
            <button
              type="button"
              className="video-facade"
              onClick={() => setVideoLoaded(true)}
              aria-label={`Reproducir ${homeData.hero.title}`}
            >
              <img
                src={`https://i.ytimg.com/vi/${heroVideoId}/hqdefault.jpg`}
                alt=""
                width="480"
                height="360"
                loading="eager"
                fetchPriority="high"
                decoding="async"
              />

              <span className="video-facade__play" aria-hidden="true">
                <FaPlay />
              </span>

              <span className="video-facade__label">
                Ver sesión
              </span>
            </button>
          ) : (
            <iframe
              src={homeData.hero.youtube}
              title={homeData.hero.title}
              allowFullScreen
              loading="lazy"
            />
          )}
        </div>

        <div className="hero-buttons">
          <a
            className="btn-primary"
            href={homeData.hero.youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="hero-cta-icon" aria-hidden="true">
              <FaPlay />
            </span>

            Ver en YouTube
          </a>
        </div>
      </section>

      {(isLoading || rightItems.length > 0) && (
        <SidebarLatest
          title="Lo Último"
          items={rightItems}
          loading={isLoading}
          className="hero-right"
        />
      )}
    </section>
  );
}
