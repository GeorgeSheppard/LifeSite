export enum Unit {
  MILLILITER = "mL",
  LITER = "L",
  GRAM = "g",
  KILOGRAM = "kg",
  CUP = "cup",
  TEASPOON = "tsp",
  TABLESPOON = "tbsp",
  NUMBER = "number",
  NO_UNIT = "no_unit",
}

export interface QuantityJSON {
  unit: Unit;
  quantity: number;
}

export class Quantity {
  private _unit: Unit;
  private _quantity: number;

  public static fromJSON(json: QuantityJSON): Quantity {
    return new Quantity(json.unit, json.quantity);
  }

  constructor(unit: Unit, quantity: number = 0) {
    this._unit = unit;
    this._quantity = quantity;
  }

  public toString(): string | undefined {
    if (this._unit === Unit.NO_UNIT) {
      return;
    }

    if (this._unit === Unit.NUMBER) {
      return `${this._quantity}`;
    }

    return `${this._quantity}${this._unit}`;
  }

  public toStringWithIngredient(ingredient: string): string {
    const quantity = this.toString();

    if (!quantity) {
      return ingredient;
    } else {
      return quantity + " " + ingredient;
    }
  }

  public toJSON(): QuantityJSON {
    return {
      unit: this._unit,
      quantity: this._quantity,
    };
  }
}
