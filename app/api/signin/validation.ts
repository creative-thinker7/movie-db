import { z } from "zod";
import { SigninFormRequest } from "@/types";

const SigninFormSchema = z.object({
  email: z.string().email({ message: "INVALID_EMAIL_ERROR" }).trim(),
  password: z.string().nonempty({ message: "PASSWORD_ERROR" }).trim(),
  rememberMe: z.boolean(),
});

export async function parseSigninPayload(request: Request) {
  let payload: SigninFormRequest;
  try {
    payload = await request.json();
  } catch {
    throw new Error("Bad request");
  }

  if (typeof payload.email !== "string") {
    throw new Error("INVALID_EMAIL_ERROR");
  }

  if (typeof payload.password !== "string") {
    throw new Error("PASSWORD_ERROR");
  }

  // Validate payload.
  const validatedFields = SigninFormSchema.safeParse(payload);
  if (!validatedFields.success) {
    const errors = validatedFields.error.flatten().fieldErrors;
    const messages = Object.keys(errors).map((field) =>
      errors[field as "email" | "password"]?.join(" "),
    );
    throw new Error(messages.join(" "));
  }

  return payload;
}
