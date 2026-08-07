import { Search } from "lucide-react";

import "./SearchInput.css";

export default function SearchInput({
  placeholder = "Buscar...",
  value,
  onChange,
}) {
  return (
    <div className="search-input">
      <Search size={18} />

      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}