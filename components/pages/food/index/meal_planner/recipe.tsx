import Typography from "@mui/material/Typography";
import { useRecipe } from "../../../../../core/dynamo/hooks/use_dynamo_get";
import { usePutMealPlanToDynamo } from "../../../../../core/dynamo/hooks/use_dynamo_put";
import {
  DateString,
  IComponentItem,
} from "../../../../../core/types/meal_plan";
import { RecipeUuid } from "../../../../../core/types/recipes";
import Tooltip from "@mui/material/Tooltip";
import PersonIcon from "@mui/icons-material/Person";
import ButtonGroup from "@mui/material/ButtonGroup";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";

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
      <Typography style={{ marginTop: 8, marginBottom: 12, fontSize: 18 }}>
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
            }}
          >
            <Typography style={{ marginLeft: 20 }}>{name}</Typography>
            <div style={{ display: "flex" }}>
              <Tooltip title={`${servings} serving`}>
                {/* div instead of fragment as tooltip doesn't work with fragment */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    paddingRight: 6.5,
                    marginLeft: 15,
                  }}
                >
                  <Typography>{servings}</Typography>
                  <PersonIcon sx={{ paddingRight: 0.5 }} />
                </div>
              </Tooltip>
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
