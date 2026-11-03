import "./AdminSidebar.css";
import { useAuth } from "../../../auth/useAuth";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Newspaper,
  Tags,
  Clapperboard,
  Film,
  ShoppingBag,
  ListMusic,
  Users,
  Settings,
  LogOut,
} from "lucide-react";
import { resolveMediaUrl } from "../../../utils/mediaUrl";

const menu = [
  {
    to: "/admin",
    label: "Dashboard",
    icon: LayoutDashboard,
    end: true,
  },
  {
    to: "/admin/news",
    label: "Noticias",
    icon: Newspaper,
  },
  {
    to: "/admin/categories",
    label: "Categorías",
    icon: Tags,
  },
  {
    to: "/admin/sessions",
    label: "Sesiones",
    icon: Clapperboard,
  },
  {
    to: "/admin/reels",
    label: "Reels",
    icon: Film,
  },
  {
    to: "/admin/merch",
    label: "Merch",
    icon: ShoppingBag,
  },
  {
    to: "/admin/playlists",
    label: "Playlists",
    icon: ListMusic,
  },
  {
    to: "/admin/users",
    label: "Equipo",
    icon: Users,
  },
  {
    to: "/admin/settings",
    label: "Configuración",
    icon: Settings,
  },
];

export default function AdminSidebar({ open = false, onClose }) {
  const { user, logout, avatarVersion } = useAuth();
  const navigate = useNavigate();

  const avatarUrl = resolveMediaUrl(user?.avatarUrl);
  const avatarSrc = avatarUrl
    ? `${avatarUrl}?v=${avatarVersion}`
    : "/avatars/dwith.jpg";

  function handleLogout() {
    logout();
    navigate("/admin/login");
  }

  return (
    <aside className={`admin-sidebar${open ? " open" : ""}`}>
      <div className="admin-sidebar__logo">
        <img
          src="/branding/serotonin.png"
          alt="Indie Now"
          decoding="async"
        />
      </div>

      <nav className="admin-sidebar__nav">
        {menu.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onClose}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <Icon size={20} />

              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="admin-sidebar__footer">
        <div className="admin-user">
          <img
            src={avatarSrc}
            alt={user?.name || "Administrador"}
            decoding="async"
            key={user?.avatarUrl}
          />

          <div className="admin-user__info">
            <strong>{user?.name || "Administrador"}</strong>

            <small>{user?.role || ""}</small>
          </div>
        </div>

        <button className="logout-button" onClick={handleLogout}>
          <LogOut size={18} />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
}