import { useThree } from "@react-three/fiber";
import { forwardRef, Ref, useCallback, useImperativeHandle } from "react";
import { ICameraParams } from "../../../store/reducers/printing/types";

export interface ICanvasScreenshotterProps {}

export interface ICanvasScreenshotterRef {
  takeScreenshot(): string;
  getBlob(callback: BlobCallback): void;
  getCameraParams(): ICameraParams;
}

export const CanvasScreenshotter = forwardRef(function CanvasScreenshot(
  props: ICanvasScreenshotterProps,
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
          quaternion: camera.quaternion.toArray(),
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
