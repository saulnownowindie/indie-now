import * as RadixSelect from "@radix-ui/react-select";

import "./Select.css";

import SelectTrigger from "./SelectTrigger";
import SelectContent from "./SelectContent";
import SelectItem from "./SelectItem";

export default function Select({
  label,
  placeholder = "Seleccione una opción",
  value,
  onValueChange,
  children,
  disabled = false,
}) {
  return (
    <div className="select-wrapper">

      {label && (
        <label className="select-label">
          {label}
        </label>
      )}

      <RadixSelect.Root
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
      >
        <SelectTrigger placeholder={placeholder} />

        <SelectContent>
          {children}
        </SelectContent>
      </RadixSelect.Root>

    </div>
  );
}

Select.Item = SelectItem;