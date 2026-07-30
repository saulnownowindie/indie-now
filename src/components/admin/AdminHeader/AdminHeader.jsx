import "./AdminHeader.css";
import { useAuth } from "../../../auth/AuthContext";
import { Bell, Sun, Moon, Search, Menu } from "lucide-react";

import { useLocation } from "react-router-dom";
import useTheme from "../../../hooks/useTheme";

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

  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  return (
    <header className="admin-header">
      <div className="admin-header__left">
        <button className="mobile-menu" onClick={onMenuClick}>
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

          <input type="text" placeholder="Buscar noticias, reels, merch..." />
        </div>

        <button
          className="header-icon"
          title="Cambiar tema"
          onClick={toggleTheme}
        >
          {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <button className="header-icon" title="Notificaciones">
          <Bell size={20} />
        </button>

        <button className="header-profile" title={user?.name ?? "Mi cuenta"}>
          <img
            src={user?.avatar || "/avatars/dwith.jpg"}
            alt={user?.name || "Administrador"}
            className="header-avatar"
          />

          <div className="header-user-info">
            <span className="header-user-name">
              {user?.name || "Administrador"}
            </span>

            <small className="header-user-role">{user?.role || ""}</small>
          </div>
        </button>
      </div>
    </header>
  );
}
