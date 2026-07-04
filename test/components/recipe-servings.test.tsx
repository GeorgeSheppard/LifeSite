import React, { useState } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { RecipeCard } from "../../components/recipe-card";
import { iRecipeToRecipe } from "../../lib/adapters/recipe-adapter";
import { IRecipe, Unit } from "../../core/types/recipes";

const recipe: IRecipe = {
  uuid: "recipe-1",
  name: "Pancakes",
  description: "Fluffy pancakes",
  images: [],
  components: [
    {
      name: "Batter",
      uuid: "component-1",
      servings: 4,
      ingredients: [
        { name: "Flour", quantity: { unit: Unit.GRAM, value: 200 } },
        { name: "Eggs", quantity: { unit: Unit.NUMBER, value: 2 } },
      ],
      instructions: [{ text: "Whisk together." }],
    },
  ],
};

function Harness() {
  const baseServings = recipe.components[0].servings!;
  const [servings, setServings] = useState(baseServings);
  const v0Recipe = iRecipeToRecipe(recipe, undefined, servings);

  return (
    <RecipeCard
      recipe={v0Recipe}
      servingsControl={{
        value: servings,
        onIncrease: () => setServings((s) => s + 1),
        onDecrease: () => setServings((s) => Math.max(1, s - 1)),
      }}
    />
  );
}

function servingsValue() {
  return document.querySelector(".tabular-nums")!.textContent;
}

function ingredientTexts() {
  const heading = screen.getByText("Ingredients");
  const items = heading.parentElement!.querySelectorAll("li");
  return Array.from(items).map((li) => li.textContent!.replace(/\s+/g, " ").trim());
}

describe("Recipe servings stepper", () => {
  it("shows the base servings and ingredient amounts up front", () => {
    render(<Harness />);
    expect(servingsValue()).toBe("4");
    expect(ingredientTexts()).toEqual(["200 g Flour", "2 Eggs"]);
  });

  it("scales ingredient amounts up when servings is increased", () => {
    render(<Harness />);
    fireEvent.click(screen.getByRole("button", { name: /increase servings/i }));

    expect(servingsValue()).toBe("5");
    expect(ingredientTexts()).toEqual(["250 g Flour", "2.5 Eggs"]);
  });

  it("scales ingredient amounts down when servings is decreased, never below 1", () => {
    render(<Harness />);
    const decreaseButton = screen.getByRole("button", { name: /decrease servings/i });

    fireEvent.click(decreaseButton);
    fireEvent.click(decreaseButton);
    fireEvent.click(decreaseButton);

    expect(servingsValue()).toBe("1");
    expect(ingredientTexts()).toEqual(["50 g Flour", "0.5 Eggs"]);

    fireEvent.click(decreaseButton);
    expect(servingsValue()).toBe("1");
  });
});
