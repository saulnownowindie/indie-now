import * as RadixSelect from "@radix-ui/react-select";

import {
    ChevronDownIcon,
} from "@radix-ui/react-icons";

export default function SelectTrigger({
    placeholder,
}) {
    return (

        <RadixSelect.Trigger
            className="select-trigger"
        >

            <RadixSelect.Value
                placeholder={placeholder}
            />

            <RadixSelect.Icon className="select-trigger-icon">

                <ChevronDownIcon />

            </RadixSelect.Icon>

        </RadixSelect.Trigger>

    );
}