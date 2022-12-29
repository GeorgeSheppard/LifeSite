import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { memo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { IInstruction } from "../../../../../store/reducers/food/recipes/types";
import { ComponentsFormData } from "../component_form_data";
import { AddInstructionButton } from "./add_instruction";
import { DeleteInstructionButton } from "./delete_instruction";
import { EditInstructionTextField } from "./edit_instruction";

export interface IInstructionInputListProps {
  componentFormData: ComponentsFormData;
  componentId: string;
}

export const InstructionInputList = memo(function InstructionList(
  props: IInstructionInputListProps
) {
  const [instructions, setInstructions] = useState(() => {
    const obj: { [key: string]: IInstruction } = {};
    for (const value of props.componentFormData.components[props.componentId]
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
          <EditInstructionTextField
            setInstructions={setInstructions}
            instruction={instruction}
            componentId={props.componentId}
            instructionId={uuid}
            componentFormData={props.componentFormData}
          />
          <DeleteInstructionButton
            setInstructions={setInstructions}
            componentFormData={props.componentFormData}
            componentId={props.componentId}
            instructionId={uuid}
          />
        </ListItem>
      ))}
      <AddInstructionButton
        setInstructions={setInstructions}
        componentFormData={props.componentFormData}
        componentId={props.componentId}
      />
    </>
  );
});
