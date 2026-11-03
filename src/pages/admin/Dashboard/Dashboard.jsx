import "./Dashboard.css";
import DashboardCard from "../../../components/admin/DashboardCard/DashboardCard";

import {
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
                    brandColor="#FF0000"
                />

                <DashboardCard
                    title="Sesiones"
                  value={stats.sesiones}
                    subtitle="Sin publicaciones"
                    icon={Clapperboard}
                    brandColor="#FF6B6B"
                />

                <DashboardCard
                    title="Reels"
                    value={stats.reels}
                    subtitle="Sin publicaciones"
                    icon={Film}
                    brandColor="#FCB03F"
                />

                <DashboardCard
                    title="Merch"
                    value={stats.merch}
                    subtitle="Sin publicaciones"
                    icon={ShoppingBag}
                    brandColor="#FD79A8"
                />

            </div>

        </section>

    );

}