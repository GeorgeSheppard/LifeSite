import CardMedia, { CardMediaProps } from "@mui/material/CardMedia";
import { useQuery } from "@tanstack/react-query";
import { S3Key } from "../../store/reducers/types";
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
  const signedUrl = useQuery({
    queryKey: [s3Key],
    queryFn: () => getS3SignedUrl(s3Key),
  });

  if (!signedUrl.isSuccess) {
    return null;
  }

  return <CardMedia src={signedUrl.data} component="img" {...mediaProps} />;
};
