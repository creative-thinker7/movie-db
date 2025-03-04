"use client";

import { saveLocale } from "@/libs/session";

export default function LocaleSelector() {
  const handleChangeLocale = (locale: "en" | "es") => async () => {
    await saveLocale(locale);
  };

  return (
    <div className="flex items-center justify-center gap-x-4 text-sm text-white">
      <button
        aria-label="Switch to English"
        title="Switch to English"
        onClick={handleChangeLocale("en")}
      >
        English
      </button>
      <button
        aria-label="Switch to Español"
        title="Switch to Español"
        onClick={handleChangeLocale("es")}
      >
        Español
      </button>
    </div>
  );
}
