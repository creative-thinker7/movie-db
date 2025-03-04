"use client";

import { useTranslations } from "next-intl";
import { useSignin } from "@/api";
import {
  Button,
  Checkbox,
  ErrorDescription,
  Input,
  Loader,
} from "@/components";
import { SigninFormRequest } from "@/types";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i;

export default function SigninForm() {
  const router = useRouter();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SigninFormRequest>({
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const { mutateAsync, isPending } = useSignin();

  const t = useTranslations("SigninPage");

  const [error, setError] = useState<string | undefined>();

  const onSubmit = async (data: SigninFormRequest) => {
    try {
      await mutateAsync(data);

      router.push("/");
    } catch (e) {
      const msg = (e as Error).message || "GENERIC_ERROR";
      setError(t.has(msg) ? t(msg) : msg);
    }
  };

  return (
    <form
      className="relative flex flex-col items-center gap-y-6"
      role="form"
      onSubmit={handleSubmit(onSubmit)}
    >
      {isPending && <Loader />}
      <div className="flex w-full flex-col gap-y-1">
        <Input
          type="email"
          placeholder={t("EMAIL")}
          className={errors.email ? "border-prospectory-error" : ""}
          {...register("email", { required: true, pattern: EMAIL_REGEX })}
        />
        {errors.email && (
          <ErrorDescription>{t("INVALID_EMAIL_ERROR")}</ErrorDescription>
        )}
      </div>
      <div className="flex w-full flex-col gap-y-1">
        <Input
          type="password"
          placeholder={t("PASSWORD")}
          className={errors.password ? "border-prospectory-error" : ""}
          {...register("password", { required: true })}
        />
        {errors.password && (
          <ErrorDescription>{t("PASSWORD_ERROR")}</ErrorDescription>
        )}
      </div>
      <Controller
        name="rememberMe"
        control={control}
        rules={{ required: false }}
        render={({ field }) => (
          <Checkbox
            checked={field.value}
            onChange={(e) => {
              field.onChange(e);
            }}
          >
            {t("REMEMBER_ME")}
          </Checkbox>
        )}
      />
      <div className="flex w-full flex-col gap-y-1">
        <Button type="submit" appearance="primary">
          {t("LOGIN")}
        </Button>
        {error && <ErrorDescription>{error}</ErrorDescription>}
      </div>
    </form>
  );
}
