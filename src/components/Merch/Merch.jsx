import { useEffect, useState } from "react";
import "./Merch.css";
import { homeData } from "../../data/homeData";

export default function Merch() {
  const products = homeData.merch.tshirts;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState(null);
  const [direction, setDirection] = useState("next");
  const [animating, setAnimating] = useState(false);

  const currentProduct = products[currentIndex];
  const previousProduct =
    previousIndex !== null ? products[previousIndex] : null;

  const changeProduct = (newDirection) => {

    if (animating) return;

    setAnimating(true);
    setDirection(newDirection);
    setPreviousIndex(currentIndex);

    const nextIndex =
      newDirection === "next"
        ? (currentIndex + 1) % products.length
        : (currentIndex - 1 + products.length) % products.length;

    setCurrentIndex(nextIndex);
  };

  useEffect(() => {
    if (!animating) return;

    const timer = setTimeout(() => {
      setPreviousIndex(null);
      setAnimating(false);
    }, 430);

    return () => clearTimeout(timer);
  }, [animating]);

  return (
    <section className="merch section">
      <div className="container panel">
        <div className="merch-header">
          <h2 className="section-title">{homeData.merch.title}</h2>
          <p className="section-subtitle">{homeData.merch.subtitle}</p>
        </div>

        <div className="merch-featured">
          <div className="merch-image">
            <button
              className="carousel-arrow left"
              onClick={() => changeProduct("previous")}
            >
              ←
            </button>

            {previousProduct && (
              <img
                src={previousProduct.image}
                alt=""
                className={`merch-photo previous ${animating ? direction : ""}`}
              />
            )}

            <img
              src={currentProduct.image}
              alt={currentProduct.name}
              className={`merch-photo current ${animating ? direction : ""}`}
            />

            <button
              className="carousel-arrow right"
              onClick={() => changeProduct("next")}
            >
              →
            </button>

            <div className="carousel-dots">
              {products.map((item, index) => (
                <span
                  key={item.id}
                  className={index === currentIndex ? "active" : ""}
                />
              ))}
            </div>
          </div>

          <div
            key={currentProduct.id}
            className={`merch-info ${animating ? "text-changing" : ""}`}
          >
            <span className="merch-label">Producto Destacado</span>

            <h3 className="title-animate">{currentProduct.name}</h3>

            <p className="merch-collection collection-animate">
              {currentProduct.collection}
            </p>

            <h4 className="merch-price price-animate">
              {currentProduct.price}
            </h4>

            <div className="merch-details">
              {currentProduct.details.map((detail, index) => (
                <div
                  key={detail.label}
                  className="detail-row"
                  style={{
                    animationDelay: `${0.18 + index * 0.06}s`,
                  }}
                >
                  <span className="detail-label">{detail.label}</span>

                  <span className="detail-value">{detail.value}</span>
                </div>
              ))}
            </div>

            <a href={currentProduct.url} className="button-primary">
              Comprar
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
