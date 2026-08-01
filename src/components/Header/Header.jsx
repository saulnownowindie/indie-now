import "./Header.css";
import logo from "../../assets/images/indie-nowlogo-blancov2.png";

import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FaInstagram, FaYoutube, FaSpotify, FaTiktok } from "react-icons/fa";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  const headerRef = useRef(null);

  useEffect(() => {
    const updateHeader = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollY.current;

      setScrolled(currentY > 120);

      if (headerRef.current) {
        if (currentY > 160 && delta > 4) {
          headerRef.current.style.transform = "translateY(-100%)";
        } else if (delta < -4 || currentY < 160) {
          headerRef.current.style.transform = "translateY(0)";
        }
      }

      lastScrollY.current = currentY;
      ticking.current = false;
    };

    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(updateHeader);
        ticking.current = true;
      }
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header ref={headerRef} className={`header ${scrolled ? "scrolled" : ""}`}>
      <div className="container header-container">
        <Link to="/" className={scrolled ? "logo hide" : "logo"}>
          <img src={logo} alt="Indie Now" />
        </Link>

        <nav>
          <ul className="nav">
            <li>
              <Link to="/">Inicio</Link>
            </li>

            <li>
              <Link to="/noticias">Noticias</Link>
            </li>

            <li>
              <Link to="/sesiones">Sesiones</Link>
            </li>

            <li>
              <Link to="/reels">Reels</Link>
            </li>

            <li>
              <Link to="/merch">Merch</Link>
            </li>
          </ul>
        </nav>

        <div className="socials">
          <a
            href="https://www.instagram.com/indienownow/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaInstagram />
          </a>

          <a
            href="https://www.youtube.com/@INDIENOW"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaYoutube />
          </a>

          <a
            href="https://open.spotify.com/user/23nomspw5w0lofcqo0bbgj8du?si=24dcebd47c76406f"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaSpotify />
          </a>

          <a
            href="https://www.tiktok.com/@indienownow"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaTiktok />
          </a>
        </div>
      </div>
    </header>
  );
}
