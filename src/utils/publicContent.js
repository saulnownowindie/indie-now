import { resolveMediaUrl } from "./mediaUrl";

const MONTHS = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

const PLATFORM_LABELS = {
  INSTAGRAM: "Instagram",
  TIKTOK: "TikTok",
  YOUTUBE: "YouTube",
  FACEBOOK: "Facebook",
  X: "X",
  THREADS: "Threads",
  OTHER: "Otro",
};

function toDate(value) {
  if (!value) return null;

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatNewsDate(value) {
  const date = toDate(value);

  if (!date) return "";

  return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

export function formatRelativeDate(value) {
  const date = toDate(value);

  if (!date) return "";

  const diff = Date.now() - date.getTime();
  const hours = Math.floor(diff / 3_600_000);
  const days = Math.floor(diff / 86_400_000);

  if (days <= 0) {
    if (hours <= 0) return "Ahora";

    return `Hace ${hours} h`;
  }

  if (days === 1) return "Ayer";

  if (days < 30) return `Hace ${days} días`;

  return new Intl.DateTimeFormat("es-PY", {
    day: "2-digit",
    month: "short",
  }).format(date);
}

export function normalizePublicNews(item) {
  if (!item?.title) return null;

  const publishedAt = item.publishedAt || item.createdAt || null;

  return {
    id: `news-${item.id}`,
    category: item.category?.name || "Noticias",
    title: item.title,
    date: formatNewsDate(publishedAt),
    image: resolveMediaUrl(item.coverImage?.url),
    url: item.url || "#",
    publishedAt,
  };
}

export function normalizePublicReel(item) {
  if (!item?.title) return null;

  const publishedAt = item.publishedAt || item.createdAt || null;

  return {
    id: `reel-${item.id}`,
    title: item.title,
    platform: PLATFORM_LABELS[item.platform] || item.platform || "Reel",
    platformCode: item.platform || "OTHER",
    image: resolveMediaUrl(item.coverImage?.url || item.coverUrl),
    url: item.url || "#",
    publishedAt,
  };
}

export function mapPublicList(data, normalize) {
  if (!Array.isArray(data)) return [];

  return data.map(normalize).filter(Boolean);
}
