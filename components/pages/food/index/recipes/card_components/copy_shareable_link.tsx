import IconButton from "@mui/material/IconButton";
import { IRecipe } from "../../../../../../core/types/recipes";
import { useAppSession } from "../../../../../../core/hooks/use_app_session";
import ShareIcon from "@mui/icons-material/Share";
import { useTemporaryState } from "../../../../../../core/hooks/use_temporary_state";
import Tooltip from "@mui/material/Tooltip";
import { trpc } from "../../../../../../client";

export interface ICopyIngredientsButtonProps {
  recipe: IRecipe;
}

export const CopyShareableLink = ({ recipe }: ICopyIngredientsButtonProps) => {
  const session = useAppSession();
  const createSharedRecipe = trpc.recipes.createSharedRecipe.useMutation()

  const copyLink = async () => {
    const id = await createSharedRecipe.mutateAsync({ recipe })
    const baseUrl = process.env.ENV_DOMAIN;
    const url = new URL(`${baseUrl}/food`);
    url.searchParams.append("share", id)
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
