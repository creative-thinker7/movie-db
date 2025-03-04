import { getLocale } from "@/libs/session";
import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async () => {
  const locale = await getLocale();

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
