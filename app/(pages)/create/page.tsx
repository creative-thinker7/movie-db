import { useTranslations } from "next-intl";
import CreateForm from "./_components/CreateForm";

export default function CreateMoviePage() {
  const t = useTranslations("CreatePage");

  return (
    <div className="mx-auto flex min-h-screen max-w-grid-max flex-col items-center gap-y-16 px-6 py-default-sm md:px-0 md:py-default">
      <h2 className="w-full text-heading-three text-white md:text-heading-two">
        {t("CREATE_NEW_MOVIE")}
      </h2>
      <CreateForm />
    </div>
  );
}
