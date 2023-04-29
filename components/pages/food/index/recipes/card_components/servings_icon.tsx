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
      <div className="flex my-auto">
        <Typography variant="button" color="#212121">
          {props.servings}
        </Typography>
        <PersonIcon
          fontSize="small"
          htmlColor="#212121"
          className="block my-auto"
        />
      </div>
    </Tooltip>
  );
};
