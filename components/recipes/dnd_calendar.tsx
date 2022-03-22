import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Typography } from "@mui/material";

export interface ICalendarRowProps {}

export const CalendarRow = (props: ICalendarRowProps) => {
  return (
    <Grid
      container
      direction="row"
      spacing={1}
      columns={{ xs: 2, sm: 2, md: 6, lg: 14, xl: 14 }}
      padding={3}
    >
      {[
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ].map((day) => {
        return (
          <Grid item columns={2} key={day}>
            <Card>
              <CardHeader title={day} />
              <CardContent>
                <div style={{ width: 100, height: 100 }}>Content</div>
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
};
