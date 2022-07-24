import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import TextField from "@mui/material/TextField";
import { ChangeEvent, memo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { IInstruction } from "../../store/reducers/food/recipes/types";
import { CenteredComponent } from "../core/centered_component";
import { ComponentsFormData } from "./component_form_data";

export interface IInstructionInputListProps {
  componentFormData: ComponentsFormData;
  uuid: string;
}

export const InstructionInputList = memo(function InstructionList(
  props: IInstructionInputListProps
) {
  const [instructions, setInstructions] = useState(() => {
    const obj: { [key: string]: IInstruction } = {};
    for (const value of props.componentFormData.components[props.uuid]
      .instructions) {
      obj[uuidv4()] = value;
    }
    return obj;
  });

  return (
    <>
      {Object.entries(instructions).map(([uuid, instruction], index) => (
        <ListItem key={uuid} disablePadding>
          <ListItemText primary={`${index + 1}.`} sx={{ paddingRight: 1 }} />
          <TextField
            fullWidth
            value={instruction.text}
            id="instruction"
            variant="standard"
            margin="none"
            multiline
            onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
              setInstructions((prevInstructions) => {
                const newInstructions = { ...prevInstructions };
                newInstructions[uuid] = {
                  ...prevInstructions[uuid],
                  text: event.target.value,
                };
                props.componentFormData.updateInstructions(
                  props.uuid,
                  Object.values(newInstructions)
                );
                return newInstructions;
              });
            }}
            error={instruction.text.length === 0}
          />
          <IconButton
            onClick={() => {
              setInstructions((prevInstructions) => {
                const newInstructions = { ...prevInstructions };
                delete newInstructions[uuid];
                props.componentFormData.updateInstructions(
                  props.uuid,
                  Object.values(newInstructions)
                );
                return newInstructions;
              });
            }}
            size="small"
            sx={{ alignSelf: "center", ml: 2, width: "70px" }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </ListItem>
      ))}
      <CenteredComponent>
        <Button
          sx={{ mt: 3 }}
          onClick={() => {
            setInstructions((prevInstructions) => {
              const newInstructions = { ...prevInstructions };
              newInstructions[uuidv4()] = { text: "" };
              props.componentFormData.updateInstructions(
                props.uuid,
                Object.values(newInstructions)
              );
              return newInstructions;
            });
          }}
          startIcon={<AddIcon />}
        >
          Add instruction
        </Button>
      </CenteredComponent>
    </>
  );
});
