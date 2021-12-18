import formidable from "formidable";
import fs from "fs";
import { NextApiRequest, NextApiResponse } from "next";

export const config = {
  api: {
    // Consume as a stream
    bodyParser: false,
  },
};

const post = async (req: NextApiRequest, res: NextApiResponse) => {
  const form = new formidable.IncomingForm();
  form.parse(req, async function (err, fields, files) {
    if (err) {
      res.writeHead(err.httpCode || 400, { "Content-Type": "text/plain" });
      res.end(String(err));
      return;
    }
    const filesToSave = Array.isArray(files.files)
      ? files.files
      : [files.files];
    const promises = filesToSave.map((file: formidable.File) => saveFile(file));
    const filenames = await Promise.all(promises);

    return res.status(201).send(filenames.join(","));
  });
};

const saveFile = async (file: formidable.File) => {
  const data = fs.readFileSync(file.filepath);
  fs.writeFileSync(`./public/${file.originalFilename}`, data);
  await fs.unlinkSync(file.filepath);
  return file.originalFilename;
};

const apiHandler = (req: NextApiRequest, res: NextApiResponse) =>
  req.method === "POST" ? post(req, res) : res.status(404).send("");

export default apiHandler;
