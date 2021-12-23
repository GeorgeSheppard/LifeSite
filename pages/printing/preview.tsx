import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { headerHeight } from "../../components/header";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useState, useCallback, createRef } from "react";
import Button from "@mui/material/Button";
import {
  CanvasScreenshotter,
  ICanvasScreenshotterRef,
} from "../../components/canvas_screenshotter";
import Model from "../../components/printing/model";
import { GetServerSideProps } from "next";
import { loadModel } from "../../components/printing/model_loader";

export interface IPreview {
  // Group is passed through props as json
  model: any;
}

export default function Preview(props: IPreview) {
  const screenshotRef = createRef<ICanvasScreenshotterRef>();
  const [screenshot, setScreenshot] = useState<string>();

  // TODO: Remove this awful hack, 48px is two times the padding on either side
  const canvasSideLength = `min(calc(100vh - ${headerHeight}px), 100vw - 48px)`;

  const takeCanvasScreenshot = useCallback(() => {
    if (screenshotRef.current) {
      const screenshot = screenshotRef.current.takeScreenshot();
      setScreenshot(screenshot);
    }
  }, [screenshotRef, setScreenshot]);

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
        <Button component="div" onClick={takeCanvasScreenshot}>
          Screenshot
        </Button>
        {/* just for temporarily displaying image will be removed */}
        {/* eslint-disable-next-line*/}
        {screenshot && <img src={screenshot} />}
        <Canvas
          resize={{
            debounce: 0,
            scroll: false,
          }}
          gl={{ preserveDrawingBuffer: true }}
          camera={{ position: [0.5, 0.5, 4], fov: 50 }}
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

export const getServerSideProps: GetServerSideProps = async (context) => {
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
    props: { model: model.toJSON() },
  };
};
