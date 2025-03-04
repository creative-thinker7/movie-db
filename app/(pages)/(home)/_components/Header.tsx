"use client";

import { useTranslations } from "next-intl";
import { useLogout } from "@/api";
import { Button } from "@/components";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Props {
  hasMovies: boolean;
}

export default function Header({ hasMovies }: Props) {
  const router = useRouter();

  const { mutateAsync, isPending } = useLogout();

  const t = useTranslations("HomePage");

  const handleLogout = async () => {
    await mutateAsync();
    router.push("/signin");
  };

  return (
    <div className="absolute left-6 right-6 top-default-sm flex justify-between md:inset-x-0 md:top-default">
      {!hasMovies ? (
        <div>&nbsp;</div>
      ) : (
        <h2 className="flex items-center gap-x-4 text-heading-three text-white md:text-heading-two">
          {t("MY_MOVIES")}
          <Link
            href="/create"
            title={t("ADD_NEW_MOVIE")}
            aria-label={t("ADD_NEW_MOVIE")}
          >
            <Image src="/plus.svg" width="32" height="32" alt="plus" />
          </Link>
        </h2>
      )}
      <Button
        appearance="link"
        disabled={isPending}
        aria-label={t("LOGOUT")}
        onClick={handleLogout}
      >
        <span className="hidden md:block">{t("LOGOUT")}</span>
        <Image src="/logout.svg" width="32" height="32" alt="logout" />
      </Button>
    </div>
  );
}
