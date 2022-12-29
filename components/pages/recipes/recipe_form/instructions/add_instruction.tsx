import Button from "@mui/material/Button";
import { IInstruction } from "../../../../../store/reducers/food/recipes/types";
import AddIcon from "@mui/icons-material/Add";
import { v4 as uuidv4 } from "uuid";
import { ComponentsFormData } from "../component_form_data";

export interface IAddInstructionButtonProps {
  setInstructions: React.Dispatch<
    React.SetStateAction<{ [key: string]: IInstruction }>
  >;
  componentId: string;
  componentFormData: ComponentsFormData;
}

export const AddInstructionButton = (props: IAddInstructionButtonProps) => {
  const addNewInstruction = () =>
    props.setInstructions((prevInstructions) => {
      const newInstructions = { ...prevInstructions };
      newInstructions[uuidv4()] = { text: "" };
      props.componentFormData.updateInstructions(
        props.componentId,
        Object.values(newInstructions)
      );
      return newInstructions;
    });

  return (
    <Button
      className="center p8"
      onClick={addNewInstruction}
      startIcon={<AddIcon />}
    >
      Add instruction
    </Button>
  );
};
