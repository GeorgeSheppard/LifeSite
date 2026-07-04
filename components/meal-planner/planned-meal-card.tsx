"use client"

import type { RecipeUuid, ComponentUuid, IRecipe } from "../../core/types/recipes"
import type { IMealPlanComponent } from "../../core/types/meal_plan"
import { Button } from "@/components/ui/button"
import { Minus, Plus, X } from "lucide-react"
import { iRecipeToRecipe } from "@/lib/adapters/recipe-adapter"

interface PlannedMealCardProps {
  recipeId: RecipeUuid
  timestamp: number
  components: IMealPlanComponent[]
  recipes: Map<RecipeUuid, IRecipe>
  onUpdateComponentServings: (recipeId: RecipeUuid, componentId: ComponentUuid, timestamp: number, servings: number) => void
  onRemove: (recipeId: RecipeUuid, timestamp: number) => void
  onRecipeClick: (recipe: IRecipe) => void
}

export function PlannedMealCard({
  recipeId,
  timestamp,
  components,
  recipes,
  onUpdateComponentServings,
  onRemove,
  onRecipeClick,
}: PlannedMealCardProps) {
  const recipe = recipes.get(recipeId)
  const recipeTitle = recipe?.name || "Unknown Recipe"

  function handleDragStart(e: React.DragEvent) {
    if (!recipe) return
    e.dataTransfer.setData("application/recipe", JSON.stringify(iRecipeToRecipe(recipe)))
    e.dataTransfer.setData(
      "application/meal-move",
      JSON.stringify({ recipeId, timestamp, components })
    )
    e.dataTransfer.effectAllowed = "move"
  }

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onClick={() => recipe && onRecipeClick(recipe)}
      className="group relative rounded-lg border border-border/50 bg-card shadow-sm transition-all hover:shadow-md min-w-[280px] flex-1 cursor-grab active:cursor-grabbing"
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={(e) => {
          e.stopPropagation()
          onRemove(recipeId, timestamp)
        }}
        className="absolute -right-1.5 -top-1.5 size-6 rounded-full bg-destructive/10 text-destructive opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/20"
        aria-label="Remove meal"
      >
        <X className="size-3.5" />
      </Button>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex-1 min-w-0">
            <p className="text-base font-medium text-foreground leading-snug">
              {recipeTitle}
            </p>
          </div>
        </div>

        {components.length > 0 && (
          <div className="space-y-2 border-t border-border/30 pt-3">
            {components.map((component) => {
              const componentDef = recipe?.components.find((c) => c.uuid === component.componentId)
              const componentName = componentDef?.name || "Component"

              return (
                <div key={component.componentId} className="flex items-center justify-between gap-3">
                  <span className="text-sm text-muted-foreground truncate flex-1">
                    {componentName}
                  </span>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      className="size-7 rounded-full"
                      onClick={(e) => {
                        e.stopPropagation()
                        onUpdateComponentServings(
                          recipeId,
                          component.componentId,
                          timestamp,
                          Math.max(0, component.servings - 1)
                        )
                      }}
                      aria-label={`Decrease ${componentName} servings`}
                    >
                      <Minus className="size-3" />
                    </Button>
                    <span className="text-sm font-medium text-muted-foreground min-w-[24px] text-center tabular-nums">
                      {component.servings}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="size-7 rounded-full"
                      onClick={(e) => {
                        e.stopPropagation()
                        onUpdateComponentServings(
                          recipeId,
                          component.componentId,
                          timestamp,
                          component.servings + 1
                        )
                      }}
                      aria-label={`Increase ${componentName} servings`}
                    >
                      <Plus className="size-3" />
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
