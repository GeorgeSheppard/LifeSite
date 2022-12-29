import { v4 as uuidv4 } from "uuid";
import {
  IInstruction,
  IRecipeComponent,
  IRecipeIngredient,
} from "../../../../store/reducers/food/recipes/types";

export class ComponentsFormData {
  public components: { [key: string]: IRecipeComponent };

  constructor(formData: IRecipeComponent[]) {
    const obj: { [key: string]: IRecipeComponent } = {};
    for (const value of formData) {
      obj[uuidv4()] = value;
    }
    this.components = obj;
  }

  updateInstructions(componentId: string, instructions: IInstruction[]): void {
    this.components[componentId].instructions = instructions;
  }

  updateIngredients(
    componentId: string,
    ingredients: IRecipeIngredient[]
  ): void {
    this.components[componentId].ingredients = ingredients;
  }
}
