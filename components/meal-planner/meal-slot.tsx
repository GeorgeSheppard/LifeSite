"use client"

import type { RecipeUuid, ComponentUuid, IRecipe } from "../../core/types/recipes"
import type { IMealPlanRecipe } from "../../core/types/meal_plan"
import { PlannedMealCard } from "./planned-meal-card"

interface MealSlotProps {
  meals: IMealPlanRecipe[]
  timestamp: number
  recipes: Map<RecipeUuid, IRecipe>
  onUpdateComponentServings: (recipeId: RecipeUuid, componentId: ComponentUuid, timestamp: number, servings: number) => void
  onRemoveMeal: (recipeId: RecipeUuid, timestamp: number) => void
  onRecipeClick: (recipe: IRecipe) => void
}

export function MealSlot({
  meals,
  timestamp,
  recipes,
  onUpdateComponentServings,
  onRemoveMeal,
  onRecipeClick,
}: MealSlotProps) {
  return (
    <div className="flex gap-2 flex-wrap flex-1">
      {meals.map((meal) => (
        <PlannedMealCard
          key={meal.recipeId}
          recipeId={meal.recipeId}
          timestamp={timestamp}
          components={meal.components}
          recipes={recipes}
          onUpdateComponentServings={onUpdateComponentServings}
          onRemove={onRemoveMeal}
          onRecipeClick={onRecipeClick}
        />
      ))}
    </div>
  )
}
