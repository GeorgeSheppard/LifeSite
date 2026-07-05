import { useMemo, useState } from "react";
import { Check, ChefHat, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { RecipeCard } from "@/components/recipe-card";
import { iRecipeToRecipe } from "@/lib/adapters/recipe-adapter";
import { chatRecipeToIRecipe } from "@/lib/adapters/chat-recipe-adapter";
import { useSaveChatRecipe } from "@/core/chef/hooks/use_save_chat_recipe";
import type { ChatRecipe } from "@/core/chef/types";

export function ChefRecipeCard({ recipe }: { recipe: ChatRecipe }) {
  const [open, setOpen] = useState(false);
  const [savedUuid, setSavedUuid] = useState<string | null>(null);
  const iRecipe = useMemo(() => chatRecipeToIRecipe(recipe), [recipe]);
  const saveRecipe = useSaveChatRecipe();

  const handleSave = async () => {
    const result = await saveRecipe.mutateAsync(iRecipe);
    setSavedUuid(result.uuid);
  };

  const ingredientCount = recipe.components.reduce(
    (sum, component) => sum + component.ingredients.length,
    0
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full max-w-sm text-left"
      >
        <Card className="cursor-pointer border-border/60 py-4 shadow-sm transition-colors hover:border-primary/50">
          <CardContent className="flex items-start gap-3 px-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <ChefHat className="size-5" />
            </div>
            <div className="flex flex-col gap-1">
              <p className="font-serif text-base leading-tight">
                {recipe.name}
              </p>
              <p className="line-clamp-2 text-sm text-muted-foreground">
                {recipe.description}
              </p>
              <p className="text-xs text-muted-foreground">
                {ingredientCount} ingredient{ingredientCount === 1 ? "" : "s"}{" "}
                · {recipe.components.length} part
                {recipe.components.length === 1 ? "" : "s"}
              </p>
            </div>
          </CardContent>
        </Card>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl sm:max-w-3xl max-h-[90vh] p-0 gap-0 overflow-hidden">
          <div className="flex items-center justify-between border-b border-border px-5 py-3">
            <DialogTitle className="font-serif text-lg">
              {recipe.name}
            </DialogTitle>
          </div>
          <div className="overflow-y-auto max-h-[calc(90vh-60px)]">
            <div className="p-1">
              <RecipeCard
                recipe={iRecipeToRecipe(iRecipe)}
                actions={
                  <div className="flex items-center gap-2">
                    {recipe.sourceUrl && (
                      <Button variant="ghost" size="sm" asChild>
                        <a
                          href={recipe.sourceUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <ExternalLink className="size-4" />
                          Source
                        </a>
                      </Button>
                    )}
                    <Button
                      size="sm"
                      onClick={handleSave}
                      disabled={saveRecipe.isLoading || savedUuid !== null}
                    >
                      {savedUuid ? (
                        <>
                          <Check className="size-4" />
                          Saved
                        </>
                      ) : saveRecipe.isLoading ? (
                        "Saving…"
                      ) : (
                        "Save to My Recipes"
                      )}
                    </Button>
                  </div>
                }
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
