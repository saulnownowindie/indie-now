import "./PublicLayout.css";
import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { ArrowUp } from "lucide-react";

import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import RouteFallback from "../../components/RouteFallback/RouteFallback";
import FloatingSpotifyPlayer from "../../components/FloatingSpotifyPlayer/FloatingSpotifyPlayer";
import usePublicPlaylists from "../../hooks/usePublicPlaylists";

export default function PublicLayout() {
  const { data: playlists } = usePublicPlaylists();
  
  // Buscamos la playlist de Spotify que esté destacada
  const featuredSpotify = playlists?.find(
    (p) => p.platform === "SPOTIFY" && p.url
  );

  return (
    <>
      <Header />
      <Suspense fallback={<RouteFallback />}>
        <main className="public-layout">
          <Outlet />
        </main>
        <Footer />
      </Suspense>
      
      {/* El reproductor flotante */}
      {featuredSpotify && (
        <FloatingSpotifyPlayer playlistUrl={featuredSpotify.url} />
      )}

      <button
        type="button"
        className="back-to-top"
        aria-label="Volver al inicio"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <ArrowUp size={20} />
      </button>
    </>
  );
}