import { useTranslations } from "next-intl";
import SigninForm from "./_components/SigninForm";
import LocaleSelector from "./_components/LocaleSelector";

export default function LoginPage() {
  const t = useTranslations("SigninPage");

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="m-6 flex w-full flex-col gap-y-9 md:m-0 md:max-w-[300px]">
        <h1 className="text-center text-heading-one text-white">
          {t("SIGNIN")}
        </h1>
        <SigninForm />
        <LocaleSelector />
      </div>
    </div>
  );
}
