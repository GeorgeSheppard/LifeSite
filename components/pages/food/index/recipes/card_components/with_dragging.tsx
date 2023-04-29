import { useDrag } from "react-dnd";
import { useIsMobileLayout } from "../../../../../hooks/is_mobile_layout";
import { RecipeUuid } from "../../../../../../core/types/recipes";

export type WithDraggingProps = React.PropsWithChildren<{
  uuid: RecipeUuid;
}>;

export const WithDragging = ({ uuid, children }: WithDraggingProps) => {
  const mobileLayout = useIsMobileLayout();
  const [{ isDragging }, drag, preview] = useDrag(() => ({
    type: "recipe",
    item: { uuid },
    collect: (monitor) => {
      return {
        isDragging: !!monitor.isDragging(),
      };
    },
    canDrag: () => !mobileLayout,
  }));

  return (
    <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }}>
      {/* Remove the drag preview */}
      <div ref={preview} style={{ width: 0, height: 0 }} />
      {children}
    </div>
  );
};
