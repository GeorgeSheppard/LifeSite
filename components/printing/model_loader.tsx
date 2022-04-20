import {
  Vector3,
  BufferGeometry,
  Group,
  Loader,
  Box3,
  Sphere,
  Mesh,
  MeshBasicMaterial,
} from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import { ThreeMFLoader } from "three/examples/jsm/loaders/3MFLoader";
import { join } from "path";
import fs from "fs";
import { getS3SignedUrl } from "../aws/s3_utilities";
import { S3Key } from "../../store/reducers/types";

interface IModelLoader extends Loader {
  parse: (arrayBuffer: ArrayBuffer) => Group | BufferGeometry;
}

/**
 * Dynamically load model loaders in
 */
export class Loaders {
  private formatToLoader: { [index: string]: any } = {
    stl: STLLoader,
    // TODO: The code that currently exists for handling the 3MF Group return works fine
    // except when run as part of getServerSideProps (because it can't access DOMParser).
    // Perhaps a workaround would be to always load the models on client side first, and
    // instead of storing on the server in the native file format could just create a Group
    // (like the code that is working) and dump it as json. It is already passed as json
    // through the prop tree so wouldn't make any difference there.
    // "3mf": ThreeMFLoader,
  };

  private loaders: { [index: string]: IModelLoader } = {};

  public getLoader(extension: string): IModelLoader {
    if (extension in this.formatToLoader) {
      let loader = this.loaders[extension];
      if (loader) {
        return loader;
      } else {
        loader = new this.formatToLoader[extension]();
        this.loaders[extension] = loader;
        return loader;
      }
    } else {
      throw Error("No loader for filetype: " + extension);
    }
  }
}

const modelLoader = new Loaders();

export const loadModel = async (key: S3Key): Promise<Group> => {
  const extension = key.split(".").pop()?.toLowerCase();

  if (!extension) {
    throw Error("No extension");
  }

  const loader = modelLoader.getLoader(extension);
  const url = await getS3SignedUrl(key)
  const data = await fetch(url);

  // ThreeJs refuses to load the file itself, instead have to use the parse method
  // on it and give it the ArrayBuffer
  // https://stackoverflow.com/questions/8609289/convert-a-binary-nodejs-buffer-to-javascript-arraybuffer
  const buffer = Buffer.from(new Uint8Array(await data.arrayBuffer()));
  const arrayBuffer = buffer.buffer.slice(
    buffer.byteOffset,
    buffer.byteOffset + buffer.byteLength
  );

  let object: Group | BufferGeometry = await loader.parse(arrayBuffer);

  let geometry;
  const material = new MeshBasicMaterial({ color: 0x207d39 });

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
    const mesh = new Mesh(geometry, material);
    const wireframeMaterial = new MeshBasicMaterial( { color: 0x000000, wireframe: true, transparent: true } );
    mesh.add(new Mesh(geometry, wireframeMaterial))
    const group = new Group();
    group.add(mesh);
    return group;
  } else {
    // // Custom 3MFs can cause a resource error so no geometry is loaded
    if (!object.getObjectByProperty("type", "Mesh")) {
      throw Error("No geometry");
    }

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
      boundingBox.getCenter(new Vector3()).multiplyScalar(reductionScale),
      -1
    );

    // Reduce model to size 1
    object.scale.copy(
      new Vector3(reductionScale, reductionScale, reductionScale)
    );
    return object;
  }
};
