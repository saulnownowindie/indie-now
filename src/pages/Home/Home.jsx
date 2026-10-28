import "./Home.css";

import Hero from "../../components/Hero/Hero";
import SectionTitle from "../../components/SectionTitle/SectionTitle";
import Card from "../../components/Card/Card";
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

      <Merch />
    </div>
  );
}