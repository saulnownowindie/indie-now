import "./DashboardCard.css";

export default function DashboardCard({
    title,
    value,
    subtitle,
    icon: Icon,
}) {

    return (

        <article className="dashboard-card">

            <div className="dashboard-card__top">

                <div>

                    <p>{title}</p>

                    <h2>{value}</h2>

                    <small>{subtitle}</small>

                </div>

                <div className="dashboard-card__icon">

                    <Icon size={26} />

                </div>

            </div>

        </article>

    );

}