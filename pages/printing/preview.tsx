import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { headerHeight } from "../../components/core/header";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useState, createRef, MouseEvent } from "react";
import {
  CanvasScreenshotter,
  ICameraParams,
  ICanvasScreenshotterRef,
} from "../../components/printing/canvas_screenshotter";
import Model from "../../components/printing/model";
import { GetServerSideProps } from "next";
import { loadModel } from "../../components/printing/model_loader";
import { KeyboardArrowDown } from "@mui/icons-material";
import { PreviewPopper } from "../../components/printing/preview_popper";
import { useAppSelector } from "../../store/hooks/hooks";

export interface IPreview {
  /**
   * Group is passed through props as json
   */
  model: any;
  /**
   * UUID corresponding to the model entry, will be empty if it's new
   */
  uuid: string;
}

export default function Preview(props: IPreview) {
  const screenshotRef = createRef<ICanvasScreenshotterRef>();
  const [popperOpen, setPopperOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const existingData = useAppSelector((store) => {
    if (props.uuid.length > 0) {
      return store.printing.models[props.uuid];
    }
  });
  const [cameraParams] = useState<ICameraParams>(() => {
    return (
      existingData?.cameraParams ?? {
        position: [0.5, 0.5, 4],
        quaternion: [0, 0, 0, 1],
        zoom: 1,
      }
    );
  });

  // TODO: Remove this awful hack, 48px is two times the padding on either side
  const canvasSideLength = `min(calc(100vh - ${headerHeight}px), 100vw - 48px)`;

  // Really moans if you put the actual event type of MouseEvent<SVGSVGElement>
  const handlePopperClick = (event: MouseEvent<any>) => {
    if (event.currentTarget) {
      setAnchorEl(event.currentTarget);
      setPopperOpen((prevState) => !prevState);
    }
  };

  return (
    <Container maxWidth={false}>
      <Box
        component="div"
        sx={{
          pt: "24px",
          height: canvasSideLength,
          width: canvasSideLength,
          margin: "auto",
        }}
      >
        <KeyboardArrowDown
          component="svg"
          sx={{
            position: "relative",
            left: `calc(${canvasSideLength} / 2 - 12px)`,
          }}
          onClick={handlePopperClick}
        />
        {/* Want to remount component when it opens */}
        {anchorEl && popperOpen && screenshotRef && (
          <PreviewPopper
            open={true}
            anchorEl={anchorEl}
            screenshotRef={screenshotRef}
            existingData={existingData}
            uuid={props.uuid}
          />
        )}
        <Canvas
          resize={{
            debounce: 0,
            scroll: false,
          }}
          gl={{ preserveDrawingBuffer: true }}
          camera={{
            position: cameraParams.position,
            zoom: cameraParams.zoom,
            quaternion: cameraParams.quaternion,
            fov: 50,
          }}
          dpr={window.devicePixelRatio}
        >
          <CanvasScreenshotter ref={screenshotRef} />
          <OrbitControls />
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          <Model model={props.model} />
        </Canvas>
      </Box>
    </Container>
  );
}

export const getServerSideProps: GetServerSideProps<IPreview> = async (
  context
) => {
  const path = context.query.writePath;

  if (!path || path instanceof Array) {
    return {
      redirect: {
        destination: "/printing",
        permanent: false,
      },
    };
  }

  let model;
  try {
    model = await loadModel(path);
  } catch (err) {
    console.error(err);
    return {
      redirect: {
        destination: "/printing",
        permanent: false,
      },
    };
  }

  return {
    props: {
      model: model.toJSON(),
      // I would prefer to return possibly undefined, but this crashes if you do that
      uuid: context.query.uuid as any as string,
    },
  };
};
