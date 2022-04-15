import CardMedia, { CardMediaProps } from "@mui/material/CardMedia";
import { useEffect, useState } from "react";
import { S3Key } from "../../store/reducers/types"
import { getS3SignedUrl } from "../aws/s3_utilities";

export interface IS3CardMediaProps extends CardMediaProps<"img"> {
  s3Key: S3Key;
}

/**
 * Takes an s3Key and creates a CardMedia component from it, will refresh
 * when the s3Key changes
 */
export const S3CardMedia = (props: IS3CardMediaProps) => {
  const { s3Key, ...mediaProps } = props;
  const [signedUrl, setSignedUrl] = useState<string | null>(null);


  useEffect(() => {
    const fetchUrl = async () => {
      const url = await getS3SignedUrl(s3Key)
      setSignedUrl(url);
    }    

    fetchUrl();
  }, [s3Key])

  if (!signedUrl) {
    return null;
  }

  return <CardMedia src={signedUrl} component="img" {...mediaProps} />
}