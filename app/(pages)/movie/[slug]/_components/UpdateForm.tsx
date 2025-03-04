"use client";

import { useTranslations } from "next-intl";
import { MovieEntity, MovieFormRequest } from "@/types";
import { useRouter } from "next/navigation";
import { MovieForm, useToast } from "@/components";
import { useUpdateMovie } from "@/api";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEY_MOVIES } from "@/app/constants";

interface Props {
  movie: MovieEntity;
}

export default function UpdateForm({ movie }: Props) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useUpdateMovie();
  const t = useTranslations("EditPage");
  const addToast = useToast();

  const [error, setError] = useState<string | undefined>();

  const handleSubmit = async (data: MovieFormRequest) => {
    try {
      await mutateAsync({
        slug: movie.slug,
        data,
      });

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
    <MovieForm
      movie={movie}
      isPending={isPending}
      error={error}
      onSubmit={handleSubmit}
    />
  );
}
