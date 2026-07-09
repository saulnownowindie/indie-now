import "./Hero.css";
import SidebarLatest from "./SidebarLatest/SidebarLatest";
import { homeData } from "../../data/homeData";
export default function Hero() {
  return (
    <section className="hero container">
      <SidebarLatest
        title="Lo Último"
        items={homeData.latestLeft}
        className="left"
      />

      <section className="hero-center">
        <span className="hero-tag">{homeData.hero.title}</span>

        <div className="video-wrapper">
          <iframe src={homeData.hero.youtube} title="YouTube" allowFullScreen />
        </div>

        <div className="hero-buttons">
          {/* <button className="btn-primary">
            Ver en YouTube
          </button> */}
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
