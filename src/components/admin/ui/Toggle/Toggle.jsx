import "./Toggle.css";

export default function Toggle({
  id,
  label,
  description,
  checked,
  onChange,
  disabled = false,
}) {
  return (
    <div className="form-toggle">
      <div className="form-toggle__text">
        <label htmlFor={id}>{label}</label>

        {description && <p>{description}</p>}
      </div>

      <label className="form-toggle__switch">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          disabled={disabled}
        />

        <span className="form-toggle__slider" />
      </label>
    </div>
  );
}
