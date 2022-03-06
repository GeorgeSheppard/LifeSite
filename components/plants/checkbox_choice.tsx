import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Tooltip from "@mui/material/Tooltip";
import Icon from "@mui/material/Icon";
import Image from "next/image";
import { Checkboxes } from "../../store/reducers/types";
import { CSSProperties } from "react";

export interface ICheckboxChoiceProps {
  currentChecked: string;
  checkboxes: Checkboxes;
  setCurrentChecked: (key: string) => void;
  style?: CSSProperties | undefined;
}

export const CheckboxChoice = (props: ICheckboxChoiceProps) => {
  return (
    <div key="Checkboxes" style={props.style}>
      {Object.entries(props.checkboxes).map(
        ([key, data]: [string, { tooltip: string; icon: any }]) => {
          return (
            <FormControlLabel
              key={data.tooltip}
              value="top"
              control={<Checkbox checked={key === props.currentChecked} />}
              label={
                <Tooltip title={data.tooltip}>
                  <Icon>
                    <Image
                      src={data.icon.src}
                      width={data.icon.width}
                      height={data.icon.height}
                      alt="watering level"
                    />
                  </Icon>
                </Tooltip>
              }
              labelPlacement="top"
              // I would like to access the generic here, but I can't :(
              onClick={() => props.setCurrentChecked(key as any)}
            />
          );
        }
      )}
    </div>
  );
};
