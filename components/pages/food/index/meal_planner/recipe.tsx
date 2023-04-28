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
      style={{
        display: "flex",
        justifyContent: "space-between",
        paddingBottom: 8,
        flexDirection: "column",
      }}
    >
      <Typography variant="subtitle1" style={{ marginTop: 8, marginBottom: 12 }}>
        {recipe.name}
      </Typography>
      {componentProperties.map(({ name, servings, componentId }) => {
        return (
          <div
            key={componentId}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 12,
              flexDirection: "row",
              width: "100%"
            }}
          >
            <Typography variant="body2" style={{ marginLeft: 20 }}>{name}</Typography>
            <div style={{ display: "flex" }}>
              <ServingsIcon servings={servings} />
              <ButtonGroup variant="outlined" sx={{ height: 25 }}>
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
                sx={{ margin: "auto", marginLeft: "10px" }}
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
              />
              </div>
          </div>
        );
      })}
    </div>
  );
};
