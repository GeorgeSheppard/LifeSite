import IconButton from "@mui/material/IconButton";
import { RecipeUuid } from "../../../../../../core/types/recipes";
import { useAppSession } from "../../../../../../core/hooks/use_app_session";
import ShareIcon from "@mui/icons-material/Share";
import { useTemporaryState } from "../../../../../../core/hooks/use_temporary_state";
import Tooltip from "@mui/material/Tooltip";

export interface ICopyIngredientsButtonProps {
  uuid: RecipeUuid;
}

export const CopyShareableLink = (props: ICopyIngredientsButtonProps) => {
  const session = useAppSession();

  const copyLink = () => {
    const baseUrl = process.env.ENV_DOMAIN;
    const url = new URL(`${baseUrl}/food`);
    url.searchParams.append("recipe", props.uuid);
    if (!session.id) throw new Error("Session loading");
    url.searchParams.append("user", session.id);
    navigator.clipboard.writeText(url.toString());
  };

  const [tooltip, iconOnClick] = useTemporaryState(
    "Copy shareable link",
    "Copied!"
  );

  return (
    <Tooltip title={tooltip}>
      <IconButton
        onClick={() => {
          copyLink();
          iconOnClick();
        }}
        size="small"
        disabled={session.loading || !session.id}
        disableRipple
      >
        <ShareIcon fontSize="small" htmlColor="#212121" />
      </IconButton>
    </Tooltip>
  );
};
