import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { CustomSession } from "./auth/[...nextauth]";
import fs from "fs";

const deleteDirectoryOrFile = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const session = (await getSession({ req })) as CustomSession;
  if (!session?.id) {
    res.json({ error: "Unauthorized" });
    return res.status(401).end();
  }

  const paths = JSON.parse(req.body) as string[];
  for (const path of paths) {
    if (!path.split("/").includes(session.id)) {
      res.json({ error: "Unauthorized" });
      return res.status(401).end();
    }

    let fullPath = "./public" + path;
    if (fs.existsSync(fullPath)) {
      const stat = fs.lstatSync(fullPath);

      if (stat.isDirectory()) {
        fs.rmdirSync(fullPath);
      } else if (stat.isFile()) {
        fs.rmSync(fullPath);
      } else {
        res.json({ error: "Path not a file or directory" });
        return res.status(404).end();
      }
    }
  }
};

const apiHandler = (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "DELETE") {
    deleteDirectoryOrFile(req, res);
  } else {
    res.json({ error: "Page not found" });
    res.status(404).end();
  }
};

export default apiHandler;
