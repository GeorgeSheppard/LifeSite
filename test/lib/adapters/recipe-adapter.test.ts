import { iRecipeToRecipe } from "../../../lib/adapters/recipe-adapter";
import { IRecipe, Unit } from "../../../core/types/recipes";

function makeRecipe(servings?: number): IRecipe {
  return {
    uuid: "recipe-1",
    name: "Test Recipe",
    description: "A recipe",
    images: [],
    components: [
      {
        name: "Main",
        uuid: "component-1",
        servings,
        ingredients: [
          { name: "Flour", quantity: { unit: Unit.GRAM, value: 200 } },
          { name: "Eggs", quantity: { unit: Unit.NUMBER, value: 2 } },
        ],
        instructions: [{ text: "Mix it all together." }],
      },
    ],
  };
}

describe("iRecipeToRecipe servings scaling", () => {
  it("shows no servings info when the recipe has no servings", () => {
    const recipe = iRecipeToRecipe(makeRecipe(undefined));
    expect(recipe.servings).toBe("");
    expect(recipe.baseServings).toBeUndefined();
    expect(recipe.parts[0].ingredients[0].amount).toBe("200");
  });

  it("defaults to the base servings when no override is given", () => {
    const recipe = iRecipeToRecipe(makeRecipe(4));
    expect(recipe.servings).toBe("4 servings");
    expect(recipe.baseServings).toBe(4);
    expect(recipe.parts[0].ingredients[0].amount).toBe("200");
    expect(recipe.parts[0].ingredients[1].amount).toBe("2");
  });

  it("uses singular wording for one serving", () => {
    const recipe = iRecipeToRecipe(makeRecipe(1));
    expect(recipe.servings).toBe("1 serving");
  });

  it("scales ingredient quantities proportionally to the servings override", () => {
    const recipe = iRecipeToRecipe(makeRecipe(4), undefined, 8);
    expect(recipe.servings).toBe("8 servings");
    expect(recipe.parts[0].ingredients[0].amount).toBe("400");
    expect(recipe.parts[0].ingredients[1].amount).toBe("4");
  });

  it("scales down and rounds fractional amounts", () => {
    const recipe = iRecipeToRecipe(makeRecipe(4), undefined, 3);
    expect(recipe.servings).toBe("3 servings");
    expect(recipe.parts[0].ingredients[0].amount).toBe("150");
  });
});
