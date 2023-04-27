import { IQuantity, Unit, IIngredientName } from "../types/recipes";

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

    return `${parseFloat(quantity.value!.toFixed(2))}${unit}`;
  },
  toStringWithIngredient: (
    ingredientName: IIngredientName,
    quantity?: IQuantity,
  ) => {
    {
      const quantityString = Quantities.toString(quantity);

      if (!quantityString) {
        return ingredientName;
      } else {
        return quantityString + " " + ingredientName.toLowerCase();
      }
    }
  },
};
