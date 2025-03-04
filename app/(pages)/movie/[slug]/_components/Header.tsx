import { useTranslations } from "next-intl";

export default function Header() {
  const t = useTranslations("EditPage");

  return (
    <h2 className="w-full text-heading-three text-white md:text-heading-two">
      {t("EDIT")}
    </h2>
  );
}
