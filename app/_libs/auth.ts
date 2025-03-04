import "server-only";
import prisma from "@/prisma/client";
import * as bcrypt from "bcrypt";

export async function checkPassword(email: string, password: string) {
  // Retrieve user record from database.
  const user = await prisma.user.findFirst({
    where: { email: email.toLowerCase() },
  });
  if (!user) {
    return null;
  }

  // Check password.
  const matched = await bcrypt.compare(password, user.password);
  if (!matched) {
    return null;
  }

  return user.id;
}
