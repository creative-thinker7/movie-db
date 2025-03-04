import { z } from "zod";
import { MovieFormRequest } from "@/types";

export const CreateFormSchema = z.object({
  title: z.string().nonempty({ message: "TITLE_ERROR" }).trim(),
  year: z
    .number()
    .min(1800, { message: "YEAR_ERROR" })
    .max(new Date().getFullYear(), {
      message: "YEAR_ERROR",
    }),
});

export async function parseCreateMoviePayload(request: Request) {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    throw new Error("Bad request");
  }

  if (!formData) {
    throw new Error("Bad request");
  }

  if (!formData.get("title")) {
    throw new Error("TITLE_ERROR");
  }

  if (!formData.get("year")) {
    throw new Error("YEAR_ERROR");
  }

  const image = formData.get("image");
  if (!image || !(image instanceof File)) {
    throw new Error("IMAGE_ERROR");
  }

  const payload: MovieFormRequest = {
    title: formData.get("title") as string,
    year: Number(formData.get("year") as string),
    image,
  };

  // Validate payload.
  const validatedFields = CreateFormSchema.safeParse(payload);
  if (!validatedFields.success) {
    const errors = validatedFields.error.flatten().fieldErrors;
    const messages = Object.keys(errors).map((field) =>
      errors[field as "title" | "year"]?.join(" "),
    );
    throw new Error(messages.join(" "));
  }

  return payload;
}
