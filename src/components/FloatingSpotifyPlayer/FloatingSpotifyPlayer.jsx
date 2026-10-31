import { useEffect, useRef, useState } from "react";
import { FaSpotify, FaPlay, FaPause, FaTimes, FaChevronDown } from "react-icons/fa";
import "./FloatingSpotifyPlayer.css";

export default function FloatingSpotifyPlayer({ playlistUrl }) {
  // Iniciamos en 'true' para que aparezca abierto por defecto
  const [isExpanded, setIsExpanded] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [controller, setController] = useState(null);
  const embedRef = useRef(null);

  const getSpotifyUri = (url) => {
    if (!url) return null;
    if (url.startsWith("spotify:")) return url;
    const match = url.match(/playlist\/([a-zA-Z0-9]+)/);
    return match ? `spotify:playlist:${match[1]}` : null;
  };

  const playlistUri = getSpotifyUri(playlistUrl);

  useEffect(() => {
    if (!playlistUri) return;

    // Si la API ya está cargada, creamos el controlador solo una vez
    if (window.SpotifyIframeApi) {
      if (!controller) createController();
      return;
    }

    window.onSpotifyIframeApiReady = (IFrameAPI) => {
      window.SpotifyIframeApi = IFrameAPI;
      createController();
    };

    const script = document.createElement("script");
    script.src = "https://open.spotify.com/embed/iframe-api/v1";
    script.async = true;
    document.body.appendChild(script);
  }, [playlistUri]);

  const createController = () => {
    if (!embedRef.current || !window.SpotifyIframeApi) return;

    const options = { uri: playlistUri, width: "100%", height: 152 };
    window.SpotifyIframeApi.createController(embedRef.current, options, (ctrl) => {
      setController(ctrl);
      ctrl.addListener("playback_update", (e) => {
        setIsPlaying(!e.data.isPaused);
      });
    });
  };

  const togglePlay = (e) => {
    e.stopPropagation();
    if (!controller) return;
    isPlaying ? controller.pause() : controller.resume();
  };

  if (!playlistUri) return null;

  return (
    <div className={`floating-spotify ${isExpanded ? "expanded" : "collapsed"}`}>
      {/* Botón flotante (Solo visible si está colapsado) */}
      {!isExpanded && (
        <button className="spotify-collapsed-btn" onClick={() => setIsExpanded(true)} title="Abrir reproductor">
          <FaSpotify size={36} color="#1DB954" />
        </button>
      )}

      {/* Interfaz Expandida (Siempre en el DOM para no romper la API) */}
      <div className={`spotify-expanded-content ${isExpanded ? "visible" : "hidden"}`}>
        <div className="spotify-header">
          <div className="spotify-brand">
            <FaSpotify size={24} color="#1DB954" />
            <span>Indie Now Radio</span>
          </div>
          <button className="spotify-close-btn" onClick={() => setIsExpanded(false)} title="Minimizar">
            <FaChevronDown size={16} />
          </button>
        </div>

        {/* El div donde vive el iframe de Spotify NO se desmonta nunca */}
        <div ref={embedRef} className="spotify-iframe-container" />

        <div className="spotify-controls">
          <button className="spotify-play-btn" onClick={togglePlay}>
            {isPlaying ? <FaPause /> : <FaPlay />}
          </button>
          <span>{isPlaying ? "Reproduciendo" : "Pausado"}</span>
        </div>
      </div>
    </div>
  );
}