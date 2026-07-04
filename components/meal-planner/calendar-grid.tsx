"use client"

import { useState } from "react"
import { format, isToday } from "date-fns"
import { Plus } from "lucide-react"
import type { Recipe } from "@/lib/recipe-data"
import type { RecipeUuid, ComponentUuid, IRecipe } from "../../core/types/recipes"
import type { IMealPlan, IMealPlanComponent } from "../../core/types/meal_plan"
import { isoToTimestamp } from "../../core/meal_plan/meal_plan_utilities"
import { MealSlot } from "./meal-slot"
import { cn } from "@/lib/utils"

interface CalendarGridProps {
  days: Date[]
  plan: IMealPlan
  recipes: Map<RecipeUuid, IRecipe>
  selectedDates: Set<string>
  onToggleDate: (dateStr: string) => void
  onDrop: (recipe: Recipe, date: string) => void
  onMoveMeal: (recipeId: RecipeUuid, originTimestamp: number, targetDate: string, components: IMealPlanComponent[]) => void
  onUpdateComponentServings: (recipeId: RecipeUuid, componentId: ComponentUuid, timestamp: number, servings: number) => void
  onRemoveMeal: (recipeId: RecipeUuid, timestamp: number) => void
  onRecipeClick: (recipe: IRecipe) => void
}

function useDayDrop(
  dateStr: string,
  onDrop: (recipe: Recipe, date: string) => void,
  onMoveMeal: (recipeId: RecipeUuid, originTimestamp: number, targetDate: string, components: IMealPlanComponent[]) => void
) {
  const [isDragOver, setIsDragOver] = useState(false)

  function handleDragOver(e: React.DragEvent) {
    if (e.dataTransfer.types.includes("application/recipe")) {
      e.preventDefault()
      e.dataTransfer.dropEffect = e.dataTransfer.types.includes("application/meal-move") ? "move" : "copy"
      setIsDragOver(true)
    }
  }

  function handleDragLeave(e: React.DragEvent) {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragOver(false)
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDragOver(false)
    const moveData = e.dataTransfer.getData("application/meal-move")
    if (moveData) {
      try {
        const { recipeId, timestamp, components } = JSON.parse(moveData)
        onMoveMeal(recipeId, timestamp, dateStr, components)
        return
      } catch {
        // ignore malformed data
      }
    }
    const data = e.dataTransfer.getData("application/recipe")
    if (data) {
      try {
        const recipe: Recipe = JSON.parse(data)
        onDrop(recipe, dateStr)
      } catch {
        // ignore malformed data
      }
    }
  }

  return { isDragOver, handleDragOver, handleDragLeave, handleDrop }
}

function DesktopDayRow({
  day,
  plan,
  recipes,
  isSelected,
  onToggleDate,
  onDrop,
  onMoveMeal,
  onUpdateComponentServings,
  onRemoveMeal,
  onRecipeClick,
}: {
  day: Date
  plan: IMealPlan
  recipes: Map<RecipeUuid, IRecipe>
  isSelected: boolean
  onToggleDate: (dateStr: string) => void
  onDrop: CalendarGridProps["onDrop"]
  onMoveMeal: CalendarGridProps["onMoveMeal"]
  onUpdateComponentServings: CalendarGridProps["onUpdateComponentServings"]
  onRemoveMeal: CalendarGridProps["onRemoveMeal"]
  onRecipeClick: CalendarGridProps["onRecipeClick"]
}) {
  const dateStr = format(day, "yyyy-MM-dd")
  const today = isToday(day)
  const timestamp = isoToTimestamp(dateStr)
  const dateItem = plan.find((item) => item.date === timestamp)
  const dayMeals = dateItem?.plan || []
  const { isDragOver, handleDragOver, handleDragLeave, handleDrop } =
    useDayDrop(dateStr, onDrop, onMoveMeal)

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "flex gap-4 transition-colors py-3 px-4",
        isSelected && "bg-primary/[0.06]",
        isDragOver && "bg-primary/5"
      )}
    >
      <div
        onClick={() => onToggleDate(dateStr)}
        className={cn(
          "flex items-center gap-3 cursor-pointer transition-colors shrink-0",
          isSelected ? "opacity-100" : "hover:opacity-80"
        )}
      >
        <span
          className={cn(
            "flex size-10 items-center justify-center rounded-full text-base font-semibold transition-colors",
            today
              ? "bg-primary text-primary-foreground"
              : isSelected
                ? "bg-primary/20 text-primary"
                : "text-foreground"
          )}
        >
          {format(day, "d")}
        </span>
        <div className="flex flex-col min-w-[140px]">
          <span className="text-sm font-semibold text-foreground">
            {format(day, "EEEE")}
          </span>
          <span className="text-xs text-muted-foreground">
            {format(day, "MMMM d")}
          </span>
        </div>
      </div>
      <div className="flex gap-2 flex-1 min-h-[80px] items-start">
        {dayMeals.length > 0 ? (
          <MealSlot
            meals={dayMeals}
            timestamp={timestamp}
            recipes={recipes}
            onUpdateComponentServings={onUpdateComponentServings}
            onRemoveMeal={onRemoveMeal}
            onRecipeClick={onRecipeClick}
          />
        ) : (
          <div
            className={cn(
              "flex items-center justify-center rounded-lg border-2 border-dashed flex-1 h-full min-h-[80px] transition-colors",
              isDragOver
                ? "border-primary/40 bg-primary/5 text-primary"
                : "border-border/30 text-muted-foreground/30 hover:border-border/50"
            )}
          >
            <Plus className="size-5" />
          </div>
        )}
      </div>
    </div>
  )
}

