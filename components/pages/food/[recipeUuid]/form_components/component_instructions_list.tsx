import { UseFormReturn, useFieldArray } from "react-hook-form";
import { IRecipe } from "../../../../../core/types/recipes";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";

export const getDefaultInstruction = () => ({
  text: "",
});

export const InstructionsList = ({
  form,
  index,
}: {
  form: UseFormReturn<IRecipe>;
  index: number;
}) => {
  const { control, register } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: `components.${index}.instructions`,
  });

  return (
    <>
      {fields.map((field, instructionIndex) => {
        return (
          <ListItem key={field.id} disablePadding>
            <ListItemText
              primary={`${instructionIndex + 1}.`}
              sx={{ paddingRight: 1 }}
            />
            <TextField
              fullWidth
              variant="standard"
              margin="none"
              multiline
              {...register(
                `components.${index}.instructions.${instructionIndex}.text`
              )}
            />
            <IconButton
              onClick={() => remove(instructionIndex)}
              size="small"
              sx={{ alignSelf: "center", ml: 2, width: "70px" }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </ListItem>
        );
      })}
      <Button
        className="center p8"
        onClick={() => append(getDefaultInstruction())}
        startIcon={<AddIcon />}
      >
        Add instruction
      </Button>
    </>
  );
};
