import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import { ChangeEvent, MouseEvent } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { ComponentsFormData } from "./component_form_data";
import { IRecipeComponent } from "../../../../store/reducers/food/recipes/types";

export interface INameRowProps {
  componentFormData: ComponentsFormData;
  forceUpdate: () => void;
  component: IRecipeComponent;
  setName: React.Dispatch<React.SetStateAction<string>>;
  componentId: string;
  name: string;
}

export const NameRow = (props: INameRowProps) => {
  return (
    <>
      <TextField
        fullWidth
        value={props.name}
        label="Section name"
        id="name"
        variant="standard"
        margin="none"
        onClick={(event: MouseEvent<HTMLElement>) => {
          event.stopPropagation();
        }}
        onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
          props.component.name = event.target.value;
          props.setName(event.target.value);
        }}
      />
      <div style={{ flexGrow: 1 }} />
      <IconButton
        onClick={(event) => {
          event.stopPropagation();
          delete props.componentFormData.components[props.componentId];
          props.forceUpdate();
        }}
        size="small"
        sx={{ alignSelf: "center" }}
      >
        <DeleteIcon fontSize="small" />
      </IconButton>
    </>
  );
};
