import "./Tabs.css";

export default function Tabs({
  items,
  value,
  onChange,
}) {
  return (
    <div className="tabs">
      {items.map((item) => (
        <button
          key={item.value}
          className={
            value === item.value
              ? "tab active"
              : "tab"
          }
          onClick={() =>
            onChange(item.value)
          }
        >
          {item.label}

          <span>{item.count}</span>
        </button>
      ))}
    </div>
  );
}