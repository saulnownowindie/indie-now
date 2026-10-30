import { useMemo } from "react";
import {
  FaFacebook,
  FaInstagram,
  FaNewspaper,
  FaTiktok,
  FaVideo,
  FaYoutube,
} from "react-icons/fa";

import usePublicNews from "./usePublicNews";
import usePublicReels from "./usePublicReels";
import {
  formatRelativeDate,
  mapPublicList,
  normalizePublicNews,
  normalizePublicReel,
} from "../utils/publicContent";

const REEL_ICONS = {
  INSTAGRAM: FaInstagram,
  YOUTUBE: FaYoutube,
  TIKTOK: FaTiktok,
  FACEBOOK: FaFacebook,
};

function sortByDateDesc(a, b) {
  const aTime = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
  const bTime = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;

  return bTime - aTime;
}

export default function useLatestContent({ enabled = true } = {}) {
  const newsQuery = usePublicNews(undefined, { enabled });
  const reelsQuery = usePublicReels(undefined, { enabled });

  const items = useMemo(() => {
    const news = mapPublicList(newsQuery.data, normalizePublicNews)
      .slice(0, 3)
      .map((item) => ({
        id: `latest-${item.id}`,
        type: "news",
        icon: FaNewspaper,
        title: item.title,
        description: item.category,
        published: formatRelativeDate(item.publishedAt),
        url: item.url,
        publishedAt: item.publishedAt,
      }));

    const reels = mapPublicList(reelsQuery.data, normalizePublicReel)
      .slice(0, 3)
      .map((item) => ({
        id: `latest-${item.id}`,
        type: "reel",
        icon: REEL_ICONS[item.platformCode] || FaVideo,
        title: item.title,
        description: item.platform,
        published: formatRelativeDate(item.publishedAt),
        url: item.url,
        publishedAt: item.publishedAt,
      }));

    return [...news, ...reels].sort(sortByDateDesc);
  }, [newsQuery.data, reelsQuery.data]);

  return {
    items,
    isLoading: newsQuery.isLoading || reelsQuery.isLoading,
    isError: newsQuery.isError && reelsQuery.isError,
  };
}
