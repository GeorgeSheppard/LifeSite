import { IconButton } from "@mui/material";
import {
  useMemo,
  useState,
  useCallback,
  MouseEvent,
} from "react";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { Image } from "../../../core/types/general";
import { S3CardMedia } from "./s3_card_media";

export interface ICardMediaProps {
  images: Image[];
}

/**
 * Displays image(s) and adds buttons to go left and right to see the
 * other images if they exist
 */
export const WrappedCardMedia = (props: ICardMediaProps) => {
  const { images } = props;

  const [imageIndex, setImageIndex] = useState(0);

  const setImageIndexWrapped = useCallback(
    (index: number) => {
      const numImages = images.length;
      setImageIndex(((index % numImages) + numImages) % numImages);
    },
    [setImageIndex, images.length]
  );
  const changeIndex = useCallback(
    (step: number) => (event: MouseEvent<HTMLElement>) => {
      setImageIndexWrapped(imageIndex + step);
      event.stopPropagation();
    },
    [setImageIndexWrapped, imageIndex]
  );
  const onClickUp = useMemo(() => changeIndex(1), [changeIndex]);
  const onClickDown = useMemo(() => changeIndex(-1), [changeIndex]);

  if (images.length === 0) {
    return null;
  }

  return (
    <div style={{ position: "relative" }}>
      <S3CardMedia s3Key={images[imageIndex].key} height={300} />
      {images.length > 1 && (
        <>
          <IconButton
            onClick={onClickDown}
            sx={{ position: "absolute", top: "50%" }}
          >
            <KeyboardArrowLeftIcon component="svg" />
          </IconButton>
          <IconButton
            onClick={onClickUp}
            sx={{ position: "absolute", top: "50%", right: 0 }}
          >
            <KeyboardArrowRightIcon component="svg" />
          </IconButton>
        </>
      )}
    </div>
  );
};
