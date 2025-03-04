import { Input as HeadlessInput, InputProps } from "@headlessui/react";
import clsx from "clsx";

export default function Input({ className, ...props }: InputProps) {
  return (
    <HeadlessInput
      {...props}
      className={clsx(
        className,
        "w-full rounded-xl border border-prospectory-input bg-prospectory-input px-4 py-[10px] text-body-small text-white",
        "focus:bg-white focus:text-prospectory-input focus:outline-none",
      )}
    />
  );
}
