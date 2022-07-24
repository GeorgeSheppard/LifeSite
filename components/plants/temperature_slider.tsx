import Slider from "@mui/material/Slider";
import { useCallback } from "react";
import { TemperatureRange } from "../../store/reducers/plants/types";

export interface ITemperatureSliderProps {
  temperatureRange: TemperatureRange;
  setTemperatureRange: (range: TemperatureRange) => void;
}

export const TemperatureSlider = (props: ITemperatureSliderProps) => {
  const { setTemperatureRange } = props;

  const handleSliderChange = useCallback(
    (event: Event, newValue: number | number[]) => {
      setTemperatureRange(newValue as TemperatureRange);
    },
    [setTemperatureRange]
  );

  return (
    <Slider
      key="TemperatureSlider"
      value={props.temperatureRange}
      onChange={handleSliderChange}
      valueLabelDisplay="auto"
      getAriaValueText={(value: number) => `${value}°C`}
      min={0}
      max={35}
      marks={[
        { label: "0°C", value: 0 },
        { label: "25°C", value: 25 },
        { label: "35°C", value: 35 },
      ]}
    />
  );
};
