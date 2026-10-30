import "./LatestCard.css";

import { memo } from "react";

function LatestCard({ item }) {
  const Icon = item.icon;

  return (
    <a href={item.url} className="latest-card">
      <span>
        <Icon />
      </span>

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