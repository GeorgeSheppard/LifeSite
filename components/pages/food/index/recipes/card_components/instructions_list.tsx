import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { IInstruction } from "../../../../../../core/types/recipes";

export interface IInstructionsListProps {
  instructions: IInstruction[];
}

export const InstructionsList = (props: IInstructionsListProps) => {
  return (
    <>
      {props.instructions.length > 0 && (
        <ListItem key="method" sx={{ pb: 2, pl: 1, pt: 5 }}>
          <ListItemText
            primary="Method"
            primaryTypographyProps={{ variant: "subtitle2" }}
          />
        </ListItem>
      )}
      {props.instructions.map(({ text, optional }, index) => {
        let visibleText = `${index + 1}. `;
        if (optional) {
          visibleText += "(Optional) ";
        }
        visibleText += text;
        return (
          <ListItem key={text} sx={{ p: 0, pl: 3 }}>
            <ListItemText primary={visibleText} primaryTypographyProps={{ variant: "body2"}} />
          </ListItem>
        );
      })}
    </>
  );
};
