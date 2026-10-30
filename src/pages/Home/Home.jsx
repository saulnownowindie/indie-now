import { useMemo } from "react";

import "./Home.css";

import Hero from "../../components/Hero/Hero";
import SectionTitle from "../../components/SectionTitle/SectionTitle";
import Card from "../../components/Card/Card";
import Carousel from "../../components/Carousel/Carousel";
import ReelCard from "../../components/ReelCard/ReelCard";
import Merch from "../../components/Merch/Merch";
import usePublicNews from "../../hooks/usePublicNews";
import usePublicPlaylists from "../../hooks/usePublicPlaylists";
import usePublicReels from "../../hooks/usePublicReels";
import { homeData } from "../../data/homeData";
import {
  mapPublicList,
  normalizePublicNews,
  normalizePublicPlaylist,
  normalizePublicReel,
} from "../../utils/publicContent";
import { getPlaylistPlatform } from "../../utils/playlistPlatforms";

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
  const newsQuery = usePublicNews("NOTICIAS");
  const reelsQuery = usePublicReels("REELS");
  const playlistsQuery = usePublicPlaylists();

  const apiNews = useMemo(
    () =>
      mapPublicList(newsQuery.data, normalizePublicNews).slice(0, 3),
    [newsQuery.data],
  );

  const apiReels = useMemo(
    () => mapPublicList(reelsQuery.data, normalizePublicReel),
    [reelsQuery.data],
  );

  const apiPlaylists = useMemo(
    () => mapPublicList(playlistsQuery.data, normalizePublicPlaylist),
    [playlistsQuery.data],
  );

  const featuredPlaylists = apiPlaylists.slice(0, 3);

  const news = apiNews.length > 0 ? apiNews : homeData.news;
  const reels = apiReels.length > 0 ? apiReels : homeData.reels;
  const mustSee =
    featuredPlaylists.length > 0 ? featuredPlaylists : homeData.mustSee;

  const bannerPlaylist =
    apiPlaylists.find((item) => item.platformCode === "SPOTIFY") ||
    apiPlaylists[0] ||
    null;

  const bannerPlatform = getPlaylistPlatform(
    bannerPlaylist?.platformCode || "SPOTIFY",
  );
  const BannerIcon = bannerPlatform.icon;

  const banner = bannerPlaylist
    ? {
        title: bannerPlaylist.title,
        description:
          bannerPlaylist.description ||
          [
            bannerPlaylist.ownerName,
            bannerPlaylist.tracksCount
              ? `${bannerPlaylist.tracksCount} canciones`
              : null,
          ]
            .filter(Boolean)
            .join(" · "),
        url: bannerPlaylist.url,
      }
    : homeData.spotifyPlaylist;

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
                  to={item.slug ? `/noticias/${item.slug}` : undefined}
                  url={item.slug ? undefined : item.url}
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
                platformCode={item.platformCode}
                title={item.title}
                url={item.url}
                videoUrl={item.videoUrl}
                previewUrl={item.previewUrl}
                posterUrl={item.posterUrl}
                embedUrl={item.embedUrl}
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
          {playlistsQuery.isLoading
            ? Array.from({ length: 3 }).map((_, index) => (
                <CardSkeleton key={index} />
              ))
            : mustSee.map((item) => {
                const platform = item.platformCode
                  ? getPlaylistPlatform(item.platformCode)
                  : null;

                return (
                  <Card
                    key={item.id}
                    image={item.image}
                    category={platform ? platform.label : item.category}
                    title={item.title}
                    date={
                      item.tracksCount
                        ? `${item.tracksCount} canciones`
                        : item.date
                    }
                    url={item.url}
                  />
                );
              })}
        </div>

        <a
          className="spotify-banner"
          href={banner.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="spotify-icon">
            <BannerIcon aria-hidden="true" />
          </span>

          <span className="spotify-text">
            <strong>{banner.title}</strong>

            <span>{banner.description}</span>
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
