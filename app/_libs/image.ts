import "server-only";
import fs from "fs";
import path from "path";
import { fileTypeFromBuffer } from "file-type";
import { UPLOAD_DIR } from "@/app/constants";

function getImagePath(fileName: string) {
  return path.join(process.cwd(), UPLOAD_DIR, fileName);
}

export async function saveImage(image: File) {
  // To ensure uniqueness of file names, prefix it with timestamp.
  const fileName = `${Date.now()}-${image.name}`;
  const imagePath = getImagePath(fileName);

  // Ensure the directory exists
  const dir = path.dirname(imagePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(imagePath, Buffer.from(await image.arrayBuffer()));

  return fileName;
}

export async function readImage(fileName: string) {
  const fileContents = fs.readFileSync(getImagePath(fileName));

  // Detect the MIME type from the file contents.
  const type = await fileTypeFromBuffer(fileContents);
  const mimeType = type ? type.mime : "application/octet-stream";

  return {
    fileContents,
    mimeType,
  };
}

export async function deleteImage(fileName: string) {
  fs.unlinkSync(getImagePath(fileName));
}
