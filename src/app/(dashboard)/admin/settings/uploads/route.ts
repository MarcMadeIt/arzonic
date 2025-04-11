import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { IncomingForm, Fields, Files } from "formidable";
import fs from "fs-extra";
import sharp from "sharp";
import { Readable } from "stream";
import { IncomingMessage } from "http";
import { createAdmin } from "@/utils/supabase/server";

export const config = {
  api: { bodyParser: false },
  runtime: "nodejs",
};

async function isAdmin(req: NextRequest): Promise<boolean> {
  console.log("🔍 Checking Admin Authentication...");

  const supabase = await createAdmin(); // ✅ Uses Service Role

  // ✅ Get token manually from Authorization header
  const authHeader = req.headers.get("authorization");

  if (!authHeader) {
    console.error("🔴 No Authorization header provided!");
    return false;
  }

  const token = authHeader.replace("Bearer ", "").trim();
  console.log("🟢 Token received:", token);

  // ✅ Verify the user with the token
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

  if (error || !user) {
    console.error("🔴 Authentication Failed: ", error?.message);
    return false;
  }

  console.log("✅ User Authenticated:", user.email);
  return true;
}

async function convertNextRequestToIncomingMessage(
  req: NextRequest
): Promise<IncomingMessage> {
  const reader = req.body?.getReader();
  const chunks: Uint8Array[] = [];

  if (reader) {
    let done = false;
    while (!done) {
      const { value, done: readerDone } = await reader.read();
      if (value) {
        chunks.push(value);
      }
      done = readerDone;
    }
  }

  const buffer = Buffer.concat(chunks);

  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);

  return Object.assign(stream, {
    headers: Object.fromEntries(req.headers.entries()),
    method: req.method,
    url: req.url,
  }) as IncomingMessage;
}

async function processImage(
  filePath: string,
  outputPath: string,
  fileType: string
) {
  const sizes: { [key: string]: { width: number; height: number } } = {
    hero: { width: 1920, height: 1080 },
    about: { width: 1000, height: 1000 },
  };

  if (!sizes[fileType]) {
    throw new Error("Invalid file type");
  }

  const tempOutputPath = `${outputPath}.tmp`;

  await sharp(filePath)
    .resize(sizes[fileType].width, sizes[fileType].height, { fit: "cover" })
    .toFormat("webp")
    .toFile(tempOutputPath);

  await fs.move(tempOutputPath, outputPath, { overwrite: true });
}

const versionFilePath = path.join(process.cwd(), "public", "version.json");

async function updateVersion(fileType: string) {
  let versions = { hero: 1, about: 1 };

  if (await fs.pathExists(versionFilePath)) {
    versions = await fs.readJson(versionFilePath);
  }

  versions[fileType] = versions[fileType] + 1;

  await fs.writeJson(versionFilePath, versions);
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin(req))) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }

  try {
    const form = new IncomingForm({
      multiples: false,
      maxFileSize: 5 * 1024 * 1024,
    });

    const incomingReq: IncomingMessage =
      await convertNextRequestToIncomingMessage(req);

    const { fields, files }: { fields: Fields; files: Files } =
      await new Promise((resolve, reject) => {
        form.parse(incomingReq, (err, fields, files) => {
          if (err) {
            reject(err);
          } else {
            resolve({ fields, files });
          }
        });
      });

    if (!files.file) {
      return NextResponse.json({ message: "No file found" }, { status: 400 });
    }

    const file = Array.isArray(files.file) ? files.file[0] : files.file;
    if (!file.filepath) {
      return NextResponse.json(
        { message: "File upload failed" },
        { status: 400 }
      );
    }

    const fileType = Array.isArray(fields.type) ? fields.type[0] : fields.type;
    const validTypes = ["hero", "about"];

    if (!fileType || !validTypes.includes(fileType)) {
      return NextResponse.json(
        { message: "Invalid file type. Use 'hero' or 'about'." },
        { status: 400 }
      );
    }

    const appPublicDir = path.join(process.cwd(), "public");
    await fs.ensureDir(appPublicDir);

    const fileName = `${fileType}.webp`;
    const newPath = path.join(appPublicDir, fileName);

    await processImage(file.filepath, newPath, fileType);
    await updateVersion(fileType);

    return NextResponse.json({
      message: "Upload successful!",
      filePath: `/${fileName}`,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Upload failed",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
