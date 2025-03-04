import clsx from "clsx";
import Link from "next/link";
import { ReactNode } from "react";

type Props = {
  href: string;
  appearance: "primary" | "default";
  className?: string;
  children: ReactNode;
};

export default function ButtonLink({
  href,
  appearance,
  className,
  children,
}: Props) {
  return (
    <Link
      href={href}
      className={clsx(
        className,
        "flex items-center justify-center gap-x-2 rounded-xl border px-12 py-4 text-body-regular font-bold text-white",
        "hover:brightness-105",
        {
          "border-transparent bg-prospectory-primary": appearance === "primary",
          "border-white": appearance === "default",
        },
      )}
    >
      {children}
    </Link>
  );
}
