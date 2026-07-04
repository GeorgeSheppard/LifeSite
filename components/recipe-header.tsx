import Image from "@/components/ui/next-image-compat"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, Users, ChefHat, Minus, Plus } from "lucide-react"
import type { Recipe } from "@/lib/recipe-data"

const difficultyColor = {
  Easy: "bg-accent text-accent-foreground",
  Medium: "bg-primary/15 text-primary",
  Hard: "bg-destructive/15 text-destructive",
}

interface ServingsControl {
  value: number
  onIncrease: () => void
  onDecrease: () => void
}

export function RecipeHeader({
  recipe,
  actions,
  servingsControl,
}: {
  recipe: Recipe
  actions?: React.ReactNode
  servingsControl?: ServingsControl
}) {
  const hasImage = recipe.image && recipe.image !== "/placeholder.svg"
  const hasTags = recipe.tags && recipe.tags.length > 0
  const hasMetadata = recipe.prepTime || recipe.cookTime || recipe.totalTime || recipe.servings

  return (
    <div className="flex flex-col">
      {hasImage && (
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl">
          <Image
            src={recipe.image}
            alt={recipe.title}
            fill
            className="object-cover"
          />
        </div>
      )}
      <div className="flex flex-col gap-4 pt-6">
        {(hasTags || recipe.difficulty) && (
          <div className="flex flex-wrap items-center gap-2">
            {hasTags &&
              recipe.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs font-medium">
                  {tag}
                </Badge>
              ))}
            {recipe.difficulty && (
              <Badge
                className={`text-xs font-medium border-0 ${difficultyColor[recipe.difficulty]}`}
              >
                {recipe.difficulty}
              </Badge>
            )}
          </div>
        )}
        <h1 className="font-serif text-2xl tracking-tight text-foreground sm:text-3xl md:text-4xl text-balance">
          {recipe.title}
        </h1>
        {actions}
        {recipe.description && (
          <p className="text-muted-foreground leading-relaxed max-w-2xl">
            {recipe.description}
          </p>
        )}
        {hasMetadata && (
          <div className="grid grid-cols-2 gap-3 pt-2">
            {recipe.prepTime && (
              <MetaItem icon={<Clock className="size-4" />} label="Prep" value={recipe.prepTime} />
            )}
            {recipe.cookTime && (
              <MetaItem icon={<Clock className="size-4" />} label="Cook" value={recipe.cookTime} />
            )}
            {recipe.totalTime && (
              <MetaItem icon={<Clock className="size-4" />} label="Total" value={recipe.totalTime} />
            )}
            {recipe.servings && !servingsControl && (
              <MetaItem icon={<Users className="size-4" />} label="Yield" value={recipe.servings} />
            )}
            {servingsControl && (
              <ServingsMetaItem servingsControl={servingsControl} />
            )}
            {recipe.difficulty && (
              <MetaItem icon={<ChefHat className="size-4" />} label="Level" value={recipe.difficulty} />
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function ServingsMetaItem({ servingsControl }: { servingsControl: ServingsControl }) {
  const { value, onIncrease, onDecrease } = servingsControl
  return (
    <div className="flex items-center gap-2 rounded-lg bg-secondary/60 px-3 py-2">
      <span className="text-primary shrink-0">
        <Users className="size-4" />
      </span>
      <div className="flex flex-col min-w-0 flex-1">
        <span className="text-[10px] text-muted-foreground uppercase tracking-wide leading-none">
          Servings
        </span>
        <div className="flex items-center gap-1.5 pt-0.5">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-5 rounded-full"
            onClick={onDecrease}
            aria-label="Decrease servings"
          >
            <Minus className="size-2.5" />
          </Button>
          <span className="text-sm font-medium text-foreground min-w-[16px] text-center tabular-nums">
            {value}
          </span>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-5 rounded-full"
            onClick={onIncrease}
            aria-label="Increase servings"
          >
            <Plus className="size-2.5" />
          </Button>
        </div>
      </div>
    </div>
  )
}

function MetaItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-secondary/60 px-3 py-2">
      <span className="text-primary shrink-0">{icon}</span>
      <div className="flex flex-col min-w-0">
        <span className="text-[10px] text-muted-foreground uppercase tracking-wide leading-none">
          {label}
        </span>
        <span className="text-sm font-medium text-foreground truncate leading-snug">
          {value}
        </span>
      </div>
    </div>
  )
}
