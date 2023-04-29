import Typography from "@mui/material/Typography";
import { useRecipe } from "../../../../../core/dynamo/hooks/use_dynamo_get";
import { usePutMealPlanToDynamo } from "../../../../../core/dynamo/hooks/use_dynamo_put";
import {
  DateString,
  IComponentItem,
} from "../../../../../core/types/meal_plan";
import { RecipeUuid } from "../../../../../core/types/recipes";
import ButtonGroup from "@mui/material/ButtonGroup";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import { ServingsIcon } from "../recipes/card_components/servings_icon";

export const RecipeName = ({
  components,
  recipeId,
  day,
}: {
  components: IComponentItem[];
  recipeId: RecipeUuid;
  day: DateString;
}) => {
  const recipe = useRecipe(recipeId).data;
  const { mutate, disabled } = usePutMealPlanToDynamo();

  if (!recipe) {
    return null;
  }

  const componentProperties = components.map(({ componentId, servings }) => {
    const name =
      recipe.components.find(
        (recipeComponent) => recipeComponent.uuid === componentId
      )?.name ?? "";

    return {
      name,
      componentId,
      servings,
    };
  });

  return (
    <div
      className="flex place-content-between flex-col"
    >
      <Typography variant="subtitle1" color="#222222">
        {recipe.name}
      </Typography>
      <div className="space-y-1">
      {componentProperties.map(({ name, servings, componentId }) => {
        return (
          <div
            key={componentId}
            className="flex place-content-between w-full"
          >
            <Typography variant="subtitle2" className="ml-5 my-auto font-[500]" color="#717171">{name}</Typography>
            <div className="flex">
              <ServingsIcon servings={servings} />
              <ButtonGroup variant="outlined" className="my-auto h-6">
                <Button
                  onClick={(event) => {
                    event.stopPropagation();
                    mutate({
                      date: day,
                      components: [
                        {
                          recipeId,
                          componentId,
                          servingsIncrease: -1,
                        },
                      ],
                    });
                  }}
                  disabled={disabled}
                >
                  -
                </Button>
                <Button
                  onClick={(event) => {
                    event.stopPropagation();
                    mutate({
                      date: day,
                      components: [
                        {
                          recipeId,
                          componentId,
                          servingsIncrease: 1,
                        },
                      ],
                    });
                  }}
                  disabled={disabled}
                >
                  +
                </Button>
              </ButtonGroup>
              <DeleteIcon
                onClick={(event) => {
                  event.stopPropagation();
                  mutate({
                    date: day,
                    components: [
                      {
                        recipeId,
                        componentId,
                        servingsIncrease: -servings - 1,
                      },
                    ],
                  });
                }}
                fontSize="small"
                htmlColor="#7d2020"
                className="my-auto"
              />
              </div>
          </div>
        );
      })}
      </div>
        
    </div>
  );
};
