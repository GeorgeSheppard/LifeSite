import Container from "@mui/material/Container";
import { useRouter } from "next/router";
import Box from "@mui/material/Box";
import { headerHeight } from "../../components/header";
import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";

export default function DisplayModel() {
  const router = useRouter();

  // TODO: This breaks for some reason, it collects the file fine, but then the STLLoader crashes
  // const threemf = useLoader(STLLoader, "/Support_casques.stl");

  const slug = router.query.slug;
  const fileContent = JSON.stringify(router.query.file);
  console.log(fileContent);

  // TODO: Remove this awful hack
  const canvasSideLength = `calc(100vh - ${headerHeight}px)`;

  return (
    <Container maxWidth={false}>
      <Box
        component="div"
        sx={{
          height: canvasSideLength,
          width: canvasSideLength,
          margin: "auto",
        }}
      >
        <Canvas resize={{ debounce: 0, scroll: false }}>
          <OrbitControls enablePan={false} />
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          <mesh>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={"orange"} />
          </mesh>
        </Canvas>
      </Box>
    </Container>
  );
}
