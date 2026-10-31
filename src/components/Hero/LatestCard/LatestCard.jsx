import "./LatestCard.css";
import { memo } from "react";

function LatestCard({ item }) {
  const Icon = item.icon;

  return (
    <a href={item.url} className="latest-card">
      
      {/* Si hay imagen, la muestra. Si no, muestra el icono por defecto */}
      <div className="latest-card-media">
        {item.image ? (
          <img src={item.image} alt={item.title} loading="lazy" />
        ) : (
          <Icon />
        )}
      </div>

      <div className="latest-card-text">
        <strong>{item.title}</strong>
        <p className="latest-description">
          {item.description}
        </p>
        <small>{item.published}</small>
      </div>
    </a>
  );
}

export default memo(LatestCard);