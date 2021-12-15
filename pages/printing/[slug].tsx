import Container from "@mui/material/Container";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useRouter } from "next/router";
import Box from "@mui/material/Box";
import { headerHeight } from "../../components/header";

export default function DisplayModel() {
  const router = useRouter();

  const slug = router.query.slug;

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
