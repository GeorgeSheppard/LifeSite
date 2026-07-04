"use client"

import Image from "@/components/ui/next-image-compat"
import type { Recipe } from "@/lib/recipe-data"
import { Badge } from "@/components/ui/badge"
import { SearchBar } from "@/components/search-bar"
import { Clock, GripVertical } from "lucide-react"

interface RecipeSidebarProps {
  recipes: Recipe[]
  searchString: string
  onSearchChange: (value: string) => void
  onRecipeClick: (recipe: Recipe) => void
}

export function RecipeSidebar({ recipes, searchString, onSearchChange, onRecipeClick }: RecipeSidebarProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="lg:sticky lg:top-0 lg:z-10 lg:bg-background lg:pb-2">
        <SearchBar searchString={searchString} onSearchChange={onSearchChange} />
      </div>
      <div className="flex flex-col gap-2">
        {recipes.map((recipe) => (
          <DraggableRecipe key={recipe.title} recipe={recipe} onRecipeClick={onRecipeClick} />
        ))}
      </div>
    </div>
  )
}

function DraggableRecipe({ recipe, onRecipeClick }: { recipe: Recipe; onRecipeClick: (recipe: Recipe) => void }) {
  function handleDragStart(e: React.DragEvent) {
    e.dataTransfer.setData("application/recipe", JSON.stringify(recipe))
    e.dataTransfer.effectAllowed = "copy"
  }

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onClick={() => onRecipeClick(recipe)}
      className="group flex items-center gap-3 rounded-lg border border-border/60 bg-card p-2.5 shadow-sm cursor-grab active:cursor-grabbing hover:border-primary/30 hover:shadow-md transition-all select-none"
    >
      <div className="text-muted-foreground/40 group-hover:text-muted-foreground/70 transition-colors shrink-0">
        <GripVertical className="size-4" />
      </div>
      <div className="relative size-12 shrink-0 rounded-md overflow-hidden">
        <Image
          src={recipe.image}
          alt={recipe.title}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="text-sm font-medium text-foreground truncate">
          {recipe.title}
        </span>
        <div className="flex items-center gap-2">
          {recipe.totalTime && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="size-3" />
              {recipe.totalTime}
            </span>
          )}
          {recipe.difficulty && (
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
              {recipe.difficulty}
            </Badge>
          )}
        </div>
      </div>
    </div>
  )
}
