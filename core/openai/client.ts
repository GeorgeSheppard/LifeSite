import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
    organization: "org-hMMscEUj1YdUaZtzh3UPTc8r",
    apiKey: process.env.ENV_OPENAI_SECRET_ACCESS_KEY,
});
export const openai = new OpenAIApi(configuration);
