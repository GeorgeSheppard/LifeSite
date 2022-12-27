import TextField from "@mui/material/TextField";
import { ChangeEvent } from "react";
import { IInstruction } from "../../../../../store/reducers/food/recipes/types";
import { ComponentsFormData } from "../component_form_data";

export interface IEditInstructionTextFieldProps {
  setInstructions: React.Dispatch<
    React.SetStateAction<{ [key: string]: IInstruction }>
  >;
  componentId: string;
  instructionId: string;
  componentFormData: ComponentsFormData;
  instruction: IInstruction;
}

export const EditInstructionTextField = (
  props: IEditInstructionTextFieldProps
) => {
  const editInstruction = (event: ChangeEvent<HTMLTextAreaElement>) =>
    props.setInstructions((prevInstructions) => {
      const newInstructions = { ...prevInstructions };
      newInstructions[props.instructionId] = {
        ...prevInstructions[props.instructionId],
        text: event.target.value,
      };
      props.componentFormData.updateInstructions(
        props.componentId,
        Object.values(newInstructions)
      );
      return newInstructions;
    });

  return (
    <TextField
      fullWidth
      value={props.instruction.text}
      id="instruction"
      variant="standard"
      margin="none"
      multiline
      onChange={editInstruction}
      error={props.instruction.text.length === 0}
    />
  );
};
