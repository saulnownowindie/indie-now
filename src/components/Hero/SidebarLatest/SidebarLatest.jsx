import "./SidebarLatest.css";
import LatestCard from "../LatestCard/LatestCard";

export default function SidebarLatest({ title, items, className = "" }) {
  return (
    <aside className={`latest ${className}`}>

      <h2 className="section-title">
        {title}
      </h2>

      <div className="latest-content">

        {items.map((item) => (
          <LatestCard
            key={item.id}
            item={item}
          />
        ))}

      </div>

    </aside>
  );
}