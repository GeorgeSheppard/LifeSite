import { openai } from "./client"
import { RecipeUploaderPrompt } from "./recipe_uploader_prompt"

export const convertUploadToRecipe = async (upload: string) => {
  return await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: RecipeUploaderPrompt }, { role: "user", content: upload}],
      temperature: 0.2,
  })
}