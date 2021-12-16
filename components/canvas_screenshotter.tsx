import { useThree } from "@react-three/fiber";
import { forwardRef, Ref, useCallback, useImperativeHandle } from "react";

export interface ICanvasScreenshotter {}

export interface ICanvasScreenshotterRef {
  takeScreenshot(): string;
}

export const CanvasScreenshotter = forwardRef(function CanvasScreenshot(
  props: ICanvasScreenshotter,
  ref: Ref<ICanvasScreenshotterRef>
) {
  const { gl } = useThree();

  const takeCanvasScreenshot = useCallback(() => {
    return gl.domElement.toDataURL();
  }, [gl]);

  useImperativeHandle(
    ref,
    () => ({
      takeScreenshot: takeCanvasScreenshot,
    }),
    [takeCanvasScreenshot]
  );

  return null;
});
