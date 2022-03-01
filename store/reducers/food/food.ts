import { ImagePath } from "../types";
import { Quantity, Unit } from "./units";

export type IIngredientName = string;

export interface IIngredient {
  name: IIngredientName;
  quantity?: Quantity;
}

export interface IRecipeImage {
  image: ImagePath;
}

export interface IRecipe {
  /**
   * e.g. Sauce, Toppings, Optional
   */
  title?: string;
  ingredients: IIngredient[];
  /**
   * Whether this recipe can be stored long term, e.g. frozen or
   * placed in pantry
   * Default is false if it doesn't exist
   */
  storeable?: boolean;
}

export interface IMethodStep {
  instruction: string;
}

export interface IDisplayRecipe {
  /**
   * Recipes can be composed of multiple parts, e.g. the sauce for a dish
   * It is useful to seperate so that if something is batched cooked we can
   * specify which aspect we need to get from the shop
   */
  recipeAspects: IRecipe[];
  images?: IRecipeImage[];
  method?: IMethodStep[];
}

export const exampleDisplayRecipe: IDisplayRecipe = {
  recipeAspects: [
    {
      title: "Sauce",
      ingredients: [
        {
          name: "Star Anise",
          quantity: new Quantity(Unit.NUMBER, 3),
        },
        {
          name: "Beef Broth",
          quantity: new Quantity(Unit.MILLILITER, 800),
        },
      ],
      storeable: true,
    },
    {
      title: "Main Dish",
      ingredients: [
        {
          name: "Noodles",
          quantity: new Quantity(Unit.GRAM, 200),
        },
        {
          name: "Spring Onion",
        },
      ],
    },
  ],
  images: [{ image: "photo_of_dish.png" }, { image: "photo_of_sauce.png" }],
  method: [{ instruction: "Cook the dish" }, { instruction: "Enjoy" }],
};
