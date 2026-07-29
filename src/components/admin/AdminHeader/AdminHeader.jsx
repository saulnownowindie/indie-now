import "./AdminHeader.css";

import {
  Bell,
  SunMoon,
  Search,
  Menu,
  ChartColumn,
} from "lucide-react";

import { useLocation } from "react-router-dom";

const titles = {
  "/admin": "Dashboard",
  "/admin/news": "Noticias",
  "/admin/sessions": "Sesiones",
  "/admin/reels": "Reels",
  "/admin/merch": "Merch",
  "/admin/settings": "Configuración",
};

export default function AdminHeader({ onMenuClick }) {

  const location = useLocation();

  const title = titles[location.pathname] ?? "Panel";

  return (

    <header className="admin-header">

      <div className="admin-header__left">

        <button
          className="mobile-menu"
          onClick={onMenuClick}
        >
          <Menu size={22} />
        </button>

        <div>

          <small>Panel de Administración</small>

          <h1>{title}</h1>

        </div>

      </div>

<div className="admin-header__right">

  <div className="admin-search">

    <Search size={18} />

    <input
      type="text"
      placeholder="Buscar noticias, reels, merch..."
    />

  </div>

  <button
    className="header-icon"
    title="Estadísticas"
  >
    <ChartColumn size={20} />
  </button>

<button
  className="header-icon"
  title="Cambiar tema"
>
  <SunMoon
    size={22}
    strokeWidth={2.5}
  />
</button>

  <button
    className="header-icon"
    title="Notificaciones"
  >
    <Bell size={20} />
  </button>

  <button
    className="header-profile"
    title="Mi cuenta"
  >
    <img
      src="/avatars/dwith.jpg"
      alt="Administrador"
      className="header-avatar"
    />
  </button>

</div>

    </header>

  );

}