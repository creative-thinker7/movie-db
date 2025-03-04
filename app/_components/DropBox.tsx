"use client";

import { useTranslations } from "next-intl";
import clsx from "clsx";
import Image from "next/image";
import { ChangeEventHandler, useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

interface Props {
  className?: string;
  currentImage?: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
}

export default function DropBox({ className, currentImage, onChange }: Props) {
  const t = useTranslations("Shared");

  const [preview, setPreview] = useState<string | undefined>(
    currentImage ? `/api/images/${currentImage}` : undefined,
  );

  const handleDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      setPreview(reader.result as string);
    };
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [".png", ".jpeg", ".jpg"],
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB
    multiple: false,
    onDrop: handleDrop,
  });

  const renderPreview = () => {
    if (!preview) {
      return (
        <>
          <Image src="/upload.svg" width="24" height="24" alt="upload" />
          <p className="text-body-small text-white">{t("DROP_IMAGE")}</p>
        </>
      );
    }

    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={preview} className="max-h-full max-w-full" alt="preview" />
    );
  };

  return (
    <div
      {...getRootProps({
        className: clsx(
          className,
          "min-h-[400px] flex cursor-pointer flex-col items-center justify-center gap-y-2 rounded-xl border-2 border-dashed border-white bg-prospectory-input px-4 py-8",
        ),
        "aria-label": t("DROP_IMAGE"),
      })}
    >
      <input {...getInputProps({ onChange })} />
      {renderPreview()}
    </div>
  );
}
