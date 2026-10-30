import "./SidebarLatest.css";

import { memo } from "react";

import LatestCard from "../LatestCard/LatestCard";

function SidebarLatest({
  title,
  items,
  className = "",
  loading = false,
}) {
  return (
    <aside className={`latest ${className}`} aria-label={title}>

      <h2 className="section-title">
        {title}
      </h2>

      <div className="latest-content">

        {loading
          ? Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="latest-skeleton"
                aria-hidden="true"
              />
            ))
          : items.map((item) => (
              <LatestCard
                key={item.id}
                item={item}
              />
            ))}

      </div>

    </aside>
  );
}

export default memo(SidebarLatest);
