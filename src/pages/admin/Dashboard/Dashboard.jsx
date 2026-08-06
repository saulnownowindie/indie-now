import "./Dashboard.css";
import Badge from "../../../components/admin/ui/Badge";
import DashboardCard from "../../../components/admin/DashboardCard/DashboardCard";import {
    Newspaper,
    Clapperboard,
    Film,
    ShoppingBag,
} from "lucide-react";


export default function Dashboard() {
   const stats = {
        noticias: 0,
        sesiones: 0,
        reels: 0,
        merch: 0,
    };
    return (

        <section className="dashboard">

            <div className="dashboard-grid">

                <DashboardCard
                    title="Noticias"
                    value={stats.noticias}
                    subtitle="Sin publicaciones"
                    icon={Newspaper}
                />

                <DashboardCard
                    title="Sesiones"
                  value={stats.sesiones}
                    subtitle="Sin publicaciones"
                    icon={Clapperboard}
                />

                <DashboardCard
                    title="Reels"
                    value={stats.reels}
                    subtitle="Sin publicaciones"
                    icon={Film}
                />

                <DashboardCard
                    title="Merch"
                    value={stats.merch}
                    subtitle="Sin publicaciones"
                    icon={ShoppingBag}
                />

            </div>

        </section>

    );

}