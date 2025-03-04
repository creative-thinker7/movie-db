"use client";

import { useTranslations } from "next-intl";
import { MovieEntity, MovieFormRequest } from "@/types";
import { Controller, useForm } from "react-hook-form";
import {
  Button,
  ButtonLink,
  DropBox,
  ErrorDescription,
  Input,
  Loader,
} from "@/components";
import { useCallback } from "react";

interface Props {
  movie?: MovieEntity;
  isPending: boolean;
  error: string | undefined;
  onSubmit: (data: MovieFormRequest) => Promise<void>;
}

export default function MovieForm({
  movie,
  isPending,
  error,
  onSubmit,
}: Props) {
  const {
    register,
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<MovieFormRequest>({
    defaultValues: movie
      ? {
          title: movie.title,
          year: movie.year,
        }
      : undefined,
  });

  const t = useTranslations("Shared");

  const handleChangeImage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files?.length) {
        setValue("image", event.target.files[0]);
      }
    },
    [setValue],
  );

  const renderButtons = () => {
    return (
      <>
        <div className="flex w-full items-center gap-x-4">
          <ButtonLink href="/" appearance="default" className="min-w-0 flex-1">
            {t("CANCEL")}
          </ButtonLink>
          <Button
            type="submit"
            appearance="primary"
            className="min-w-0 flex-1"
            disabled={isPending}
          >
            {movie ? t("UPDATE") : t("SUBMIT")}
          </Button>
        </div>
        {error && <ErrorDescription>{error}</ErrorDescription>}
      </>
    );
  };

  return (
    <form
      className="relative flex w-full flex-col gap-6 md:flex-row md:gap-16"
      role="form"
      onSubmit={handleSubmit((data: MovieFormRequest) => onSubmit(data))}
    >
      {isPending && <Loader />}
      <div className="order-2 w-full md:order-1 md:w-4/12">
        <div className="flex w-full flex-col gap-y-1">
          <Controller
            name="image"
            control={control}
            rules={{ required: !movie }}
            render={() => (
              <DropBox
                className={errors.image ? "!border-prospectory-error" : ""}
                currentImage={movie?.image}
                onChange={handleChangeImage}
              />
            )}
          />
          {errors.image && (
            <ErrorDescription>{t("IMAGE_ERROR")}</ErrorDescription>
          )}
        </div>
      </div>
      <div className="order-1 w-full md:order-2 md:w-8/12">
        <div className="flex flex-col gap-y-6 md:max-w-[360px]">
          <div className="flex w-full flex-col gap-y-1">
            <Input
              type="text"
              placeholder={t("TITLE")}
              className={errors.title ? "border-prospectory-error" : ""}
              aria-invalid={!!errors.title}
              {...register("title", { required: true })}
            />
            {errors.title && (
              <ErrorDescription>{t("TITLE_ERROR")}</ErrorDescription>
            )}
          </div>
          <div className="flex w-full flex-col gap-y-1">
            <Input
              type="number"
              placeholder={t("PUBLISHING_YEAR")}
              className={errors.year ? "border-prospectory-error" : ""}
              min={1800}
              max={new Date().getFullYear()}
              aria-invalid={!!errors.year}
              {...register("year", {
                required: true,
                max: new Date().getFullYear(),
                min: 1800,
              })}
            />
            {errors.year && (
              <ErrorDescription>{t("YEAR_ERROR")}</ErrorDescription>
            )}
          </div>
          <div className="hidden w-full flex-col gap-y-1 md:flex">
            {renderButtons()}
          </div>
        </div>
      </div>
      <div className="order-3 flex w-full flex-col gap-y-1 md:hidden">
        {renderButtons()}
      </div>
    </form>
  );
}
