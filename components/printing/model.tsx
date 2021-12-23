import { useThree } from "@react-three/fiber";
import { ObjectLoader } from "three";

export interface IModelProps {
  // Group is passed through props as json
  model: any;
}

export default function Model(props: IModelProps) {
  const scene = useThree((state) => state.scene);
  const loader = new ObjectLoader();
  const geometry = loader.parse(props.model);

  if (geometry) {
    scene.clear();
    scene.add(geometry);
  }
  return null;
}
