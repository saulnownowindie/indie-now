import "./Select.css";

import * as SelectPrimitive from "@radix-ui/react-select";

import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@radix-ui/react-icons";

const Select = ({
  label,
  placeholder = "Seleccione una opción",
  value,
  onValueChange,
  disabled = false,
  children,
}) => {
  return (
    <div className="admin-select">

      {label && (
        <label className="admin-select__label">
          {label}
        </label>
      )}

      <SelectPrimitive.Root
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
      >
        <SelectPrimitive.Trigger
          className="admin-select__trigger"
          aria-label={
            typeof label === "string"
              ? label
              : "Seleccionar opción"
          }
        >
          <SelectPrimitive.Value placeholder={placeholder} />

          <SelectPrimitive.Icon>
            <ChevronDownIcon />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>

        <SelectPrimitive.Portal>
          <SelectPrimitive.Content
            className="admin-select__content"
            position="popper"
            sideOffset={8}
            collisionPadding={8}
          >
            <SelectPrimitive.ScrollUpButton className="admin-select__scroll-button">
              <ChevronUpIcon />
            </SelectPrimitive.ScrollUpButton>

            <SelectPrimitive.Viewport className="admin-select__viewport">
              {children}
            </SelectPrimitive.Viewport>

            <SelectPrimitive.ScrollDownButton className="admin-select__scroll-button">
              <ChevronDownIcon />
            </SelectPrimitive.ScrollDownButton>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>
    </div>
  );
};

const SelectItem = ({
  children,
  value,
  disabled = false,
}) => {
  return (
    <SelectPrimitive.Item
      value={value}
      disabled={disabled}
      className="admin-select__item"
    >
      <SelectPrimitive.ItemText>
        {children}
      </SelectPrimitive.ItemText>

      <SelectPrimitive.ItemIndicator className="admin-select__item-indicator">
        <CheckIcon />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  );
};

Select.Item = SelectItem;

export default Select;