import { Button as HeadlessButton, ButtonProps } from "@headlessui/react";
import clsx from "clsx";

type Props = ButtonProps & {
  appearance: "primary" | "default" | "link";
};

export default function Button({
  appearance,
  className,
  children,
  ...props
}: Props) {
  return (
    <HeadlessButton
      {...props}
      className={clsx(
        className,
        "flex items-center justify-center gap-x-2 rounded-xl border py-4 text-body-regular font-bold text-white",
        "hover:brightness-105",
        {
          "border-transparent bg-prospectory-primary": appearance === "primary",
          "border-white": appearance === "default",
          "px-12": appearance !== "link",
          "border-transparent px-0": appearance === "link",
        },
      )}
    >
      {children}
    </HeadlessButton>
  );
}
