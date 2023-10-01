import { Button, TextField } from "@mui/material";
import { useState } from 'react';
import { useRouter } from "next/router";
import { IRecipe } from "../../core/types/recipes";
import { v4 as uuidv4 } from 'uuid';
import { convertUploadToRecipe } from "../../core/openai/openai_utilities";
import { usePutRecipeToDynamo } from "../../core/dynamo/hooks/use_dynamo_put";

export default function ExistingUpload() {
  const [recipe, setRecipe] = useState("");
  const { mutateAsync, disabled } = usePutRecipeToDynamo();
  const router = useRouter();
  const onUpload = async () => {
    const resp = await convertUploadToRecipe(recipe);
    const recipeString = resp.data.choices[0].message?.content
    if (!recipeString) throw new Error('No recipe returned');
    const recipeJson: IRecipe = JSON.parse(recipeString)
    recipeJson.uuid = uuidv4()
    recipeJson.components.forEach(component => component.uuid = uuidv4())
    await mutateAsync({ recipe: recipeJson })
    router.push('/food');
  }
  return (
    <>
      <TextField
        id="outlined-multiline-static"
        label="Input Recipe"
        multiline
        rows={30}
        sx={{ display: "flex", margin: "auto", marginY: 2, width: "90%" }}
        onChange={(event) => setRecipe(event.target.value)}
      />
      <Button fullWidth onClick={onUpload} disabled={disabled}>Upload</Button>
    </>
  );
}
