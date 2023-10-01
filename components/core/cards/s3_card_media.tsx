import { useState } from "react";
import { S3Key } from "../../../core/types/general";
import { Skeleton } from "@mui/material";
import Image from "next/image";
import { trpc } from "../../../client";

export interface IS3CardMediaProps {
  s3Key: S3Key;
  className?: string
}

/**
 * Takes an s3Key and creates a CardMedia component from it, will refresh
 * when the s3Key changes
 */
// TODO: Prevent flicking while things load....
export const S3CardMedia = (props: IS3CardMediaProps) => {
  const { s3Key, className } = props;
  const [show, setShow] = useState(true);
  const [imageLoading, setImageLoading] = useState(true);
  const signedUrl = trpc.s3.getSignedUrl.useQuery({ key: s3Key })

  if (!signedUrl.isSuccess) {
    return null;
  }

  if (!show) {
    return null;
  }

  return (
    <div style={{ position: "relative", aspectRatio: "1", width: "100%" }}>
      {(signedUrl.isLoading || imageLoading) && (
        <Skeleton variant="rectangular" height="100%" />
      )}
      <Image
        src={signedUrl.data}
        onLoadingComplete={() => setImageLoading(false)}
        onError={() => setShow(false)}
        layout="fill"
        objectFit="cover"
        alt=""
        className={className}
      />
    </div>
  );
};
