import { readImage } from "@/libs/image";
import { generateResponse } from "@/libs";
import { checkSession } from "@/libs/session";
import type { NextRequest } from "next/server";

type Params = Promise<{ name: string }>;

export async function GET(
  request: NextRequest,
  { params }: { params: Params },
) {
  const { name } = await params;

  const isAuthenticated = await checkSession();
  if (!isAuthenticated) {
    return generateResponse("Unauthorized", 401);
  }

  try {
    const { fileContents, mimeType } = await readImage(name);
    return new Response(fileContents, {
      headers: {
        "Content-Type": mimeType,
        "Cache-Control": "public, max-age=86400, immutable", // Cached for one day.
      },
    });
  } catch (error) {
    if ((error as { code: string }).code === "ENOENT") {
      return generateResponse("Image not found", 404);
    }
    return generateResponse("Internal server error", 500);
  }
}
