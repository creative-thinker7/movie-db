import clsx from "clsx";
import { ReactNode } from "react";

interface Props {
  currentPage?: number;
  page?: number;
  disabled?: boolean;
  children?: ReactNode;
  onClick?: (page: number) => void;
}

export default function Page({
  currentPage,
  page,
  disabled,
  children,
  onClick,
}: Props) {
  return (
    <button
      className={clsx(
        "h-8 min-w-8 rounded px-2 text-center text-body-regular font-bold leading-8 text-white",
        {
          "bg-prospectory-primary": !disabled && currentPage === page,
          "bg-prospectory-card": disabled || currentPage !== page,
          "cursor-not-allowed opacity-50": disabled,
          "!bg-transparent": children,
        },
      )}
      disabled={disabled}
      aria-current={currentPage === page ? "page" : undefined}
      aria-disabled={disabled}
      role="button"
      tabIndex={disabled ? -1 : 0}
      onClick={() => onClick && onClick(page || 0)}
    >
      {children ? children : page}
    </button>
  );
}
