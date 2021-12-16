import Container from "@mui/material/Container";
import { useRouter } from "next/router";
import Box from "@mui/material/Box";
import { headerHeight } from "../../components/header";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import { BufferGeometry } from "three/src/Three";
import { useState, useEffect, useCallback, createRef } from "react";
import Button from "@mui/material/Button";
import {
  CanvasScreenshotter,
  ICanvasScreenshotterRef,
} from "../../components/canvas_screenshotter";

export default function DisplayModel() {
  const router = useRouter();
  const [geometry, setGeometry] = useState<BufferGeometry>();
  const screenshotRef = createRef<ICanvasScreenshotterRef>();
  const [screenshot, setScreenshot] = useState<string>();

  const slug = router.query.slug;
  const fileContent = JSON.stringify(router.query.file);
  console.log(fileContent);

  useEffect(() => {
    const stlLoader = new STLLoader();
    stlLoader.load("/Support_casques.stl", (geo) => {
      setGeometry(geo);
    });
  }, []);

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
        >
          <CanvasScreenshotter ref={screenshotRef} />
          <OrbitControls enablePan={false} />
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          {geometry ? (
            <mesh geometry={geometry}>
              <meshStandardMaterial color="#cccccc" />
            </mesh>
          ) : (
            <mesh>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color={"orange"} />
            </mesh>
          )}
        </Canvas>
      </Box>
    </Container>
  );
}
