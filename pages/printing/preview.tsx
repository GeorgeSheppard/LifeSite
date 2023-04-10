import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { headerHeight } from "../../components/core/header";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useState, createRef, MouseEvent, useEffect } from "react";
import {
  CanvasScreenshotter,
  ICanvasScreenshotterRef,
} from "../../components/pages/printing/canvas_screenshotter";
import Model from "../../components/pages/printing/model";
import { loadModel } from "../../components/pages/printing/model_loader";
import { KeyboardArrowDown } from "@mui/icons-material";
import { PreviewPopper } from "../../components/pages/printing/preview_popper";
import { useRouter } from "next/router";
import LinearProgress from "@mui/material/LinearProgress";
import { ICameraParams } from "../../store/reducers/printing/types";
import { usePrinting } from "../../components/hooks/use_data";

export interface IPreview {}

export default function Preview(props: IPreview) {
  const router = useRouter();
  const uuid = router.query.uuid as any as string;
  const screenshotRef = createRef<ICanvasScreenshotterRef>();
  const [popperOpen, setPopperOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const models = usePrinting().data;
  const existingData = uuid?.length > 0 ? models.find(model => model.uuid === uuid) : undefined;
  const [cameraParams] = useState<ICameraParams>(() => {
    return (
      existingData?.cameraParams ?? {
        position: [0.5, 0.5, 4],
        quaternion: [0, 0, 0, 1],
        zoom: 1,
      }
    );
  });
  const [modelJSON, setModelJSON] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const model = await loadModel(router.query.key as any as string);
        setModelJSON(model.toJSON());
      } catch (err) {
        console.error(err);
        return {
          redirect: {
            destination: "/printing",
            permanent: false,
          },
        };
      }
    };

    load();
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // TODO: Remove this awful hack, 48px is two times the padding on either side
  const canvasSideLength = `min(calc(100vh - ${headerHeight}px), 100vw - 48px)`;

  // Really moans if you put the actual event type of MouseEvent<SVGSVGElement>
  const handlePopperClick = (event: MouseEvent<any>) => {
    if (event.currentTarget) {
      setAnchorEl(event.currentTarget);
      setPopperOpen((prevState) => !prevState);
    }
  };

  if (!modelJSON) {
    return <LinearProgress sx={{ width: "100vw" }} />;
  }

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
            uuid={uuid}
          />
        )}
        <Canvas
          resize={{
            debounce: 0,
            scroll: false,
          }}
          gl={{ preserveDrawingBuffer: true }}
          camera={{
            position: cameraParams.position as [
              x: number,
              y: number,
              z: number
            ],
            zoom: cameraParams.zoom,
            quaternion: cameraParams.quaternion as [
              x: number,
              y: number,
              z: number,
              w: number
            ],
            fov: 50,
          }}
          dpr={window.devicePixelRatio}
          shadows={true}
        >
          <CanvasScreenshotter ref={screenshotRef} />
          <OrbitControls />
          <ambientLight />
          <pointLight position={[10, 3, 10]} intensity={100} />
          <Model model={modelJSON} />
        </Canvas>
      </Box>
    </Container>
  );
}
