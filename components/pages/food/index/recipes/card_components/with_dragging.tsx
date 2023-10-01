import { useDrag } from "react-dnd";
import { useIsMobileLayout } from "../../../../../hooks/is_mobile_layout";
import { RecipeUuid } from "../../../../../../core/types/recipes";
import { useRecipe } from "../../../../../../core/dynamo/hooks/use_dynamo_get";

export type WithDraggingProps = React.PropsWithChildren<{
  uuid: RecipeUuid;
}>;


export const WithDragging = ({ uuid, children }: WithDraggingProps) => {
  const mobileLayout = useIsMobileLayout();
  const recipe = useRecipe(uuid);
  const [{ isDragging }, drag, preview] = useDrag(() => ({
    type: "recipe",
    item: recipe.data?.components.map((component) => ({
      recipeId: uuid,
      componentId: component.uuid,
      servingsIncrease: component.servings ?? 1,
    })) ?? [],
    collect: (monitor) => {
      return {
        isDragging: !!monitor.isDragging(),
      };
    },
    canDrag: () => !mobileLayout && !!recipe.data,
  }));

  return (
    <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }}>
      {/* Remove the drag preview */}
      <div ref={preview} style={{ width: 0, height: 0 }} />
      {children}
    </div>
  );
};
