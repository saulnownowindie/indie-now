import "./LatestCard.css";

export default function LatestCard({ item }) {
  const Icon = item.icon;

  return (
    <a href={item.url} className="latest-card">
      <span>
        <Icon />
      </span>

      <div>
        <strong>{item.title}</strong>

        <p className="latest-description">
          {item.description}
        </p>

        <small>{item.published}</small>
      </div>
    </a>
  );
}