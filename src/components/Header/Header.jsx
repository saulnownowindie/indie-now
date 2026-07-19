import "./Header.css";
import logo from "../../assets/images/indie-nowlogo-blancov2.png";

import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

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

                <Link
                    to="/"
                    className={scrolled ? "logo hide" : "logo"}
                >

                    <img
                        src={logo}
                        alt="Indie Now"
                    />

                </Link>

                <nav>

                    <ul className="nav">

                        <li>

                            <Link to="/">
                                Inicio
                            </Link>

                        </li>

                        <li>

                            <Link to="/noticias">
                                Noticias
                            </Link>

                        </li>

                        <li>

                            <Link to="/sesiones">
                                Sesiones
                            </Link>

                        </li>

                        <li>

                            <Link to="/reels">
                                Reels
                            </Link>

                        </li>

                        <li>

                            <Link to="/merch">
                                Merch
                            </Link>

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