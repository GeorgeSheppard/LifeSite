import { useAppSelector } from "../../store/hooks/hooks";
import { useState, useRef, useLayoutEffect, useEffect } from "react";
import { Vector3, BufferGeometry, Group, Loader, Mesh } from "three";
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

  const [mesh, setMesh] = useState(() => (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
    </mesh>
  ));

  const { pathToFile } = props;

  useEffect(() => {
    const load = async () => {
      if (pathToFile) {
        const extension = pathToFile.split(".").pop();
        if (extension) {
          const loader = modelLoader.getLoader(extension);
          const geometry: BufferGeometry = await loader.loadAsync(pathToFile);
          geometry.center();
          geometry.computeBoundingSphere();
          const boundingSphere = geometry.boundingSphere;
          const reductionScale = 1 / (boundingSphere?.radius ?? 1);

          geometry.scale(reductionScale, reductionScale, reductionScale);
          setMesh(
            <mesh position={[0, 0, 0]} scale={[1, 1, 1]} ref={ref}>
              <primitive object={geometry} attach="geometry" />
              <meshStandardMaterial color={"orange"} />
            </mesh>
          );
        }
      }
    };
    load();
  }, [pathToFile]);

  return <group position={[0, 0, 0]}>{mesh}</group>;
}
