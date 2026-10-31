import "./PlaylistCard.css";

import { memo, useState } from "react";

import ItemIcon from "../ItemIcon/ItemIcon";
import { getPlaylistPlatform } from "../../utils/playlistPlatforms";

function PlaylistCard({ playlist }) {
  const [failedImage, setFailedImage] = useState(null);

  const platform = getPlaylistPlatform(playlist.platformCode);
  const PlatformIcon = platform.icon;

  const showImage =
    Boolean(playlist.image) && failedImage !== playlist.image;

  const isExternal = /^https?:\/\//.test(playlist.url);

  return (
    <a
      className="playlist-card"
      href={playlist.url}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      aria-label={`Escuchar ${playlist.title} en ${platform.label}`}
    >
      <div className="playlist-card__media">
        {showImage ? (
          <img
            src={playlist.image}
            alt=""
            loading="lazy"
            decoding="async"
            onError={() => setFailedImage(playlist.image)}
          />
        ) : (
          <div className="playlist-card__placeholder" aria-hidden="true">
            <span>INDIE NOW</span>
          </div>
        )}

        {playlist.icon && (
          <span className="playlist-card__icon">
            <ItemIcon name={playlist.icon} size={18} />
          </span>
        )}
      </div>

      <div className="playlist-card__body">
        <span className="playlist-card__platform">
          <PlatformIcon aria-hidden="true" />
          {platform.label}
        </span>

        <h3 className="playlist-card__title">{playlist.title}</h3>

        {playlist.tracksCount !== null && (
          <small className="playlist-card__meta">
            {playlist.tracksCount} canciones
          </small>
        )}
      </div>
    </a>
  );
}

export default memo(PlaylistCard);
