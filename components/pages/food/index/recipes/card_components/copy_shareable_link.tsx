import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { RecipeUuid } from "../../../../../../core/types/recipes";
import { useAppSession } from "../../../../../../core/hooks/use_app_session";
import ShareIcon from '@mui/icons-material/Share';
import { MouseEvent } from "react";

export interface ICopyIngredientsButtonProps {
  uuid: RecipeUuid;
}

export const CopyShareableLink = (props: ICopyIngredientsButtonProps) => {
  const session = useAppSession();

  const copyLink = (event: MouseEvent<HTMLButtonElement>) => {
    const baseUrl = process.env.NODE_ENV ==="development" ? "localhost:3000" : "lifesite.vercel.app"
    const url = new URL(`${baseUrl}/food`)
    url.searchParams.append('recipe', props.uuid);
    if (!session.id) throw new Error("Session loading");
    url.searchParams.append('user', session.id)
    navigator.clipboard.writeText(url.toString())
    event.stopPropagation();
  }

  return (
    <Tooltip title="Copy shareable link">
      <IconButton
        onClick={copyLink}
        size="small"
        disabled={session.loading}
      >
        <ShareIcon fontSize="small" htmlColor="#212121" />
      </IconButton>
    </Tooltip>
  );
};
