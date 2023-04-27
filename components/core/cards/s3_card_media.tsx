import CardMedia, { CardMediaProps } from "@mui/material/CardMedia";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { S3Key } from "../../../core/types/general";
import { Skeleton } from "@mui/material";
import { getS3SignedUrl } from "../../../core/s3/s3_utilities";

export interface IS3CardMediaProps extends CardMediaProps<"img"> {
  s3Key: S3Key;
}

/**
 * Takes an s3Key and creates a CardMedia component from it, will refresh
 * when the s3Key changes
 */
export const S3CardMedia = (props: IS3CardMediaProps) => {
  const { s3Key, ...mediaProps } = props;
  const [show, setShow] = useState(true);
  const [imageLoading, setImageLoading] = useState(true);
  const signedUrl = useQuery({
    queryKey: [s3Key],
    queryFn: () => getS3SignedUrl(s3Key),
  });

  if (!signedUrl.isSuccess) {
    return null;
  }

  if (!show) {
    return null;
  }

  return (
    <>
      {(signedUrl.isLoading || imageLoading) && (
        <Skeleton variant="rectangular" height={300} width="100%" />
      )}
      <CardMedia
        src={signedUrl.data}
        component="img"
        {...mediaProps}
        onError={() => setShow(false)}
        onLoad={() => setImageLoading(false)}
        height={imageLoading ? 0 : mediaProps.height}
      />
    </>
  );
};
