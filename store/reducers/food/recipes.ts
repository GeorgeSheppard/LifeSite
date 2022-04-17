import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Image } from "../types";
import { IQuantity, Unit } from "./units";
import { IFullStoreState } from "../../store";

export type RecipeUuid = string;
export type IngredientUuid = string;
export type IIngredientName = string;

export interface INutritionData { }

export interface IIngredient {
  /**
   * Name acts as uuid
   */
  name: IIngredientName;
  nutritionData?: INutritionData;
}

export interface IInstruction {
  text: string;
  /**
   * Assumed false
   */
  optional?: boolean;
}

export interface IRecipeIngredient {
  name: IIngredientName;
  quantity: IQuantity;
}

export interface IRecipeComponent {
  name: string;
  ingredients: IRecipeIngredient[];
  instructions: IInstruction[];
  storeable?: boolean;
  servings?: number;
}

export interface IRecipe {
  uuid: RecipeUuid;
  name: string;
  description: string;
  images: Image[];
  components: IRecipeComponent[];
}

export type IIngredientsDatabase = {
[index: IIngredientName]: IIngredient;
};

export const exampleDisplayRecipe: IRecipe = {
  uuid: "085388d3-e3cb-4700-9d79-53ded68fafc2",
  name: "Chilli con carne",
  description: "Spiced beef in a tomato sauce, with kidney beans and onions",
  images: [
    {
      key: "5137a78d-3099-4a4e-be6f-588528de396b/images/ChilliConCarne.jpg",
      timestamp: 1650193193483
    }
  ],
  components: [
    {
      name: "",
      ingredients: [
        {
          name: "Minced beef",
          quantity: {
            unit: Unit.GRAM,
            value: "500"
          }
        },
        {
          name: "Medium onion",
          quantity: {
            unit: Unit.NUMBER,
            value: "2"
          }
        },
        {
          name: "Garlic cloves",
          quantity: {
            unit: Unit.NUMBER,
            value: "3"
          }
        },
        {
          name: "Hot chilli powder",
          quantity: {
            unit: Unit.TEASPOON,
            value: "2"
          }
        },
        {
          name: "Ground cumin",
          quantity: {
            unit: Unit.TEASPOON,
            value: "2"
          }
        },
        {
          name: "Ground coriander",
          quantity: {
            unit: Unit.TEASPOON,
            value: "2"
          }
        },
        {
          name: "Plain flour",
          quantity: {
            unit: Unit.TABLESPOON,
            value: "2"
          }
        },
        {
          name: "Beef stock",
          quantity: {
            unit: Unit.MILLILITER,
            value: "300"
          }
        },
        {
          name: "Red wine or extra beef stock",
          quantity: {
            unit: Unit.MILLILITER,
            value: "150"
          }
        },
        {
          name: "Chopped tomatoes",
          quantity: {
            unit: Unit.GRAM,
            value: "400"
          }
        },
        {
          name: "Red kidney beans",
          quantity: {
            unit: Unit.GRAM,
            value: "400"
          }
        },
        {
          name: "Tomato puree",
          quantity: {
            unit: Unit.TABLESPOON,
            value: "3"
          }
        },
        {
          name: "Caster sugar",
          quantity: {
            unit: Unit.TEASPOON,
            value: "1"
          }
        },
        {
          name: "Dried oregano",
          quantity: {
            unit: Unit.TEASPOON,
            value: "1"
          }
        },
        {
          name: "Bay leaf",
          quantity: {
            unit: Unit.NUMBER,
            value: "1"
          }
        },
        {
          name: "Sea salt",
          quantity: {
            unit: Unit.NO_UNIT
          }
        },
        {
          name: "Pepper",
          quantity: {
            unit: Unit.NO_UNIT
          }
        }
      ],
      instructions: [
        {
          text: "Place a large non-stick saucepan over a medium heat and add the beef and onions. Cook together for 5 minutes, stirring the beef and squishing it against the sides of the pan to break up the lumps.",
          optional: false
        },
        {
          text: "Add the garlic, 1–2 teaspoons of chilli powder, depending on how hot you like your chilli, and the cumin and coriander. Fry together for 1–2 minutes more.",
          optional: false
        },
        {
          text: "Sprinkle over the ﬂour and stir well.",
          optional: false
        },
        {
          text: "Slowly add the wine and then the stock, stirring constantly.",
          optional: false
        },
        {
          text: "Tip the tomatoes and kidney beans into the pan and stir in the tomato purée, caster sugar, oregano and bay leaf. Season with a pinch of salt and plenty of freshly ground black pepper.",
          optional: false
        },
        {
          text: "Bring to a simmer on the hob, then cover loosely with a lid. Reduce the heat and leave to simmer gently for 45 minutes, stirring occasionally until the mince is tender and the sauce is thick. Adjust the seasoning to taste and serve.",
          optional: false
        }
      ],
      storeable: true,
      servings: 3
    }]
}

export interface IRecipesState {
  cards: RecipeUuid[];
  recipes: { [key: RecipeUuid]: IRecipe };
  ingredients: IIngredientsDatabase;
}

const initialState: IRecipesState = {
  cards: [exampleDisplayRecipe.uuid],
  recipes: {
    [exampleDisplayRecipe.uuid]: exampleDisplayRecipe,
  },
  ingredients: {},
};

export const foodEmptyState = {
  cards: [],
  recipes: {},
  ingredients: {}
}

export const foodSlice = createSlice({
  name: "food",
  initialState,
  reducers: {
    addOrUpdateRecipe: (state, action: PayloadAction<IRecipe>) => {
      const recipe = action.payload;
      const { uuid } = recipe;
      const existsAlready = uuid in state.recipes;
      state.recipes[uuid] = recipe;
      if (!existsAlready) {
        state.cards.unshift(uuid);
      }
    },
    deleteRecipe: (state, action: PayloadAction<RecipeUuid>) => {
      const uuid = action.payload;
      delete state.recipes[uuid];
      state.cards = state.cards.filter((cardUuid) => cardUuid !== uuid);
    },
  },
  extraReducers: {
    "user/login": (state, action: PayloadAction<IFullStoreState>) => {
      return action.payload.food ?? initialState;
    },
    "user/logout": (state) => {
      return initialState;
    },
  },
});

export const { addOrUpdateRecipe, deleteRecipe } = foodSlice.actions;

export default foodSlice.reducer;
