import formidable from "formidable";
import fs from "fs";
import { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";

export const config = {
  api: {
    // Consume as a stream
    bodyParser: false,
  },
};

const post = async (req: NextApiRequest, res: NextApiResponse) => {
  const form = new formidable.IncomingForm();
  form.parse(req, async function (err, fields, files) {
    if (Array.isArray(files.file)) {
      // TODO: Need to do more work to return a map from old filename to new one so
      // it can be dumped to user json correctly
      throw new Error("Multiple files uploading isn't implemented yet");
    }

    const id = saveFile(files.file);
    return res.status(201).send(id);
  });
};

const saveFile = async (file: formidable.File) => {
  const id = uuidv4();
  const data = fs.readFileSync(file.filepath);
  fs.writeFileSync(`./public/${id}.${file.mimetype}`, data);
  await fs.unlinkSync(file.filepath);
  return id;
};

const apiHandler = (req: NextApiRequest, res: NextApiResponse) =>
  req.method === "POST" ? post(req, res) : res.status(404).send("");

export default apiHandler;
