import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { IInstruction } from "../../../../../store/reducers/food/recipes/types";
import { ComponentsFormData } from "../component_form_data";

export interface IDeleteInstructionButtonProps {
  setInstructions: React.Dispatch<
    React.SetStateAction<{ [key: string]: IInstruction }>
  >;
  componentId: string;
  instructionId: string;
  componentFormData: ComponentsFormData;
}

export const DeleteInstructionButton = (
  props: IDeleteInstructionButtonProps
) => {
  const deleteInstruction = () =>
    props.setInstructions((prevInstructions) => {
      const newInstructions = { ...prevInstructions };
      delete newInstructions[props.instructionId];
      props.componentFormData.updateInstructions(
        props.componentId,
        Object.values(newInstructions)
      );
      return newInstructions;
    });

  return (
    <IconButton
      onClick={deleteInstruction}
      size="small"
      sx={{ alignSelf: "center", ml: 2, width: "70px" }}
    >
      <CloseIcon fontSize="small" />
    </IconButton>
  );
};
