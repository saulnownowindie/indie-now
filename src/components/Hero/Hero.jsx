import "./Hero.css";
import SidebarLatest from "./SidebarLatest/SidebarLatest";
import { homeData } from "../../data/homeData";
export default function Hero() {
  return (
    <section className="hero container">
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
            Ver en YouTube
          </a>
        </div>
      </section>
      <SidebarLatest
        title="Lo Último"
        items={homeData.latestRight}
        className="right"
      />
    </section>
  );
}
