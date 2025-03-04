import { deleteSession } from "@/libs/session";

export async function POST() {
  await deleteSession();
  return Response.json({});
}
