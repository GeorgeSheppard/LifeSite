import { useRouter } from "next/router";
import { IRecipe } from "../../../../core/types/recipes";
import { useState, MouseEvent } from "react";
import { useForm } from "react-hook-form";
import { FormRecipeName } from "./form_components/recipe_name";
import { FormDescription } from "./form_components/description";
import { UploadDisplayImages } from "../../../core/cards/upload_and_display_images";
import { usePutRecipeToDynamo } from "../../../../core/dynamo/hooks/use_dynamo_put";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import Alert from "@mui/material/Alert";
import { ComponentAccordions } from "./form_components/component_accordion";
import { ExitSaveButtons } from "../../../core/exit_save_buttons";
import { DeleteFromS3 } from "../../../../core/s3/s3_utilities";

export const FormWithData = ({ recipe }: { recipe: IRecipe }) => {
  const router = useRouter();
  const { mutateAsync, disabled } = usePutRecipeToDynamo();
  const form = useForm<IRecipe>({
    defaultValues: recipe,
  });
  const {
    handleSubmit,
    formState: { errors },
  } = form;
  const [images, setImages] = useState(recipe.images);

  const onSubmit = async (data: IRecipe) => {
    data.images = images;
    // If the user has deleted any images we delete them on submit
    await Promise.all(
      recipe.images
        .filter(
          (image) => images.findIndex((img) => img.key === image.key) === -1
        )
        .map(async (image) => await DeleteFromS3(image.key))
    );
    await mutateAsync({ recipe: data });
    router.push("/food");
  };

  return (
    <Container maxWidth="lg" sx={{ pt: 3, pb: 3 }}>
      <Card
        sx={{ padding: 4 }}
        onClick={(event: MouseEvent<HTMLDivElement>) => {
          event.stopPropagation();
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormRecipeName form={form} />
          <FormDescription form={form} />
          <UploadDisplayImages images={images} setImages={setImages} />
          {errors?.components?.root && (
            <Alert severity="error">{errors?.components.root.message}</Alert>
          )}
          <ComponentAccordions form={form} />
          <ExitSaveButtons
            saveDisabled={disabled}
            exitOnClick={() => router.push("/food")}
            // React hook form targets buttons with type="submit" so no handler is necessary
            saveOnClick={() => {}}
            boxSx={{ display: "flex", justifyContent: "space-between", pt: 1 }}
          />
        </form>
      </Card>
    </Container>
  );
};
