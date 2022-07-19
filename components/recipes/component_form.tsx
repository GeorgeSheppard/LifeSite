import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Checkbox from "@mui/material/Checkbox";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListSubheader from "@mui/material/ListSubheader";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import { ChangeEvent, MutableRefObject, useState } from "react";
import { stopPropagation } from "../cards/utilities";
import { useBoolean } from "../hooks/use_boolean";
import { ComponentsFormData } from "./component_form_data";
import { IngredientsInputTable } from "./ingredients_input_table";
import { InstructionInputList } from "./instructions_input_list";

export interface IComponentFormProps {
  uuid: string;
  componentFormData: ComponentsFormData;
  forceUpdate: () => void;
}

export const ComponentForm = (props: IComponentFormProps) => {
  const { componentFormData, uuid, forceUpdate } = props;

  const component = componentFormData.components[uuid];
  const [name, setName] = useState(component.name);
  const [storeable, setters] = useBoolean(component.storeable ?? false);
  const [servings, setServings] = useState(
    !!component.servings ? component.servings : 1
  );

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <TextField
          fullWidth
          value={name}
          label="Section name"
          id="name"
          variant="standard"
          margin="none"
          onClick={stopPropagation}
          onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
            component.name = event.target.value;
            setName(event.target.value);
          }}
        />
        <div style={{ flexGrow: 1 }} />
        <IconButton
          onClick={(event) => {
            event.stopPropagation();
            delete componentFormData.components[uuid];
            forceUpdate();
          }}
          size="small"
          sx={{ alignSelf: "center" }}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </AccordionSummary>
      <AccordionDetails>
        <Divider textAlign="center">Ingredients</Divider>
        <IngredientsInputTable
          componentFormData={componentFormData}
          uuid={uuid}
        />
        <Divider textAlign="center" sx={{ pt: 5, pb: 1 }}>
          Instructions
        </Divider>
        <InstructionInputList
          componentFormData={componentFormData}
          uuid={uuid}
        />
        <Divider textAlign="center" sx={{ pt: 5, pb: 1 }}>
          Optional
        </Divider>
        <FormControl sx={{ pt: 1, flexDirection: "row", alignItems: "end" }}>
          <TextField
            label="Servings"
            value={servings}
            id="instruction"
            variant="standard"
            type="number"
            margin="none"
            onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
              const newServings = parseInt(event.target.value, 10);
              const validServings = isNaN(newServings) ? 1 : newServings;
              component.servings = validServings;
              setServings(validServings);
            }}
            sx={{ width: "100px" }}
          />
          <Tooltip title="Can it last in the cupboard, or freezer">
            <FormControlLabel
              control={
                <Checkbox
                  checked={storeable}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    component.storeable = event.target.checked;
                    setters.setState(event.target.checked);
                  }}
                  size="small"
                />
              }
              label="Storeable"
              sx={{ ml: 5 }}
            />
          </Tooltip>
        </FormControl>
      </AccordionDetails>
    </Accordion>
  );
};
