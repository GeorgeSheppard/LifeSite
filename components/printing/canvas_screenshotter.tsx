import { useThree } from "@react-three/fiber";
import { forwardRef, Ref, useCallback, useImperativeHandle } from "react";

export interface ICanvasScreenshotter {}

export interface ICanvasScreenshotterRef {
  takeScreenshot(): string;
  getBlob(callback: BlobCallback): void;
  getCameraParams(): ICameraParams;
}

export interface ICameraParams {
  zoom: number;
  position: [x: number, y: number, z: number];
  quaternion: [x: number, y: number, z: number, w: number];
}

export const CanvasScreenshotter = forwardRef(function CanvasScreenshot(
  props: ICanvasScreenshotter,
  ref: Ref<ICanvasScreenshotterRef>
) {
  const { gl, camera } = useThree();

  const takeCanvasScreenshot = useCallback(() => {
    return gl.domElement.toDataURL();
  }, [gl]);

  const getCanvasBlob = useCallback(
    (callback: BlobCallback) => {
      gl.domElement.toBlob(callback);
    },
    [gl]
  );

  useImperativeHandle(
    ref,
    () => ({
      takeScreenshot: takeCanvasScreenshot,
      getBlob: (callback: BlobCallback) => getCanvasBlob(callback),
      getCameraParams: (): ICameraParams => {
        return {
          zoom: camera.zoom,
          position: camera.position.toArray(),
          quaternion: camera.quaternion.toArray() as [
            x: number,
            y: number,
            z: number,
            w: number
          ],
        };
      },
    }),
    [
      takeCanvasScreenshot,
      getCanvasBlob,
      camera.position,
      camera.quaternion,
      camera.zoom,
    ]
  );

  return null;
});
