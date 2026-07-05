import type { Unit } from "@/core/types/recipes";

export interface ChatIngredient {
  name: string;
  quantity: { unit: Unit; value?: number };
}

export interface ChatInstruction {
  text: string;
  optional?: boolean;
}

export interface ChatRecipeComponent {
  name: string;
  ingredients: ChatIngredient[];
  instructions: ChatInstruction[];
  storeable?: boolean;
  servings?: number;
}

export interface ChatRecipe {
  name: string;
  description: string;
  components: ChatRecipeComponent[];
  sourceUrl?: string;
}

export type ChatContentBlock =
  | { type: "text"; text: string }
  | { type: "recipe"; recipe: ChatRecipe };

export interface ChatMessage {
  role: "user" | "assistant";
  content: ChatContentBlock[];
}
