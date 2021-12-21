import formidable from "formidable";
import fs from "fs";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { CustomSession } from "./auth/[...nextauth]";
import { v4 as uuidv4 } from "uuid";

export const config = {
  api: {
    // Consume as a stream
    bodyParser: false,
  },
};

const post = async (req: NextApiRequest, res: NextApiResponse) => {
  const form = new formidable.IncomingForm();
  const session = (await getSession({ req })) as CustomSession;

  if (session.id) {
    form.parse(req, async function (err, fields, files) {
      if (err) {
        res.writeHead(err.httpCode || 400, { "Content-Type": "text/plain" });
        res.end(String(err));
        return;
      }
      const filesToSave = Array.isArray(files.files)
        ? files.files
        : [files.files];
      const promises = filesToSave.map((file: formidable.File) =>
        saveFile(file, session.id, "")
      );
      const filenames = await Promise.all(promises);

      return res.status(201).send(filenames.join(","));
    });
  }
  return res.status(401);
};

const saveFile = async (
  file: formidable.File,
  userPath: string,
  folder: string
) => {
  const data = fs.readFileSync(file.filepath);

  // TODO: Use a folder passed through instead
  const folderPath = `./public/${userPath}/images`;
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  fs.writeFileSync(`${folderPath}/${uuidv4()}_${file.originalFilename}`, data);
  await fs.unlinkSync(file.filepath);
  return file.originalFilename;
};

const apiHandler = (req: NextApiRequest, res: NextApiResponse) =>
  req.method === "POST" ? post(req, res) : res.status(404).send("");

export default apiHandler;
