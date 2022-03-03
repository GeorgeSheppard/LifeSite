import { IRecipe, RecipeUuid } from "../../store/reducers/food/recipes";
import { useAppSelector } from "../../store/hooks/hooks";

export interface IRecipeCardProps {
  uuid: RecipeUuid;
}

export const RecipeCard = (props: IRecipeCardProps) => {
  const recipe = useAppSelector((store) => store.recipes.recipes[props.uuid]);
  console.log(recipe);
  return <div></div>;
};
