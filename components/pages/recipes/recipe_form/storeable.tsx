import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Tooltip from "@mui/material/Tooltip";
import { IRecipeComponent } from "../../../../store/reducers/food/recipes/types";

export interface IStoreableCheckboxProps {
  component: IRecipeComponent;
  storeable: boolean;
  setState: (state: boolean) => void;
}

export const StoreableCheckbox = (props: IStoreableCheckboxProps) => {
  const setStoreable = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.component.storeable = event.target.checked;
    props.setState(event.target.checked);
  };

  return (
    <Tooltip title="Can it last in the cupboard, or freezer">
      <FormControlLabel
        control={
          <Checkbox
            checked={props.storeable}
            onChange={setStoreable}
            size="small"
          />
        }
        label="Storeable"
        sx={{ ml: 5 }}
      />
    </Tooltip>
  );
};
