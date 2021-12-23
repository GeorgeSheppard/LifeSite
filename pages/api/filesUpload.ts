import formidable from "formidable";
import fs from "fs";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { CustomSession } from "./auth/[...nextauth]";

export const config = {
  api: {
    // Consume as a stream
    bodyParser: false,
  },
};

export interface IValidUploadResponse {
  /**
   * The path to the file
   */
  writePath: string;
}

export interface IErrorUploadResponse {
  error: string;
}

export interface IUploadResponse
  extends IValidUploadResponse,
    IErrorUploadResponse {}

// TODO: Apparently this is resolving without sending a response (despite the fact I am reading the response...)
const post = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = (await getSession({ req })) as CustomSession;
  if (!session.id) {
    res.json({ error: "Unauthorized" });
    return res.status(401).end();
  }

  const form = new formidable.IncomingForm({
    multiples: false,
  });
  form.parse(req, async function (err, fields, files) {
    if (err) {
      res.writeHead(err.httpCode || 400, { "Content-Type": "text/plain" });
      res.json({ error: String(err) });
      return;
    }

    // TODO: Why does formidable still have the type as [] when I am uploading singular files
    const file = files.file as formidable.File;
    const folder = fields.folder as string;
    const newFilename = fields.newFilename as string;
    const writePath = await saveFile(file, session.id, folder, newFilename);
    return res.status(201).send({ writePath });
  });
};

const saveFile = async (
  file: formidable.File,
  userFolder: string,
  subFolder: string,
  newFilename: string
) => {
  const data = fs.readFileSync(file.filepath);

  const relativeFolder = `${userFolder}/${subFolder}`;
  const folderPath = `./public/${relativeFolder}`;
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  const writePath = `${folderPath}/${newFilename}`;
  fs.writeFileSync(writePath, data);
  await fs.unlinkSync(file.filepath);
  // NB: When loading assets only care relative to "public"
  return `/${relativeFolder}/${newFilename}`;
};

const apiHandler = (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    post(req, res);
  } else {
    res.json({ error: "Page not found" });
    res.status(404).end();
  }
};

export default apiHandler;
