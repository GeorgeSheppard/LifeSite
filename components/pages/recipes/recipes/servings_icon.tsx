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
          paddingRight: 6.5,
        }}
      >
        <Typography>{props.servings}</Typography>
        <PersonIcon sx={{ paddingRight: 0.5 }} />
      </div>
    </Tooltip>
  );
};