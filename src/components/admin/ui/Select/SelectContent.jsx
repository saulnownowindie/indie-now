import * as RadixSelect from "@radix-ui/react-select";

import {
  ChevronUpIcon,
  ChevronDownIcon,
} from "@radix-ui/react-icons";

export default function SelectContent({
  children,
}) {
  return (
    <RadixSelect.Portal>

      <RadixSelect.Content
        className="select-content"
        position="popper"
        sideOffset={8}
        align="start"
      >

        <RadixSelect.ScrollUpButton
          className="select-scroll-button"
        >
          <ChevronUpIcon />
        </RadixSelect.ScrollUpButton>

        <RadixSelect.Viewport
          className="select-viewport"
        >
          {children}
        </RadixSelect.Viewport>

        <RadixSelect.ScrollDownButton
          className="select-scroll-button"
        >
          <ChevronDownIcon />
        </RadixSelect.ScrollDownButton>

      </RadixSelect.Content>

    </RadixSelect.Portal>
  );
}