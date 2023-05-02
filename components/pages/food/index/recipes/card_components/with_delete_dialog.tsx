import { useCallback } from "react";
import { useDeleteRecipeFromDynamo } from "../../../../../../core/dynamo/hooks/use_dynamo_delete";
import { RecipeUuid } from "../../../../../../core/types/recipes";
import { CustomDialog } from "../../../../../core/dialog";

export interface IRecipeCardWithDialogProps {
  uuid: RecipeUuid;
  children: (openDialog: () => void) => JSX.Element;
  onDelete?: (uuid: RecipeUuid) => void;
}

export const WithDeleteDialog = (
  props: IRecipeCardWithDialogProps
) => {
  const { uuid, onDelete } = props;
  const { mutate, disabled } = useDeleteRecipeFromDynamo();
  const deleteRecipeOnClick = useCallback(() => {
    onDelete?.(uuid);
    mutate(uuid)
  }, [onDelete, mutate, uuid]);

  return (
    <CustomDialog
      title="Delete this recipe?"
      content="Are you sure you want to delete this recipe? This may affect your
    meal plan and this action cannot be undone."
      confirmMessage="Yes I'm sure"
      cancelMessage="No, cancel"
      confirmOnClick={deleteRecipeOnClick}
      confirmDisabled={disabled}
    >
      {(openDialog) => props.children(openDialog)}
    </CustomDialog>
  );
};
