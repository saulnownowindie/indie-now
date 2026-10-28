import "./Header.css";

import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  FaInstagram,
  FaYoutube,
  FaSpotify,
  FaTiktok,
} from "react-icons/fa";

import logo from "../../assets/images/indie-nowlogo-blancov2.png";
import { homeData } from "../../data/homeData";

const NAV_ITEMS = [
  { to: "/noticias", label: "Noticias" },
  { to: "/resenas", label: "Reseñas" },
  { to: "/sesiones", label: "Sesiones" },
  { to: "/no-podes-perderte", label: "No Podés Perderte" },
  { to: "/merch", label: "Merch" },
];

const SOCIALS = [
  {
    label: "Instagram de Indie Now",
    href: "https://www.instagram.com/indienownow/",
    Icon: FaInstagram,
  },
  {
    label: "YouTube de Indie Now",
    href: "https://www.youtube.com/@INDIENOW",
    Icon: FaYoutube,
  },
  {
    label: "Spotify de Indie Now",
    href: "https://open.spotify.com/user/23nomspw5w0lofcqo0bbgj8du?si=24dcebd47c76406f",
    Icon: FaSpotify,
  },
  {
    label: "TikTok de Indie Now",
    href: "https://www.tiktok.com/@indienownow",
    Icon: FaTiktok,
  },
];

function SocialLinks({ className }) {
  return (
    <div className={className}>
      {SOCIALS.map(({ label, href, Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
        >
          <Icon aria-hidden="true" />
        </a>
      ))}
    </div>
  );
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleRef = useRef(null);
  const closeRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    closeRef.current?.focus();

    const previousOverflow = document.body.style.overflow;

    const handleKeyDown = (event) => {
      if (event.key !== "Escape") return;

      setMenuOpen(false);
      toggleRef.current?.focus();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  return (
    <>
      <header className={`header ${scrolled ? "scrolled" : ""}`}>
        <div className="container header-container">
          <button
            ref={toggleRef}
            type="button"
            className="menu-toggle"
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={menuOpen}
            aria-controls="mobile-drawer"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className="menu-toggle-bar" />
            <span className="menu-toggle-bar" />
            <span className="menu-toggle-bar" />
          </button>

          <div className="brand">
            <Link
              to="/"
              className="logo"
              aria-label="Indie Now, ir al inicio"
            >
              <img src={logo} alt="Indie Now" />
            </Link>

            <p className="tagline">
              Descubrí música que vale la pena escuchar.
            </p>
          </div>

          <nav className="header-nav" aria-label="Navegación principal">
            <ul className="nav">
              {NAV_ITEMS.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      isActive ? "active" : ""
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <SocialLinks className="socials" />
        </div>
      </header>

      <div
        className={`drawer-overlay ${menuOpen ? "open" : ""}`}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />

      <aside
        id="mobile-drawer"
        className={`drawer ${menuOpen ? "open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Menú de navegación"
        aria-hidden={!menuOpen}
      >
        <div className="drawer-header">
          <span className="drawer-title">Menú</span>

          <button
            ref={closeRef}
            type="button"
            className="drawer-close"
            aria-label="Cerrar menú"
            onClick={() => setMenuOpen(false)}
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>

        <nav className="drawer-nav" aria-label="Navegación móvil">
          <ul>
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    isActive ? "active" : ""
                  }
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="drawer-latest">
          <h2 className="drawer-latest-title">Lo Último</h2>

          <ul>
            {homeData.latestRight.map((item) => {
              const Icon = item.icon;

              return (
                <li key={item.id}>
                  <a
                    href={item.url}
                    className="drawer-latest-item"
                  >
                    <span className="drawer-latest-icon">
                      <Icon aria-hidden="true" />
                    </span>

                    <span className="drawer-latest-text">
                      <span className="drawer-latest-item-title">
                        {item.title}
                      </span>

                      <span className="drawer-latest-item-description">
                        {item.description}
                      </span>

                      <span className="drawer-latest-item-published">
                        {item.published}
                      </span>
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>

        <SocialLinks className="drawer-socials" />
      </aside>
    </>
  );
}