function MobileDayRow({
  day,
  plan,
  recipes,
  isSelected,
  onToggleDate,
  onDrop,
  onMoveMeal,
  onUpdateComponentServings,
  onRemoveMeal,
  onRecipeClick,
}: {
  day: Date
  plan: IMealPlan
  recipes: Map<RecipeUuid, IRecipe>
  isSelected: boolean
  onToggleDate: (dateStr: string) => void
  onDrop: CalendarGridProps["onDrop"]
  onMoveMeal: CalendarGridProps["onMoveMeal"]
  onUpdateComponentServings: CalendarGridProps["onUpdateComponentServings"]
  onRemoveMeal: CalendarGridProps["onRemoveMeal"]
  onRecipeClick: CalendarGridProps["onRecipeClick"]
}) {
  const dateStr = format(day, "yyyy-MM-dd")
  const today = isToday(day)
  const timestamp = isoToTimestamp(dateStr)
  const dateItem = plan.find((item) => item.date === timestamp)
  const dayMeals = dateItem?.plan || []
  const { isDragOver, handleDragOver, handleDragLeave, handleDrop } =
    useDayDrop(dateStr, onDrop, onMoveMeal)

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "flex flex-col transition-colors",
        isSelected && "bg-primary/[0.06]",
        isDragOver && "bg-primary/5"
      )}
    >
      <div
        onClick={() => onToggleDate(dateStr)}
        className={cn(
          "flex items-center gap-3 px-4 py-3 border-b border-border/30 cursor-pointer transition-colors",
          isSelected ? "bg-primary/[0.10]" : "hover:bg-accent/50"
        )}
      >
        <span
          className={cn(
            "flex size-9 items-center justify-center rounded-full text-base font-semibold transition-colors",
            today
              ? "bg-primary text-primary-foreground"
              : isSelected
                ? "bg-primary/20 text-primary"
                : "text-foreground"
          )}
        >
          {format(day, "d")}
        </span>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-foreground">
            {format(day, "EEEE")}
          </span>
          <span className="text-xs text-muted-foreground">
            {format(day, "MMMM d")}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-1.5 p-2 min-h-[60px]">
        <MealSlot
          meals={dayMeals}
          timestamp={timestamp}
          recipes={recipes}
          onUpdateComponentServings={onUpdateComponentServings}
          onRemoveMeal={onRemoveMeal}
          onRecipeClick={onRecipeClick}
        />
        {dayMeals.length === 0 && (
          <div
            className={cn(
              "flex items-center justify-center rounded-md border border-dashed py-3 transition-colors",
              isDragOver
                ? "border-primary/40 text-primary"
                : "border-border/30 text-muted-foreground/30"
            )}
          >
            <Plus className="size-4" />
          </div>
        )}
      </div>
    </div>
  )
}

export function CalendarGrid({
  days,
  plan,
  recipes,
  selectedDates,
  onToggleDate,
  onDrop,
  onMoveMeal,
  onUpdateComponentServings,
  onRemoveMeal,
  onRecipeClick,
}: CalendarGridProps) {
  return (
    <div className="flex flex-col gap-0 rounded-xl border border-border bg-card overflow-hidden">
      {/* Desktop: vertical list with better spacing */}
      <div className="hidden lg:flex lg:flex-col divide-y divide-border/50">
        {days.map((day) => (
          <DesktopDayRow
            key={format(day, "yyyy-MM-dd")}
            day={day}
            plan={plan}
            recipes={recipes}
            isSelected={selectedDates.has(format(day, "yyyy-MM-dd"))}
            onToggleDate={onToggleDate}
            onDrop={onDrop}
            onMoveMeal={onMoveMeal}
            onUpdateComponentServings={onUpdateComponentServings}
            onRemoveMeal={onRemoveMeal}
            onRecipeClick={onRecipeClick}
          />
        ))}
      </div>

      {/* Mobile: vertical day-by-day list */}
      <div className="flex flex-col lg:hidden divide-y divide-border/50">
        {days.map((day) => (
          <MobileDayRow
            key={format(day, "yyyy-MM-dd")}
            day={day}
            plan={plan}
            recipes={recipes}
            isSelected={selectedDates.has(format(day, "yyyy-MM-dd"))}
            onToggleDate={onToggleDate}
            onDrop={onDrop}
            onMoveMeal={onMoveMeal}
            onUpdateComponentServings={onUpdateComponentServings}
            onRemoveMeal={onRemoveMeal}
            onRecipeClick={onRecipeClick}
          />
        ))}
      </div>
    </div>
  )
}
