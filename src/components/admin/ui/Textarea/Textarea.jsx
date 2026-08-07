import "./Textarea.css";

export default function Textarea({
  label,
  placeholder,
  value,
  onChange,
  rows = 6,
  required = false,
  maxLength,
  disabled = false,
}) {
  return (
    <div className="textarea-wrapper">

      {label && (
        <label className="textarea-label">
          {label}

          {required && <span>*</span>}
        </label>
      )}

      <textarea
        className="textarea"
        placeholder={placeholder}
        value={value}
        rows={rows}
        maxLength={maxLength}
        disabled={disabled}
        onChange={onChange}
      />

      {maxLength && (
        <div className="textarea-counter">
          {value.length}/{maxLength}
        </div>
      )}

    </div>
  );
}