import { Link } from "react-router-dom";
import "./SectionTitle.css";

export default function SectionTitle({
  title,
  linkTo,
  linkLabel = "Ver todos",
}) {
  return (
    <div className="section-heading">
      <h2 className="section-heading-title">{title}</h2>

      {linkTo && (
        <Link
          to={linkTo}
          className="section-heading-link"
          aria-label={`${linkLabel}: ${title}`}
        >
          {linkLabel}

          <span className="section-heading-arrow" aria-hidden="true">
            →
          </span>
        </Link>
      )}
    </div>
  );
}
