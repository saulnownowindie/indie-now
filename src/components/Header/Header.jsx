import "./Header.css";
import logo from "../../assets/images/indie-nowlogo.png";

import { useEffect, useState } from "react";

import {
    FaInstagram,
    FaYoutube,
    FaSpotify,
    FaTiktok
} from "react-icons/fa";

export default function Header() {

    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {

        const handleScroll = () => {

            setScrolled(window.scrollY > 120);

        };

        window.addEventListener("scroll", handleScroll);

        return () => window.removeEventListener("scroll", handleScroll);

    }, []);

    return (

        <header className={scrolled ? "header scrolled" : "header"}>

            <div className="header-container">

                <a href="/" className={scrolled ? "logo hide" : "logo"}>

                    <img
                        src={logo}
                        alt="Indie Now"
                    />

                </a>

                <nav>

                    <ul className="nav">

                        <li><a href="#">Inicio</a></li>

                        <li><a href="#">Sesiones</a></li>

                        <li><a href="#">Noticias</a></li>

                        <li><a href="#">Lo Nuevo</a></li>

                        <li><a href="#">Merch</a></li>

                    </ul>

                </nav>

                <div className="socials">

                    <a href="https://www.instagram.com/indienownow/">
                        <FaInstagram />
                    </a>

                    <a href="https://www.youtube.com/@INDIENOW">
                        <FaYoutube />
                    </a>

                    <a href="https://open.spotify.com/user/23nomspw5w0lofcqo0bbgj8du?si=24dcebd47c76406f">
                        <FaSpotify />
                    </a>

                    <a href="https://www.tiktok.com/@indienownow">
                        <FaTiktok />
                    </a>

                </div>

            </div>

        </header>

    );

}