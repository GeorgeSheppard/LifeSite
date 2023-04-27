import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { MouseEventHandler } from "react";
import { useBoolean } from "../../core/hooks/use_boolean";

export interface IDialogProps {
  title: string;
  content: string;
  confirmMessage: string;
  cancelMessage: string;
  confirmOnClick: MouseEventHandler<HTMLButtonElement>;
  children: (open: () => void) => JSX.Element;
  confirmDisabled?: boolean;
}

export const CustomDialog = (props: IDialogProps) => {
  const [dialogOpen, setters] = useBoolean(false);

  return (
    <>
      <Dialog open={dialogOpen} onClose={setters.turnOff}>
        <DialogTitle>{props.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{props.content}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={setters.turnOff}>{props.cancelMessage}</Button>
          <Button onClick={props.confirmOnClick} disabled={props.confirmDisabled} autoFocus color="error">
            {props.confirmMessage}
          </Button>
        </DialogActions>
      </Dialog>
      {props.children(setters.turnOn)}
    </>
  );
};
