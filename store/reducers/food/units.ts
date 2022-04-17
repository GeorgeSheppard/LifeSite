import { IIngredientName } from "./recipes";

export enum Unit {
  NO_UNIT = "none",
  MILLILITER = "mL",
  LITER = "L",
  GRAM = "g",
  KILOGRAM = "kg",
  CUP = "cup",
  TEASPOON = "tsp",
  TABLESPOON = "tbsp",
  NUMBER = "quantity",
}

export interface IQuantity {
  unit?: Unit;
  value?: number;
}

export const Quantities = {
  toString: (quantity?: IQuantity) => {
    if (!quantity) {
      return;
    }

    const unit = quantity.unit;
    if (!unit || unit === Unit.NO_UNIT) {
      return;
    }

    if (unit === Unit.NUMBER) {
      return `${quantity.value}`;
    }

    return `${quantity.value}${unit}`;
  },
  toStringWithIngredient: (ingredientName: IIngredientName, quantity?: IQuantity) => {
    {
      const quantityString = Quantities.toString(quantity);
  
      if (!quantityString) {
        return ingredientName;
      } else {
        return quantityString + " " + ingredientName;
      }
    }
  },
} 
