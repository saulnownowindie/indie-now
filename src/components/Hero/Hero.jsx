import "./Hero.css";

import { FaPlay } from "react-icons/fa";

import SidebarLatest from "./SidebarLatest/SidebarLatest";
import { homeData } from "../../data/homeData";
import useLatestContent from "../../hooks/useLatestContent";

export default function Hero() {
  const { items, isLoading } = useLatestContent();

  const splitIndex = Math.ceil(items.length / 2);

  const showFallback = !isLoading && items.length === 0;

  const leftItems = showFallback
    ? homeData.latestLeft
    : items.slice(0, splitIndex);

  const rightItems = showFallback
    ? homeData.latestRight
    : items.slice(splitIndex);

  return (
    <section className="hero container">
      <SidebarLatest
        title="Lo Último"
        items={leftItems}
        loading={isLoading}
        className="left"
      />

      <section className="hero-center">
        <h1 className="hero-tag">{homeData.hero.title}</h1>

        <div className="video-wrapper">
          <iframe
            src={homeData.hero.youtube}
            title={homeData.hero.title}
            allowFullScreen
          />
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
          className="right"
        />
      )}
    </section>
  );
}
