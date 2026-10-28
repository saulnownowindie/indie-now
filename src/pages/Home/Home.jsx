import "./Home.css";

import { FaSpotify } from "react-icons/fa";

import Hero from "../../components/Hero/Hero";
import SectionTitle from "../../components/SectionTitle/SectionTitle";
import Card from "../../components/Card/Card";
import Carousel from "../../components/Carousel/Carousel";
import ReelCard from "../../components/ReelCard/ReelCard";
import Merch from "../../components/Merch/Merch";
import { homeData } from "../../data/homeData";

export default function Home() {
  return (
    <div className="home container">
      <Hero />

      <section className="home-section">
        <SectionTitle title="Lo Nuevo Que Vale" linkTo="/noticias" />

        <div className="home-cards">
          {homeData.newWorth.map((item) => (
            <Card
              key={item.id}
              image={item.image}
              category={item.category}
              title={item.title}
              date={item.date}
              url={item.url}
            />
          ))}
        </div>
      </section>

      <section className="home-section">
        <SectionTitle title="Noticias" linkTo="/noticias" />

        <div className="home-cards home-cards--three">
          {homeData.news.map((item) => (
            <Card
              key={item.id}
              image={item.image}
              category={item.category}
              title={item.title}
              date={item.date}
              url={item.url}
            />
          ))}
        </div>
      </section>

      <section className="home-section">
        <SectionTitle title="Reseñas" linkTo="/resenas" />

        <Carousel
          label="Notas de Prensa"
          className="carousel-reviews"
        >
          {homeData.pressNotes.map((item) => (
            <Card
              key={item.id}
              image={item.image}
              category={item.category}
              title={item.title}
              date={item.date}
              url={item.url}
            />
          ))}
        </Carousel>
      </section>

      <section className="home-section">
        <SectionTitle
          title="Indie Sounds Sessions"
          linkTo="/sesiones"
        />

        <div className="home-cards home-cards--three">
          {homeData.sessions.map((item) => (
            <Card
              key={item.id}
              image={item.image}
              category={item.category}
              title={item.title}
              date={item.date}
              url={item.url}
              showPlay
            />
          ))}
        </div>
      </section>

      <section className="home-section">
        <SectionTitle title="Reels" />

        <Carousel label="Reels de Indie Now" className="carousel-reels">
          {homeData.reels.map((item) => (
            <ReelCard
              key={item.id}
              image={item.image}
              platform={item.platform}
              title={item.title}
              url={item.url}
            />
          ))}
        </Carousel>
      </section>

      <section className="home-section">
        <SectionTitle
          title="No Podés Perderte"
          linkTo="/no-podes-perderte"
        />

        <div className="home-cards home-cards--three">
          {homeData.mustSee.map((item) => (
            <Card
              key={item.id}
              image={item.image}
              category={item.category}
              title={item.title}
              url={item.url}
            />
          ))}
        </div>

        <a
          className="spotify-banner"
          href={homeData.spotifyPlaylist.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="spotify-icon">
            <FaSpotify aria-hidden="true" />
          </span>

          <span className="spotify-text">
            <strong>{homeData.spotifyPlaylist.title}</strong>

            <span>{homeData.spotifyPlaylist.description}</span>
          </span>

          <span className="spotify-cta">
            Escuchar

            <span aria-hidden="true">→</span>
          </span>
        </a>
      </section>

      <Merch />

      <section className="home-section">
        <SectionTitle title="Envíanos tu música" />

        <div className="submit-grid">
          {homeData.submitMusic.map((item, index) => (
            <a
              key={item.id}
              className="submit-card"
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="submit-number">
                {String(index + 1).padStart(2, "0")}
              </span>

              <h3>{item.name}</h3>

              <p>{item.description}</p>

              <span className="submit-link">
                Enviar música

                <span aria-hidden="true">→</span>
              </span>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
