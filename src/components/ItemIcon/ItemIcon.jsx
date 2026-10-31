import {
  Music, Shirt, Star, Disc, Mic, Video, Newspaper, Radio, Headphones, ShoppingBag,
} from "lucide-react";
import { FaInstagram, FaYoutube, FaTiktok } from "react-icons/fa6";

const icons = {
  Music, Shirt, Star, Disc, Mic, Video, Newspaper, Radio, Headphones, ShoppingBag,
  Instagram: FaInstagram, Youtube: FaYoutube, TikTok: FaTiktok,
};

export default function ItemIcon({ name, size = 16, className = "" }) {
  const IconComponent = icons[name] || Star;
  return <IconComponent size={size} className={className} />;
}
