import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { RecipeHeader } from "@/components/recipe-header"
import { RecipePartSection } from "@/components/recipe-part"
import { RecipeNotes } from "@/components/recipe-notes"
import type { Recipe } from "@/lib/recipe-data"

interface ServingsControl {
  value: number
  onIncrease: () => void
  onDecrease: () => void
}

export function RecipeCard({
  recipe,
  actions,
  servingsControl,
}: {
  recipe: Recipe
  actions?: React.ReactNode
  servingsControl?: ServingsControl
}) {
  return (
    <Card className="overflow-hidden border-border/60 shadow-sm">
      <CardContent className="flex flex-col gap-8 p-5 sm:p-8">
        <RecipeHeader recipe={recipe} actions={actions} servingsControl={servingsControl} />

        <Separator />

        {recipe.parts.map((part, i) => (
          <div key={i} className="flex flex-col gap-8">
            <RecipePartSection
              part={part}
              partIndex={i}
              totalParts={recipe.parts.length}
            />
            {i < recipe.parts.length - 1 && <Separator />}
          </div>
        ))}

        {recipe.notes && recipe.notes.length > 0 && (
          <>
            <Separator />
            <RecipeNotes notes={recipe.notes} />
          </>
        )}
      </CardContent>
    </Card>
  )
}
