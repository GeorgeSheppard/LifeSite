import { useAppSelector } from "../../store/hooks/hooks";
import { useState, useRef, useLayoutEffect, useEffect } from "react";
import {
  Vector3,
  BufferGeometry,
  Group,
  Loader,
  Mesh,
  Material,
  MeshBasicMaterial,
  Box3,
  Sphere,
} from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import { ThreeMFLoader } from "three/examples/jsm/loaders/3MFLoader";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { useFrame, useLoader, useThree } from "@react-three/fiber";

export interface IModelProps {
  pathToFile?: string;
}

interface IModelLoader extends Loader {
  load: (path: string, callback: (geo: Group | BufferGeometry) => void) => void;
}

/**
 * Dynamically load model loaders in
 */
export class Loaders {
  private formatToLoader: { [index: string]: any } = {
    stl: STLLoader,
    "3mf": ThreeMFLoader,
    obj: OBJLoader,
  };

  private loaders: { [index: string]: IModelLoader } = {};

  public getLoader(extension: string): IModelLoader {
    let loader = this.loaders[extension];
    if (loader) {
      return loader;
    } else {
      loader = new this.formatToLoader[extension]();
      this.loaders[extension] = loader;
      return loader;
    }
  }
}

const modelLoader = new Loaders();

export default function Model(props: IModelProps) {
  const ref = useRef<Mesh>();

  const scene = useThree((state) => state.scene);
  const [material, setMaterial] = useState(() => (
    <meshStandardMaterial color={"orange"} />
  ));

  const [mesh, setMesh] = useState<JSX.Element | null>(null);

  const { pathToFile } = props;

  useEffect(() => {
    const load = async () => {
      if (pathToFile) {
        const extension = pathToFile.split(".").pop();
        if (extension) {
          const loader = modelLoader.getLoader(extension);
          let object: BufferGeometry | Group = await loader.loadAsync(
            pathToFile
          );
          let geometry;

          /**
           * Different loaders return different objects so need to be handled separately (thanks ThreeJS)
           */
          if (object instanceof BufferGeometry) {
            geometry = object;
            geometry.center();

            // Normalise model to size 1
            geometry.computeBoundingSphere();
            const boundingSphere = geometry.boundingSphere;
            const radius = boundingSphere?.radius;
            // Note: To scale to full width of canvas use 2 / radius, want slightly smaller than that
            const reductionScale = radius ? 1.5 / radius : 1;
            geometry.scale(reductionScale, reductionScale, reductionScale);

            setMesh(<primitive object={geometry} attach="geometry" />);
          } else {
            const boundingBox = new Box3().setFromObject(object);

            // Calculate the scale to reduce the model to size 1
            const boundingSphere = new Sphere();
            boundingBox.getBoundingSphere(boundingSphere);
            const radius = boundingSphere?.radius;
            // Note: To scale to full width of canvas use 2 / radius, want slightly smaller than that
            const reductionScale = radius ? 1.5 / radius : 1;

            // Center the model, note the reduction scale as the subsequent scale scales
            // the position relative to the origin
            object = object.translateOnAxis(
              boundingBox
                .getCenter(new Vector3())
                .multiplyScalar(reductionScale),
              -1
            );

            // Reduce model to size 1
            object.scale.copy(
              new Vector3(reductionScale, reductionScale, reductionScale)
            );

            scene.clear();
            scene.add(object);
            setMesh(null);
          }
        }
      }
    };
    load();
  }, [pathToFile, scene]);

  return (
    <mesh position={[0, 0, 0]} scale={[1, 1, 1]} ref={ref}>
      {mesh}
      {material}
    </mesh>
  );
}
