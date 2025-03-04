"use client";

import { useTranslations } from "next-intl";
import { MovieFormRequest } from "@/types";
import { useRouter } from "next/navigation";
import { MovieForm, useToast } from "@/components";
import { useCreateMovie } from "@/api";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEY_MOVIES } from "@/app/constants";

export default function CreateForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useCreateMovie();
  const t = useTranslations("CreatePage");
  const addToast = useToast();

  const [error, setError] = useState<string | undefined>();

  const handleSubmit = async (data: MovieFormRequest) => {
    try {
      await mutateAsync(data);

      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === QUERY_KEY_MOVIES,
      });

      addToast(t("SUCCESS_MESSAGE"));

      router.push("/");
    } catch (e) {
      const msg = (e as Error).message || "GENERIC_ERROR";
      setError(t.has(msg) ? t(msg) : msg);
    }
  };

  return (
    <MovieForm isPending={isPending} error={error} onSubmit={handleSubmit} />
  );
}
