import CancelIcon from "@mui/icons-material/Cancel";
import SaveIcon from "@mui/icons-material/Save";
import { SxProps, Theme } from "@mui/material";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

export interface IExitSaveButtonsProps {
  exitOnClick: () => void;
  saveOnClick: () => void;
  saveDisabled: boolean;
  buttonSx: SxProps<Theme> | undefined;
  boxSx: SxProps<Theme> | undefined;
}

export const ExitSaveButtons = (props: IExitSaveButtonsProps) => {
  const { exitOnClick, saveOnClick, saveDisabled, buttonSx, boxSx } = props;

  return (
    <Box component="div" sx={boxSx}>
      <Button
        component="button"
        variant="outlined"
        startIcon={<CancelIcon />}
        sx={buttonSx}
        onClick={exitOnClick}
      >
        Exit
      </Button>
      <Button
        component="button"
        variant="contained"
        endIcon={<SaveIcon />}
        sx={buttonSx}
        onClick={saveOnClick}
        disabled={saveDisabled}
      >
        Save
      </Button>
    </Box>
  );
};
