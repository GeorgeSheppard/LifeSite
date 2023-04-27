import Grid from "@mui/material/Grid";
import { DroppableCard } from "./meal_drop_card";
import {
  Dispatch,
  MouseEvent,
  SetStateAction,
  useCallback,
  useState,
} from "react";
import { DateString } from "../../../../store/reducers/food/meal_plan/types";
import { useMealPlan } from "../../../hooks/user_data/use_dynamo";

export interface ICalendarRowProps {
  selected: Set<DateString>;
  setSelected: Dispatch<SetStateAction<Set<DateString>>>;
}

export const Planner = (props: ICalendarRowProps) => {
  const { setSelected, selected } = props;
  const [lastSelected, setLastSelected] = useState<DateString | null>(null);
  const mealPlan = useMealPlan();

  // Toggles selection onClick
  const onClick = useCallback(
    (day: DateString) => (event: MouseEvent<HTMLDivElement>) => {
      setSelected((prevSelected) => {
        const newSelection = new Set(prevSelected);
        if (event.shiftKey) {
          event.preventDefault();
          const dates = Object.keys(mealPlan.data);
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
      marginTop={0}
      marginBottom={0}
      px={0}
      flexGrow={1}
    >
      {Object.entries(mealPlan.data).map(([day], index) => {
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
              setSelected={setSelected}
              onClick={onClick}
              loading={mealPlan.isFetching || mealPlan.isPlaceholderData}
            />
          </Grid>
        );
      })}
    </Grid>
  );
};
