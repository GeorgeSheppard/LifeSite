import Container from "@mui/material/Container";
import { useRouter } from "next/router";
import Box from "@mui/material/Box";
import { headerHeight } from "../../components/header";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import {
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
  createRef,
  useRef,
} from "react";
import Button from "@mui/material/Button";
import {
  CanvasScreenshotter,
  ICanvasScreenshotterRef,
} from "../../components/canvas_screenshotter";
import { useAppSelector } from "../../store/hooks/hooks";
import { BufferGeometry, Group, Loader, Vector3 } from "three";
import Model from "./model";

export default function DisplayModel() {
  const router = useRouter();
  const pathToFile = useAppSelector((store) => store.printing.previewPath);

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
          <Model pathToFile={pathToFile} />
        </Canvas>
      </Box>
    </Container>
  );
}
