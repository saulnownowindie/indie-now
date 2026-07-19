import "./News.css";

import { newsData } from "../../data/newsData";
import NewsCard from "../../components/NewsCard/NewsCard";

export default function News() {

    const featured = newsData[0];

    const secondary = newsData[1];

    const grid = newsData.slice(2);

    return (

        <main className="news-page">

            <section className="news-hero">

                <h1>Noticias</h1>

                <p>

                    Últimos lanzamientos, sesiones y novedades de Indie Now.

                </p>

            </section>

            <section className="news-top">

                <div className="featured-news">

                    <NewsCard

                        news={featured}

                        featured

                    />

                </div>

                {

                    secondary &&

                    <div className="secondary-news">

                        <NewsCard

                            news={secondary}

                        />

                    </div>

                }

            </section>

            <section className="news-grid">

                {

                    grid.map(item => (

                        <NewsCard

                            key={item.id}

                            news={item}

                        />

                    ))

                }

            </section>

        </main>

    );

}