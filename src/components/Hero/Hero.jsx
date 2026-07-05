import "./Hero.css";
import { homeData } from "../../data/homeData";
export default function Hero() {
  return (
    <section className="hero container">
      <aside className="latest left">
        <h2 className="section-title">Lo Último</h2>

        {homeData.latestLeft.map((item) => {
          const Icon = item.icon;

          return (
            <a key={item.id} href={item.link} className="latest-card">
              <span>
                <Icon />
              </span>

              <div>
                <strong>{item.title}</strong>

                <p className="latest-description">{item.description}</p>

                <small>{item.published}</small>
              </div>
            </a>
          );
        })}
      </aside>

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

      <aside className="latest right">
        <h2 className="section-title">Lo Último</h2>

        {homeData.latestRight.map((item) => {
          const Icon = item.icon;

          return (
            <a key={item.id} href={item.link} className="latest-card">
              <span>
                <Icon />
              </span>

<div>

    <strong>
        {item.title}
    </strong>

    <p className="latest-description">
        {item.description}
    </p>

    <small>
        {item.published}
    </small>

</div>
            </a>
          );
        })}
      </aside>
    </section>
  );
}
