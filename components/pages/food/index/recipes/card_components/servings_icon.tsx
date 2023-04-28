import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import PersonIcon from "@mui/icons-material/Person";

export interface IServingsIconProps {
  servings: number;
}

export const ServingsIcon = (props: IServingsIconProps) => {
  return (
    <Tooltip title={`Serves ${props.servings}`}>
      {/* div instead of fragment as tooltip doesn't work with fragment */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <Typography variant="button" color="#212121">{props.servings}</Typography>
        <PersonIcon htmlColor="#212121" />
      </div>
    </Tooltip>
  );
};
