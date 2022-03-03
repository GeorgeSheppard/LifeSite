import {
  Box,
  CircularProgress,
  Icon,
  IconButton,
  Tooltip,
} from "@mui/material";
import { useMemo, useState, useCallback, MouseEvent } from "react";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { Image } from "../../store/reducers/types";
import CardMedia from "@mui/material/CardMedia";

export interface ICardMediaProps {
  images: Image[];
}

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

  return (
    <div style={{ position: "relative" }}>
      <CardMedia src={images[imageIndex].path} component="img" height="300px" />
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
