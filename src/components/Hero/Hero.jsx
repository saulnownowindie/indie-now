import "./Hero.css";
import {
    FaMusic,
    FaNewspaper,
    FaGuitar,
    FaSpotify,
    FaBullhorn,
    FaTshirt
} from "react-icons/fa";
export default function Hero() {
  return (
    <section className="hero container">

      <aside className="latest left">

        <h2 className="section-title">
          Lo Último
        </h2>

<div className="latest-card">

    <span><FaMusic /></span>

    <div>

        {/* <small>Sesión</small> */}

        <strong>Nueva sesión disponible</strong>

    </div>

</div>

<div className="latest-card">

    <span><FaNewspaper /></span>

    <div>

        {/* <small>Noticia</small> */}

        <strong>Nueva noticia</strong>

    </div>

</div>

<div className="latest-card">

    <span><FaGuitar /></span>

    <div>

        {/* <small>Festival</small> */}

        <strong>Próximo festival</strong>

    </div>

</div>

      </aside>

      <section className="hero-center">

        <span className="hero-tag">
          Nuestra Última Sesión en vivo
        </span>



        <div className="video-wrapper">

          <iframe
            src="https://www.youtube.com/embed/YVQp1E9Ng4Y"
            title="YouTube"
            allowFullScreen
          />

        </div>

        <div className="hero-buttons">

          {/* <button className="btn-primary">
            Ver en YouTube
          </button> */}

        </div>

      </section>

      <aside className="latest right">

        <h2 className="section-title">
          Lo Último
        </h2>

  <div className="latest-card">

    <span><FaSpotify /></span>

    <div>

        {/* <small>Playlist</small> */}

        <strong>Playlist actualizada</strong>

    </div>

</div>
<div className="latest-card">

    <span><FaBullhorn /></span>

    <div>

        {/* <small>Convocatoria</small> */}

        <strong>Convocatoria abierta</strong>

    </div>

</div>
<div className="latest-card">

    <span><FaTshirt /></span>

    <div>

        {/* <small>Merch</small> */}

        <strong>Nuevo Merch</strong>

    </div>

</div>

      </aside>

    </section>
  );
}