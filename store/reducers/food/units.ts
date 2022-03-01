/**
 * Thought about a UNITLESS unit here to cover things like Basil
 * where you would not specify a quantity. Currently it is assumed
 * that an ingredient with a quantity will not be unitless
 */
export enum Unit {
  MILLILITER = "mL",
  LITER = "L",
  GRAM = "g",
  KILOGRAM = "kg",
  CUP = "cup",
  TEASPOON = "tsp",
  TABLESPOON = "tbsp",
  NUMBER = "number",
}

export class Quantity {
  private _unit: Unit;
  private _quantity: number;

  constructor(unit: Unit, quantity: number = 0) {
    this._unit = unit;
    this._quantity = quantity;
  }

  public toString(): string {
    if (this._unit === Unit.NUMBER) {
      return `${this._quantity}`;
    }

    return `${this._quantity}${this._unit}`;
  }
}
