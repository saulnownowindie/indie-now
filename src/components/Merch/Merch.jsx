import { useState } from "react";
import "./Merch.css";
import { homeData } from "../../data/homeData";

export default function Merch() {
  const [current, setCurrent] = useState(0);
  const [isChanging, setIsChanging] = useState(false);
  const tshirts = homeData.merch.tshirts;

  const tshirt = tshirts[current];
  const totalProducts = tshirts.length;
const changeProduct = (direction) => {

  if (photoAnimating) return;

  setPhotoAnimating(true);

  setTimeout(() => {

    setCurrent((prev) => {

      if (direction === "next") {

        return prev === tshirts.length - 1 ? 0 : prev + 1;

      }

      return prev === 0 ? tshirts.length - 1 : prev - 1;

    });

    setPhotoAnimating(false);

    setTimeout(() => {

      setTextAnimating(true);

      setTimeout(() => {

        setTextAnimating(false);

      },180);

    },60);

  },170);

};

const nextProduct = () => changeProduct("next");

const previousProduct = () => changeProduct("previous");

  const nextProduct = () => changeProduct("next");

  const previousProduct = () => changeProduct("previous");
  return (
    <section className="merch section">
      <div className="container panel">
        <div className="merch-header">
          <h2 className="section-title">{homeData.merch.title}</h2>

          <p className="section-subtitle">{homeData.merch.subtitle}</p>
        </div>

        <div className="merch-featured">
          <div className="merch-image">
            <button className="carousel-arrow left" onClick={previousProduct}>
              ←
            </button>

            <img
              src={tshirt.image}
              alt={tshirt.name}
              className={`merch-photo ${isChanging ? "fade-out" : "fade-in"}`}
            />

            <button className="carousel-arrow right" onClick={nextProduct}>
              →
            </button>

            <div className="carousel-dots">
              {tshirts.map((item, index) => (
                <span
                  key={item.id}
                  className={index === current ? "active" : ""}
                />
              ))}
            </div>
          </div>

          <div className={`merch-info ${isChanging ? "fade-out" : "fade-in"}`}>
            <span className="merch-label">Producto Destacado</span>

            <h3>{tshirt.name}</h3>

            <p className="merch-collection">{tshirt.collection}</p>

            <h4 className="merch-price">{tshirt.price}</h4>

            <div className="merch-details">
              <span>🧵 {tshirt.material}</span>

              <span>👕 {tshirt.fit}</span>

              <span>🎨 {tshirt.print}</span>

              <span>⚫ {tshirt.color}</span>
            </div>

            <a href={tshirt.url} className="button-primary">
              Comprar
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
