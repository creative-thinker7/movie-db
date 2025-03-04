import { useTranslations } from "next-intl";
import { ButtonLink } from "@/components";

export default function NoMovieDisplay() {
  const t = useTranslations("HomePage");

  return (
    <div className="m-6 flex w-full flex-col items-center gap-y-8 md:m-0">
      <h2 className="text-center text-heading-two text-white">
        {t("EMPTY_LIST")}
      </h2>
      <ButtonLink
        href="/create"
        appearance="primary"
        className="w-full md:w-fit"
      >
        {t("ADD_NEW_MOVIE")}
      </ButtonLink>
    </div>
  );
}
