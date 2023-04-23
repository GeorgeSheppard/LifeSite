import { Button, TextField } from "@mui/material";
import { openai } from "../../components/openai/client";
import { RecipeUploaderPrompt } from '../../components/openai/recipeUploaderPrompt';
import { useState } from 'react';
import { usePutRecipeToDynamo } from "../../components/hooks/user_data/use_dynamo_put";
import { useRouter } from "next/router";
import { IRecipe } from "../../store/reducers/food/recipes/types";
import { v4 as uuidv4 } from 'uuid';

export default function ExistingUpload() {
  const [recipe, setRecipe] = useState("");
  const { mutateAsync, disabled } = usePutRecipeToDynamo();
  const router = useRouter();
  const onUpload = async () => {
    console.log('recipe', recipe)
    const resp = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: RecipeUploaderPrompt }, { role: "user", content: recipe}],
      temperature: 0.2,
    })
    console.log('response', resp)
    const recipeString = resp.data.choices[0].message?.content
    if (!recipeString) throw new Error('No recipe returned');
    const recipeJson: IRecipe = JSON.parse(recipeString)
    recipeJson.uuid = uuidv4()
    recipeJson.components.forEach(component => component.uuid = uuidv4())
    await mutateAsync(recipeJson)
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
