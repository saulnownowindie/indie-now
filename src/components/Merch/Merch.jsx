import { useEffect, useMemo, useState } from "react";
import "./Merch.css";
import { homeData } from "../../data/homeData";
import usePublicMerch from "../../hooks/usePublicMerch";
import { resolveMediaUrl } from "../../utils/mediaUrl";

const fallbackProducts = homeData.merch.tshirts;

function normalizeProduct(product) {
  return {
    id: product.id ?? product.slug ?? product.name,
    name: product.name,
    collection: product.collection || "",
    price: product.price || "",
    details: Array.isArray(product.details)
      ? product.details.filter((detail) => detail?.label && detail?.value)
      : [],
    image: resolveMediaUrl(product.coverImage?.url || product.imageUrl),
    gallery: Array.isArray(product.gallery)
      ? product.gallery.map(resolveMediaUrl).filter(Boolean)
      : [],
    badge: product.badge || "",
    url: product.url || "#",
  };
}

function MerchSkeleton() {
  return (
    <div className="merch-featured merch-skeleton" aria-hidden="true">
      <div className="merch-image merch-skeleton-image">
        <div className="merch-skeleton-block merch-skeleton-photo" />
      </div>

      <div className="merch-info">
        <div className="merch-skeleton-block merch-skeleton-pill" />
        <div className="merch-skeleton-block merch-skeleton-title" />
        <div className="merch-skeleton-block merch-skeleton-line" />
        <div className="merch-skeleton-block merch-skeleton-price" />

        <div className="merch-skeleton-details">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="merch-skeleton-block merch-skeleton-detail"
            />
          ))}
        </div>

        <div className="merch-skeleton-block merch-skeleton-button" />
      </div>
    </div>
  );
}

export default function Merch({ id }) {
  const { data, isLoading } = usePublicMerch();

  const apiProducts = useMemo(() => {
    if (!Array.isArray(data)) return [];

    return data
      .filter((item) => item && item.isVisible !== false)
      .map(normalizeProduct)
      .filter((item) => item.name && item.image);
  }, [data]);

  const products = apiProducts.length > 0 ? apiProducts : fallbackProducts;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState("next");
  const [animating, setAnimating] = useState(false);

  const activeIndex =
    currentIndex < products.length ? currentIndex : 0;

  const currentProduct = products[activeIndex] ?? products[0];
  const hasMultipleProducts = products.length > 1;

  const changeProduct = (newDirection) => {
    if (animating || !hasMultipleProducts) return;

    setAnimating(true);
    setDirection(newDirection);

    const nextIndex =
      newDirection === "next"
        ? (activeIndex + 1) % products.length
        : (activeIndex - 1 + products.length) % products.length;

    setCurrentIndex(nextIndex);
  };

  useEffect(() => {
    if (!animating) return;

    const timer = setTimeout(() => {
      setAnimating(false);
    }, 430);

    return () => clearTimeout(timer);
  }, [animating]);

  return (
    <section
      id={id}
      className="merch section container"
      aria-busy={isLoading}
    >
      <div className="panel">
        <div className="merch-header">
          <h2 className="section-title">{homeData.merch.title}</h2>
          <p className="section-subtitle">{homeData.merch.subtitle}</p>
        </div>

        {isLoading ? (
          <MerchSkeleton />
        ) : (
          <div className="merch-featured">
            <div className="merch-image">
              {hasMultipleProducts && (
                <button
                  type="button"
                  className="merch-arrow merch-arrow--left"
                  aria-label="Producto anterior"
                  onClick={() => changeProduct("previous")}
                >
                  ←
                </button>
              )}

              <img
                key={currentProduct.id}
                src={currentProduct.image}
                alt={currentProduct.name}
                className={`merch-photo ${direction === "next" ? "photo-in-next" : "photo-in-prev"}`}
              />

              {hasMultipleProducts && (
                <button
                  type="button"
                  className="merch-arrow merch-arrow--right"
                  aria-label="Producto siguiente"
                  onClick={() => changeProduct("next")}
                >
                  →
                </button>
              )}

              {hasMultipleProducts && (
                <div className="carousel-dots" aria-hidden="true">
                  {products.map((item, index) => (
                    <span
                      key={item.id}
                      className={index === activeIndex ? "active" : ""}
                    />
                  ))}
                </div>
              )}
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

              {currentProduct.price && (
                <h4 className="merch-price price-animate">
                  {currentProduct.price}
                </h4>
              )}

              {currentProduct.details.length > 0 && (
                <div className="merch-details">
                  {currentProduct.details.map((detail, index) => (
                    <div
                      key={`${detail.label}-${index}`}
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
              )}

              <a href={currentProduct.url} className="button-primary">
                Comprar
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
