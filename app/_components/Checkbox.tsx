import {
  Checkbox as HeadlessCheckbox,
  CheckboxProps,
  Field,
  Label,
} from "@headlessui/react";
import { ReactNode } from "react";

export default function Checkbox({ children, ...props }: CheckboxProps) {
  return (
    <Field className="flex items-center gap-2">
      <HeadlessCheckbox
        {...props}
        className="group size-[18px] rounded-md bg-prospectory-input"
      >
        <svg
          className="stroke-white opacity-0 group-data-[checked]:opacity-100"
          viewBox="0 0 14 14"
          fill="none"
        >
          <path
            d="M3 8L6 11L11 3.5"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </HeadlessCheckbox>
      <Label className="text-body-small text-white">
        {children as ReactNode}
      </Label>
    </Field>
  );
}
