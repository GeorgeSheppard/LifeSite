import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ShoppingCart, Copy, Check, ArrowLeft, Smartphone } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { formatQuantity } from "@/lib/format-quantity";
import {
  usePostMiseShoppingListGenerate,
  PostMiseShoppingListGenerate200ItemsItem,
} from "../client/generated/hooks";

interface ShoppingListDialogProps {
  selectedDates: Set<string>;
}

function formatItem(item: PostMiseShoppingListGenerate200ItemsItem): string {
  const quantities = item.quantities.map(formatQuantity).filter(Boolean).join(" + ");
  const base = quantities ? `${item.ingredient} — ${quantities}` : item.ingredient;
  if (item.meals && item.meals.length > 0) {
    return `${base} (${item.meals.join(", ")})`;
  }
  return base;
}

function shoppingListToText(
  items: PostMiseShoppingListGenerate200ItemsItem[]
): string {
  const byCategory: Record<string, PostMiseShoppingListGenerate200ItemsItem[]> = {};
  for (const item of items) {
    const cat = item.category || "Other";
    if (!byCategory[cat]) byCategory[cat] = [];
    byCategory[cat].push(item);
  }

  return Object.entries(byCategory)
    .map(
      ([category, catItems]) =>
        `${category}\n${catItems.map((i) => `  ${formatItem(i)}`).join("\n")}`
    )
    .join("\n\n");
}

export function ShoppingListDialog({ selectedDates }: ShoppingListDialogProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [shoppingList, setShoppingList] = useState<
    PostMiseShoppingListGenerate200ItemsItem[] | null
  >(null);
  const [copied, setCopied] = useState(false);

  // Convert selected ISO dates (YYYY-MM-DD) to Unix timestamps (milliseconds)
  const dates = Array.from(selectedDates).map((iso) =>
    new Date(`${iso}T00:00:00Z`).getTime()
  );

  const { mutateAsync: generateShoppingList, isLoading: isPending } =
    usePostMiseShoppingListGenerate();

  const handleCreate = async () => {
    const result = await generateShoppingList({
      data: dates.length > 0 ? { dates } : {},
    });
    setShoppingList(result.items);
  };

  const handleCopy = async () => {
    if (!shoppingList) return;
    await navigator.clipboard.writeText(shoppingListToText(shoppingList));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpen = () => {
    setShoppingList(null);
    setCopied(false);
    setDialogOpen(true);
  };

  const handleBack = () => {
    setShoppingList(null);
  };

  // Group items by category for display
  const groupedItems: [string, PostMiseShoppingListGenerate200ItemsItem[]][] =
    shoppingList
      ? Object.entries(
          shoppingList.reduce<
            Record<string, PostMiseShoppingListGenerate200ItemsItem[]>
          >((acc, item) => {
            const cat = item.category || "Other";
            if (!acc[cat]) acc[cat] = [];
            acc[cat].push(item);
            return acc;
          }, {})
        )
      : [];

  return (
    <>
      <Button variant="outline" size="sm" onClick={handleOpen}>
        <ShoppingCart className="size-4 mr-2" />
        Shopping List
      </Button>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {shoppingList && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7"
                  onClick={handleBack}
                >
                  <ArrowLeft className="size-4" />
                </Button>
              )}
              Shopping List
            </DialogTitle>
          </DialogHeader>

          {shoppingList ? (
            <>
              <div className="overflow-y-auto max-h-[60vh] space-y-4">
                {groupedItems.map(([category, items]) => (
                  <div key={category}>
                    <h3 className="text-sm font-semibold text-foreground mb-1.5">
                      {category}
                    </h3>
                    <ul className="space-y-1">
                      {items.map((item) => (
                        <li
                          key={item.ingredient}
                          className="text-sm text-foreground py-0.5 px-2 rounded hover:bg-secondary/40"
                        >
                          <div className="flex justify-between gap-2">
                            <span>{item.ingredient}</span>
                            <span className="text-muted-foreground shrink-0">
                              {item.quantities.map(formatQuantity).filter(Boolean).join(" + ")}
                            </span>
                          </div>
                          {item.meals && item.meals.length > 0 && (
                            <div className="text-xs text-muted-foreground">
                              {item.meals.join(", ")}
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <DialogFooter className="flex-col sm:flex-col gap-2">
                <Link
                  to="/food/shopping-list"
                  className="w-full"
                  onClick={() => setDialogOpen(false)}
                >
                  <Button variant="secondary" className="w-full">
                    <Smartphone className="size-4 mr-2" />
                    Open checklist on mobile
                  </Button>
                </Link>
                <div className="flex w-full gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setDialogOpen(false)}
                    className="flex-1"
                  >
                    Close
                  </Button>
                  <Button onClick={handleCopy} className="flex-1">
                    {copied ? (
                      <Check className="size-4 mr-2" />
                    ) : (
                      <Copy className="size-4 mr-2" />
                    )}
                    {copied ? "Copied!" : "Copy to clipboard"}
                  </Button>
                </div>
              </DialogFooter>
            </>
          ) : (
            <>
              {selectedDates.size === 0 ? (
                <p className="text-sm text-muted-foreground py-4">
                  Click on days in the calendar to select them, then create your shopping list.
                </p>
              ) : (
                <p className="text-sm text-muted-foreground py-2">
                  {selectedDates.size} day{selectedDates.size === 1 ? "" : "s"} selected in the calendar.
                </p>
              )}
              <DialogFooter>
                <Button
                  onClick={handleCreate}
                  disabled={selectedDates.size === 0 || isPending}
                  className="w-full"
                >
                  {isPending ? (
                    <Spinner className="size-4 mr-2" />
                  ) : (
                    <ShoppingCart className="size-4 mr-2" />
                  )}
                  Create Shopping List
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
