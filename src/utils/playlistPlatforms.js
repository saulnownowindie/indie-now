import {
  FaMusic,
  FaSpotify,
  FaTiktok,
  FaYoutube,
} from "react-icons/fa";

const platforms = {
  SPOTIFY: { value: "SPOTIFY", label: "Spotify", icon: FaSpotify },
  YOUTUBE_MUSIC: {
    value: "YOUTUBE_MUSIC",
    label: "YouTube",
    icon: FaYoutube,
  },
  TIKTOK: { value: "TIKTOK", label: "TikTok", icon: FaTiktok },
  APPLE_MUSIC: {
    value: "APPLE_MUSIC",
    label: "Apple Music",
    icon: FaMusic,
  },
  DEEZER: { value: "DEEZER", label: "Deezer", icon: FaMusic },
  TIDAL: { value: "TIDAL", label: "Tidal", icon: FaMusic },
  AMAZON_MUSIC: {
    value: "AMAZON_MUSIC",
    label: "Amazon Music",
    icon: FaMusic,
  },
  OTHER: { value: "OTHER", label: "Otra", icon: FaMusic },
};

export const playlistPlatformOptions = [
  platforms.SPOTIFY,
  platforms.YOUTUBE_MUSIC,
  platforms.TIKTOK,
];

export function getPlaylistPlatform(value) {
  return (
    platforms[value] || {
      value: value || "OTHER",
      label: value || "Playlist",
      icon: FaMusic,
    }
  );
}
