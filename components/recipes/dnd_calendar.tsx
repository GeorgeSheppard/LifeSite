import Grid from "@mui/material/Grid";
import { useAppSelector } from "../../store/hooks/hooks";
import Tooltip from "@mui/material/Tooltip";
import DeleteIcon from "@mui/icons-material/Delete";
import { DroppableCard } from "./droppable_card";
import {
  Dispatch,
  MouseEvent,
  SetStateAction,
  useCallback,
  useState,
} from "react";
import { DateString } from "../../store/reducers/food/meal_plan/types";

export interface ICalendarRowProps {
  selected: Set<DateString>;
  setSelected: Dispatch<SetStateAction<Set<DateString>>>;
}

export const Planner = (props: ICalendarRowProps) => {
  const { setSelected, selected } = props;
  const [lastSelected, setLastSelected] = useState<DateString | null>(null);
  const mealPlan = useAppSelector((store) => store.mealPlan.plan);

  // Toggles selection onClick
  const onClick = useCallback(
    (day: DateString) => (event: MouseEvent<HTMLDivElement>) => {
      setSelected((prevSelected) => {
        const newSelection = new Set(prevSelected);
        if (event.shiftKey) {
          event.preventDefault();
          const dates = Object.keys(mealPlan);
          if (lastSelected) {
            const start = dates.indexOf(lastSelected);
            if (lastSelected !== day) {
              for (const date of dates.slice(start)) {
                newSelection.add(date);
                if (date === day) {
                  break;
                }
              }
            }
          }
        } else {
          if (newSelection.has(day)) {
            newSelection.delete(day);
          } else {
            newSelection.add(day);
          }
        }

        setLastSelected(day);
        return newSelection;
      });
    },
    [setSelected, lastSelected, mealPlan]
  );

  return (
    <Grid
      container
      direction="column"
      spacing={2}
      paddingLeft={2}
      paddingRight={2}
      marginTop={0}
      marginBottom={0}
      flexGrow={1}
    >
      {Object.entries(mealPlan).map(([day], index) => {
        return (
          // TODO: CSS selector instead of this fast hack
          <Grid
            item
            columns={1}
            key={day}
            style={{ paddingTop: index === 0 ? 0 : 16 }}
          >
            <DroppableCard
              day={day}
              selected={selected.has(day)}
              onClick={onClick}
            />
          </Grid>
        );
      })}
    </Grid>
  );
};
