import { MovieFormRequest } from "@/types";
import { CreateFormSchema } from "../validation";

export async function parseUpdateMoviePayload(request: Request) {
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

  const payload: MovieFormRequest = {
    title: formData.get("title") as string,
    year: Number(formData.get("year") as string),
  };

  const image = formData.get("image");
  if (image) {
    payload.image = image as File;
  }

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
