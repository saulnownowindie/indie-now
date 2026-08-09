import "./News.css";

import NewsCard from "../../components/NewsCard/NewsCard";
import usePublicNews from "../../hooks/usePublicNews";

export default function News() {
  const {
    data: news = [],
    isLoading,
    isError,
  } = usePublicNews();

  const featured =
    news.find((item) => item.featured) || news[0];

  const secondary = news.find(
    (item) => item.id !== featured?.id,
  );

  const grid = news.filter(
    (item) =>
      item.id !== featured?.id &&
      item.id !== secondary?.id,
  );

  return (
    <main className="news-page">
      <section className="news-hero">
        <h1>Noticias</h1>

        <p>
          Últimos lanzamientos, sesiones y novedades de
          Indie Now.
        </p>
      </section>

      {isLoading && (
        <div className="news-loading">
          Cargando noticias...
        </div>
      )}

      {isError && (
        <div className="news-loading">
          No se pudieron cargar las noticias.
        </div>
      )}

      {!isLoading &&
        !isError &&
        news.length === 0 && (
          <div className="news-loading">
            Todavía no hay noticias publicadas.
          </div>
        )}

      {!isLoading &&
        !isError &&
        news.length > 0 && (
          <>
            <section className="news-top">
              {featured && (
                <div className="featured-news">
                  <NewsCard
                    news={featured}
                    featured
                  />
                </div>
              )}

              {secondary && (
                <div className="secondary-news">
                  <NewsCard news={secondary} />
                </div>
              )}
            </section>

            {grid.length > 0 && (
              <section className="news-grid">
                {grid.map((item) => (
                  <NewsCard
                    key={item.id}
                    news={item}
                  />
                ))}
              </section>
            )}
          </>
        )}
    </main>
  );
}