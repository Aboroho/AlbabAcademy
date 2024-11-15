import { PUBLIC_ROOT, UPLOAD_ROOT } from "@/lib/constants";
import fs from "node:fs/promises";
import path from "path";
import { APIError } from "./handleError";
import { fileTypeFromBuffer } from "file-type";

function getFileInfo(file: File, fileName?: string) {
  const fileDefaultExtension = file.type.split("/")[1];

  // extracting file name and extension
  const lastDotIndex = file.name.lastIndexOf(".");
  let fileExtension: string;
  if (lastDotIndex == -1) {
    fileExtension = fileDefaultExtension;
  } else fileExtension = file.name.slice(lastDotIndex + 1);

  // only alphaneumeric
  const fn = file.name.slice(0, lastDotIndex).replace(/[^a-zA-Z0-9_-]/g, "_");
  console.log(fn);

  // generating unique file name
  const _fileName =
    (fileName ? fileName : fn) +
    +"_" +
    Date.now() +
    "_" +
    Math.floor(Math.random() * 10000);

  return { _fileName, fileExtension };
}

/**
 *
 * @param mimeType
 * @param fileName
 * @returns associate path/folder for the file type
 */
function getPathPrefix(mimeType: string, fileName: string) {
  const [fileType, fileSubType] = mimeType.split("/");
  let filePath: string;
  if (fileType === "image") {
    filePath = `images/${fileName}`;
  } else if (fileType === "video") {
    filePath = `videos/${fileName}`;
  } else if (fileSubType === "pdf") {
    filePath = `pdf/${fileName}`;
  } else {
    filePath = `${fileName}`;
  }
  return filePath;
}

function getFilePath(file: File, fileName?: string) {
  const { _fileName, fileExtension } = getFileInfo(file, fileName);

  return getPathPrefix(file.type, _fileName + "." + fileExtension);
}

export const uploadFile = async (
  file: File,
  options?: { isTmp?: boolean; fileName?: string }
) => {
  const { isTmp, fileName } = options || {};
  const { _fileName, fileExtension } = getFileInfo(file, fileName);
  const filePath = isTmp
    ? `tmp/${_fileName}.${fileExtension}`
    : getFilePath(file, fileName);

  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);
  const prefix = `${PUBLIC_ROOT}/${UPLOAD_ROOT}/`;

  await fs.writeFile(`${prefix}/${filePath}`, buffer);
  return `/${UPLOAD_ROOT}/${filePath}`;
};

export const deleteFile = async (deletePath: string) => {
  try {
    await fs.unlink(`${PUBLIC_ROOT}/${deletePath}`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    if (err.code === "ENOENT") {
      throw new APIError("No file found", 404);
    }
  }
};

export const replaceFile = async (replacePath: string, file: File) => {
  await deleteFile(replacePath);
  return await uploadFile(file);
};

export const validateFileAndMove = async (
  filePath: string | undefined | null,
  options?: {
    size?: { min?: number; max?: number };
    type?: string[];
    deleteOnFail?: boolean;
  }
) => {
  // in case user provide an external link, simply return that link.
  // local path should start with /
  if (!filePath) return null;

  if (!filePath.startsWith("/uploads/tmp")) return filePath;

  const originalFilePath = PUBLIC_ROOT + filePath;
  try {
    const fileBuffer = await fs.readFile(originalFilePath);
    const type = await fileTypeFromBuffer(fileBuffer);
    const stat = await fs.stat(originalFilePath);

    const mnS = options?.size?.min;
    const mxS = options?.size?.max;
    const typ = options?.type;

    const f1 = mnS ? mnS <= stat.size : true;
    const f2 = mxS ? mxS >= stat.size : true;
    const f3 = typ ? typ.includes(type?.mime || "") : true;

    if (f1 && f2 && f3) {
      const fileName = path.basename(originalFilePath);
      const newPath =
        PUBLIC_ROOT +
        "/" +
        UPLOAD_ROOT +
        "/" +
        getPathPrefix(type?.mime || "", fileName);

      await fs.rename(originalFilePath, newPath);
      return newPath.replace(PUBLIC_ROOT, "");
    } else {
      if (options?.deleteOnFail) {
        await fs.unlink(originalFilePath);
      }
      throw new APIError("Incompitable file");
    }
  } catch (err: unknown) {
    if (err instanceof APIError) throw err;
    return filePath;
  }
};
