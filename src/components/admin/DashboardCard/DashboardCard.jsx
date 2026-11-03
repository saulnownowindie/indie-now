import "./DashboardCard.css";

export default function DashboardCard({
    title,
    value,
    subtitle,
    icon: Icon,
    brandColor,
}) {

    const iconStyle = brandColor ? { color: brandColor } : {};
    const cardStyle = {
        border: "2px solid var(--brand-magenta)",
        boxShadow: "4px 4px 0px var(--brand-magenta)",
    };

    return (

        <article className="dashboard-card" style={cardStyle}>

            <div className="dashboard-card__top">

                <div>

                    <p>{title}</p>

                    <h2>{value}</h2>

                    <small>{subtitle}</small>

                </div>

                <div className="dashboard-card__icon" style={iconStyle}>

                    <Icon size={26} />

                </div>

            </div>

        </article>

    );

}