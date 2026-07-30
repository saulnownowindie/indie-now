import "./AdminSidebar.css";
import { useAuth } from "../../../auth/AuthContext";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Newspaper,
  Clapperboard,
  Film,
  ShoppingBag,
  Settings,
  LogOut,
} from "lucide-react";


const user = {
  name: "Saúl González",
  role: "Administrador",
  avatar: "/avatars/dwith.jpg",
};

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
    to: "/admin/settings",
    label: "Configuración",
    icon: Settings,
  },
];

export default function AdminSidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }
  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar__logo">
        <picture>
          <source
            media="(prefers-color-scheme: dark)"
            srcSet="/indie-nowlogo-blancov2.png"
          />

          <img src="/indie-nowlogo.png" alt="Indie Now" />
        </picture>
      </div>

      <nav className="admin-sidebar__nav">
        {menu.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
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
            src={user?.avatar || "/avatars/dwith.jpg"}
            alt={user?.name || "Administrador"}
          />

          <div className="admin-user__info">
            <strong>{user?.name || "Administrador"}</strong>

            <small>{user?.role || ""}</small>
          </div>
        </div>

<button
  className="logout-button"
  onClick={handleLogout}
>
  <LogOut size={18} />
  <span>Cerrar sesión</span>
</button>
      </div>
    </aside>
  );
}
