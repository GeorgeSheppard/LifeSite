import { z } from "zod";
import { publicProcedure, router, withUser } from "../../trpc";
import {
  DeleteFromS3,
  getS3SignedPostUrl,
  getS3SignedUrl,
} from "../../../core/s3/s3_utilities";

export const s3Router = router({
  getSignedUrl: publicProcedure
    .input(z.object({ key: z.string() }))
    .query(({ input }) => getS3SignedUrl(input.key)),
  delete: publicProcedure
    .input(z.object({ key: z.string() }))
    .mutation(({ input }) => DeleteFromS3(input.key)),
  put: withUser
    .input(
      z.object({
        filename: z.string(),
        folder: z.string().optional(),
      })
    )
    .mutation(async ({ input: { filename, folder }, ctx }) => {
      let path = ctx.session.id;
      if (folder) path += `/${folder}`;
      path += `/${filename}`;

      const signedUrl = await getS3SignedPostUrl(path)
      return { signedUrl, path }
    }),
});
