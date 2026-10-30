import { useMemo } from "react";
import { FaSpotify } from "react-icons/fa";

import "./Home.css";

import Hero from "../../components/Hero/Hero";
import SectionTitle from "../../components/SectionTitle/SectionTitle";
import Card from "../../components/Card/Card";
import Carousel from "../../components/Carousel/Carousel";
import ReelCard from "../../components/ReelCard/ReelCard";
import Merch from "../../components/Merch/Merch";
import usePublicNews from "../../hooks/usePublicNews";
import usePublicReels from "../../hooks/usePublicReels";
import { homeData } from "../../data/homeData";
import {
  mapPublicList,
  normalizePublicNews,
  normalizePublicReel,
} from "../../utils/publicContent";

function CardSkeleton() {
  return (
    <div className="home-skeleton-card" aria-hidden="true">
      <div className="home-skeleton-media" />

      <div className="home-skeleton-line home-skeleton-line--short" />
      <div className="home-skeleton-line" />
      <div className="home-skeleton-line home-skeleton-line--tiny" />
    </div>
  );
}

function ReelSkeleton() {
  return (
    <div
      className="home-skeleton-card home-skeleton-card--reel"
      aria-hidden="true"
    >
      <div className="home-skeleton-media" />
    </div>
  );
}

export default function Home() {
  const newsQuery = usePublicNews();
  const reelsQuery = usePublicReels();

  const apiNews = useMemo(
    () =>
      mapPublicList(newsQuery.data, normalizePublicNews).slice(0, 3),
    [newsQuery.data],
  );

  const apiReels = useMemo(
    () => mapPublicList(reelsQuery.data, normalizePublicReel),
    [reelsQuery.data],
  );

  const news = apiNews.length > 0 ? apiNews : homeData.news;
  const reels = apiReels.length > 0 ? apiReels : homeData.reels;

  return (
    <div className="home container">
      <Hero />

      <section className="home-section" id="lo-nuevo">
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

      <section className="home-section" id="noticias">
        <SectionTitle title="Noticias" linkTo="/noticias" />

        <div className="home-cards home-cards--three">
          {newsQuery.isLoading
            ? Array.from({ length: 3 }).map((_, index) => (
                <CardSkeleton key={index} />
              ))
            : news.map((item) => (
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

      <section className="home-section" id="reels">
        <SectionTitle title="Reels" />

        {reelsQuery.isLoading ? (
          <div className="home-reels-skeleton">
            {Array.from({ length: 4 }).map((_, index) => (
              <ReelSkeleton key={index} />
            ))}
          </div>
        ) : (
          <Carousel label="Reels de Indie Now" className="carousel-reels">
            {reels.map((item) => (
              <ReelCard
                key={item.id}
                image={item.image}
                platform={item.platform}
                title={item.title}
                url={item.url}
              />
            ))}
          </Carousel>
        )}
      </section>

      <section className="home-section" id="no-podes-perderte">
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

      <Merch id="merch" />

      <section className="home-section" id="envianos-musica">
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
