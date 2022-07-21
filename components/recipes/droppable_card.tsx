import ButtonGroup from "@mui/material/ButtonGroup";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import { addOrUpdatePlan } from "../../store/reducers/food/meal_plan/meal_plan";
import PersonIcon from "@mui/icons-material/Person";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import { useAppDispatch, useAppSelector } from "../../store/hooks/hooks";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import { MouseEvent, useCallback } from "react";
import { useDrop } from "react-dnd";
import {
  DateString,
  IComponentItem,
} from "../../store/reducers/food/meal_plan/types";
import { RecipeUuid } from "../../store/reducers/food/recipes/types";

export const DroppableCard = (props: {
  day: DateString;
  selected: boolean;
  onClick: (day: DateString) => (event: MouseEvent<HTMLDivElement>) => void;
}) => {
  const { day, selected, onClick } = props;
  const meals = useAppSelector((store) => store.mealPlan.plan[day]);
  const recipes = useAppSelector((store) => store.food.recipes);
  const dispatch = useAppDispatch();

  const toggleOnClick = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      onClick(day)(event);
    },
    [onClick, day]
  );

  const [collected, drop] = useDrop(
    () => ({
      accept: "recipe",
      drop: (item: { uuid: RecipeUuid }) => {
        dispatch(
          addOrUpdatePlan({
            date: day,
            components: recipes[item.uuid].components.map((component) => ({
              recipeId: item.uuid,
              componentId: component.uuid,
              servingsIncrease: component.servings ?? 1,
            })),
          })
        );
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }),
    [day]
  );

  let className = "card";
  if (collected.isOver || selected) {
    className += " hoveredBorder";
  }

  return (
    <Card className={className} ref={drop} onClick={toggleOnClick}>
      <CardHeader title={day} className="noSelect" />
      <div
        style={{
          minHeight: 30,
          width: 300,
          flexGrow: 1,
          marginLeft: 16,
          marginRight: 16,
        }}
      >
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
  const dispatch = useAppDispatch();
  const recipe = useAppSelector((store) => {
    return store.food.recipes[recipeId];
  });

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
        paddingBottom: 10,
        flexDirection: "column",
      }}
    >
      <p style={{ marginTop: 10, marginBottom: 10 }}>{recipe.name}</p>
      {componentProperties.map(({ name, servings, componentId }) => {
        return (
          <div
            key={componentId}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <p style={{ marginLeft: 20 }}>{name}</p>
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
                    dispatch(
                      addOrUpdatePlan({
                        date: day,
                        components: [
                          {
                            recipeId,
                            componentId,
                            servingsIncrease: -1,
                          },
                        ],
                      })
                    );
                  }}
                >
                  -
                </Button>
                <Button
                  onClick={(event) => {
                    event.stopPropagation();
                    dispatch(
                      addOrUpdatePlan({
                        date: day,
                        components: [
                          {
                            recipeId,
                            componentId,
                            servingsIncrease: 1,
                          },
                        ],
                      })
                    );
                  }}
                >
                  +
                </Button>
              </ButtonGroup>
              <DeleteIcon
                onClick={(event) => {
                  event.stopPropagation();
                  dispatch(
                    addOrUpdatePlan({
                      date: day,
                      components: [
                        {
                          recipeId,
                          componentId,
                          servingsIncrease: -servings,
                        },
                      ],
                    })
                  );
                }}
                fontSize="small"
                htmlColor="#7d2020"
                sx={{ ml: 2 }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
