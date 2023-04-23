import ButtonGroup from "@mui/material/ButtonGroup";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import PersonIcon from "@mui/icons-material/Person";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Dispatch,
  MouseEvent,
  SetStateAction,
  useCallback,
  useState,
} from "react";
import { useDrop } from "react-dnd";
import {
  DateString,
  IComponentItem,
} from "../../../../store/reducers/food/meal_plan/types";
import { RecipeUuid } from "../../../../store/reducers/food/recipes/types";
import {
  useMealPlan,
  useRecipe,
  useRecipes,
} from "../../../hooks/user_data/use_dynamo";
import { usePutMealPlanToDynamo } from "../../../hooks/user_data/use_dynamo_put";
import AddIcon from "@mui/icons-material/Add";
import { Dialog, DialogContent, List, ListItem, Skeleton } from "@mui/material";
import { useBoolean } from "../../../hooks/use_boolean";
import { useIsMobileLayout } from "../hooks/is_mobile_layout";

export const DroppableCard = (props: {
  day: DateString;
  selected: boolean;
  setSelected: Dispatch<SetStateAction<Set<DateString>>>;
  onClick: (day: DateString) => (event: MouseEvent<HTMLDivElement>) => void;
  loading: boolean;
}) => {
  const { day, selected, onClick, setSelected, loading } = props;
  const meals = useMealPlan().data[day];
  const recipes = useRecipes().data;
  const { mutate, disabled } = usePutMealPlanToDynamo();
  const [dialogOpen, setters] = useBoolean(false);

  const toggleOnClick = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      onClick(day)(event);
    },
    [onClick, day]
  );

  const addRecipeToMealPlan = (item: { uuid: RecipeUuid }) => {
    mutate({
      date: day,
      components:
        recipes
          ?.find((rec) => rec.uuid === item.uuid)
          ?.components.map((component) => ({
            recipeId: item.uuid,
            componentId: component.uuid,
            servingsIncrease: component.servings ?? 1,
          })) ?? [],
    });
    if (!selected) {
      setSelected((prevSelected) => {
        const newSelected = new Set(prevSelected);
        newSelected.add(day);
        return newSelected;
      });
    }
  };

  const [collected, drop] = useDrop(
    () => ({
      accept: "recipe",
      drop: addRecipeToMealPlan,
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
      canDrop: () => !disabled && !loading,
    }),
    [day, recipes, setSelected]
  );

  const mobileLayout = useIsMobileLayout();
  const dayWithoutYear = day.slice(0, day.length - 5);

  return (
    <>
      <Dialog open={dialogOpen} onClose={setters.turnOff}>
        <DialogContent>
          {recipes?.length === 0 ? (
            <Typography>No recipes available</Typography>
          ) : (
            <List>
              {recipes?.map((recipe) => {
                return (
                  <ListItem key={recipe.uuid}>
                    <Button
                      onClick={() => {
                        addRecipeToMealPlan({ uuid: recipe.uuid });
                        setters.turnOff();
                      }}
                      disabled={disabled}
                    >
                      {recipe.name}
                    </Button>
                  </ListItem>
                );
              })}
            </List>
          )}
        </DialogContent>
      </Dialog>
      {/* Would like to use a class here for the hovered border but ran into this
      https://github.com/mui/material-ui/issues/25324 */}
      <Card
        className="card"
        ref={drop}
        onClick={toggleOnClick}
        sx={{
          boxShadow:
            collected.isOver || selected
              ? "0 0 0 3px rgba(32, 125, 57, 0.3)"
              : undefined,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "8px 16px",
          }}
        >
          <CardHeader
            title={dayWithoutYear}
            className="noSelect"
            sx={{ padding: 0 }}
          />
          {mobileLayout && (
            <Button
              variant="contained"
              startIcon={<AddIcon fontSize="large" />}
              onClick={(event) => {
                event.stopPropagation();
                setters.turnOn();
              }}
              disabled={loading}
            >
              Add
            </Button>
          )}
        </div>
        <div
          style={{
            minHeight: 30,
            width: 270,
            flexGrow: 1,
            marginLeft: 16,
            marginRight: 16,
          }}
        >
          {loading && <LoadingMealComponents />}
          {meals &&
            Object.entries(meals).map(([recipeId, components]) => (
              <RecipeName
                key={recipeId}
                components={components}
                recipeId={recipeId}
                day={day}
              />
            ))}
        </div>
      </Card>
    </>
  );
};

function weightedRandom(min: number, max: number) {
  return Math.round(max / (Math.random() * max + min));
}

const LoadingMealComponents = () => {
  const [numComponents, _] = useState(weightedRandom(1, 3));

  return (
    <>
      {Array.from(Array(numComponents).keys()).map((num) => (
        <div style={{ marginBottom: 16 }} key={num}>
          <Skeleton
            variant="text"
            sx={{
              fontSize: 12,
              width: 120,
              marginLeft: 0,
              marginTop: 1,
            }}
          />
          <LoadingComponentLines />
        </div>
      ))}
    </>
  );
};

const LoadingComponentLines = () => {
  const [numLines, _] = useState(weightedRandom(1, 5));

  return (
    <>
      {Array.from(Array(numLines).keys()).map((num) => (
        <Skeleton
          key={num}
          variant="text"
          sx={{
            fontSize: 12,
            width: 250,
            marginLeft: 2,
            marginTop: 1,
          }}
        />
      ))}
    </>
  );
};

const RecipeName = ({
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
