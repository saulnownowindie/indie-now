import * as RadixSelect from "@radix-ui/react-select";

import {
  CheckIcon,
} from "@radix-ui/react-icons";

export default function SelectItem({
  children,
  value,
}) {
  return (
    <RadixSelect.Item
      value={value}
      className="select-item"
    >

      <RadixSelect.ItemText>
        {children}
      </RadixSelect.ItemText>

      <RadixSelect.ItemIndicator
        className="select-item-indicator"
      >
        <CheckIcon />
      </RadixSelect.ItemIndicator>

    </RadixSelect.Item>
  );
}