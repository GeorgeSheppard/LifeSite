import { IInstruction } from "../../../../../../core/types/recipes";
import Typography from "@mui/material/Typography";

export interface IInstructionsListProps {
  instructions: IInstruction[];
}

export const InstructionsList = (props: IInstructionsListProps) => {
  return (
    <div>
      {props.instructions.length > 0 && (
        <Typography variant="body2" fontSize={12} fontWeight={600}>
          Instructions
        </Typography>
      )}
      <div className="ml-4 space-y-1">
        {props.instructions.map(({ text, optional }, index) => {
          let visibleText = `${index + 1}. `;
          if (optional) {
            visibleText += "(Optional) ";
          }
          visibleText += text;
          return (
            <Typography key={text} variant="body2" fontSize={12}>
              {visibleText}
            </Typography>
          );
        })}
      </div>
    </div>
  );
};
