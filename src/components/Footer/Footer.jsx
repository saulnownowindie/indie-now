import "./Footer.css";

import { Link } from "react-router-dom";

import logo from "../../assets/images/indie-nowlogo.png";

import {
  FaInstagram,
  FaYoutube,
  FaSpotify,
  FaTiktok,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="footer">

      <div className="container">

        <div className="footer-top">

          <img
            src={logo}
            alt="Indie Now"
            className="footer-logo"
          />

          <p className="footer-description">
            La plataforma que impulsa a la nueva generación de
            artistas independientes de Latinoamérica.
          </p>

        </div>

        <div className="footer-divider" />

        <div className="footer-content">

          <div className="footer-column">

            <h3>Explorar</h3>

            <div className="footer-links">

              <Link to="/">Inicio</Link>

              <Link to="/sesiones">Sesiones</Link>

              <Link to="/noticias">Noticias</Link>

              <Link to="/merch">Merch</Link>

            </div>

          </div>

<div className="footer-column">

  <h3>Redes</h3>

  <div className="footer-links">

    <a
      href="https://www.instagram.com/indienownow/"
      target="_blank"
      rel="noreferrer"
    >
      <FaInstagram />
      Instagram
    </a>

    <a
      href="https://www.youtube.com/@INDIENOW"
      target="_blank"
      rel="noreferrer"
    >
      <FaYoutube />
      YouTube
    </a>

    <a
      href="https://open.spotify.com/"
      target="_blank"
      rel="noreferrer"
    >
      <FaSpotify />
      Spotify
    </a>

    <a
      href="https://www.tiktok.com/@indienownow"
      target="_blank"
      rel="noreferrer"
    >
      <FaTiktok />
      TikTok
    </a>

  </div>

</div>

          <div className="footer-column">

            <h3>Contacto</h3>

            <div className="footer-links">

              <span>Paraguay</span>

              <span>indienowforcontact@gmail.com</span>

            </div>

          </div>

        </div>

        <div className="footer-divider" />

        <div className="footer-bottom">

          <p>
            © 2026 Indie Now. Todos los derechos reservados.
          </p>

        </div>

      </div>

    </footer>
  );
}