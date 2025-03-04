import { useTranslations } from "next-intl";
import Link from "next/link";

export default function NotFound() {
  const t = useTranslations("NotFoundPage");

  return (
    <div className="relative mx-auto flex min-h-screen max-w-grid-max items-center justify-center">
      <div className="m-6 flex w-full flex-col items-center gap-y-8 text-white md:m-0">
        <p className="text-center text-body-large">{t("MESSAGE")}</p>
        <Link href="/">{t("GO_TO_HOME")}</Link>
      </div>
    </div>
  );
}
