import { useThree } from "@react-three/fiber";
import { forwardRef, Ref, useCallback, useImperativeHandle } from "react";

export interface ICanvasScreenshotter {}

export interface ICanvasScreenshotterRef {
  takeScreenshot(): string;
  getBlob(callback: BlobCallback): void;
}

export const CanvasScreenshotter = forwardRef(function CanvasScreenshot(
  props: ICanvasScreenshotter,
  ref: Ref<ICanvasScreenshotterRef>
) {
  const { gl } = useThree();

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
    }),
    [takeCanvasScreenshot, getCanvasBlob]
  );

  return null;
});
