import { useEffect, useMemo, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { ShoppingCart } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { SearchBar } from "@/components/search-bar";
import { useSearchDebounce } from "@/core/hooks/use_search_debounce";
import { formatQuantity } from "@/lib/format-quantity";
import {
  useGetMiseShoppingListActive,
  GetMiseShoppingListActive200ItemsItem,
} from "@/client/generated/hooks";
import { cn } from "@/lib/utils";

const CHECKED_STORAGE_PREFIX = "mise-shopping-list-checked-";

function loadCheckedIngredients(generatedAt: number): Set<string> {
  try {
    const raw = localStorage.getItem(`${CHECKED_STORAGE_PREFIX}${generatedAt}`);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

function saveCheckedIngredients(generatedAt: number, checked: Set<string>) {
  localStorage.setItem(
    `${CHECKED_STORAGE_PREFIX}${generatedAt}`,
    JSON.stringify(Array.from(checked))
  );
}

export function ConnectedShoppingList() {
  const { data, isLoading } = useGetMiseShoppingListActive();
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [searchString, debouncedSearch, setSearchString] = useSearchDebounce("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const generatedAt = data?.generatedAt ?? null;

  useEffect(() => {
    if (generatedAt !== null) {
      setChecked(loadCheckedIngredients(generatedAt));
    }
  }, [generatedAt]);

  const toggleChecked = (ingredient: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(ingredient)) {
        next.delete(ingredient);
      } else {
        next.add(ingredient);
      }
      if (generatedAt !== null) {
        saveCheckedIngredients(generatedAt, next);
      }
      return next;
    });
  };

  const items = useMemo(() => data?.items ?? [], [data]);

  const categories = useMemo(() => {
    const set = new Set(items.map((item) => item.category || "Other"));
    return Array.from(set).sort((a, b) => {
      if (a === "Other") return 1;
      if (b === "Other") return -1;
      return a.localeCompare(b);
    });
  }, [items]);

  const visibleItems = useMemo(() => {
    const search = debouncedSearch.trim().toLowerCase();
    return items
      .filter((item) => !search || item.ingredient.toLowerCase().includes(search))
      .filter((item) => !selectedCategory || (item.category || "Other") === selectedCategory)
      .sort((a, b) => {
        const aChecked = checked.has(a.ingredient);
        const bChecked = checked.has(b.ingredient);
        if (aChecked !== bChecked) return aChecked ? 1 : -1;
        return a.ingredient.localeCompare(b.ingredient);
      });
  }, [items, debouncedSearch, selectedCategory, checked]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-xl px-4 py-6 space-y-3">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (generatedAt === null) {
    return (
      <div className="mx-auto max-w-xl px-4 py-12 text-center">
        <ShoppingCart className="size-10 mx-auto text-muted-foreground mb-3" />
        <p className="text-sm text-muted-foreground">
          No shopping list yet. Create one from the meal planner to see it here.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-4 space-y-4">
      <div>
        <h1 className="text-xl font-serif text-primary">Shopping List</h1>
        <p className="text-xs text-muted-foreground">
          Generated {formatDistanceToNow(generatedAt, { addSuffix: true })}
        </p>
      </div>

      <SearchBar searchString={searchString} onSearchChange={setSearchString} />

      <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-4 px-4">
        <button onClick={() => setSelectedCategory(null)}>
          <Badge
            variant={selectedCategory === null ? "default" : "secondary"}
            className="cursor-pointer whitespace-nowrap"
          >
            All
          </Badge>
        </button>
        {categories.map((category) => (
          <button key={category} onClick={() => setSelectedCategory(category)}>
            <Badge
              variant={selectedCategory === category ? "default" : "secondary"}
              className="cursor-pointer whitespace-nowrap"
            >
              {category}
            </Badge>
          </button>
        ))}
      </div>

      {visibleItems.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">
          No items match your search.
        </p>
      ) : (
        <ul className="space-y-1">
          {visibleItems.map((item) => (
            <ShoppingListRow
              key={item.ingredient}
              item={item}
              checked={checked.has(item.ingredient)}
              onToggle={() => toggleChecked(item.ingredient)}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

function ShoppingListRow({
  item,
  checked,
  onToggle,
}: {
  item: GetMiseShoppingListActive200ItemsItem;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <li>
      <label
        className={cn(
          "flex items-start gap-3 rounded-md px-2 py-2.5 hover:bg-secondary/40 cursor-pointer",
          checked && "opacity-50"
        )}
      >
        <Checkbox
          checked={checked}
          onCheckedChange={onToggle}
          className="mt-0.5"
        />
        <div className="flex-1 min-w-0">
          <div className="flex justify-between gap-2">
            <span className={cn("text-sm text-foreground", checked && "line-through")}>
              {item.ingredient}
            </span>
            <span className="text-sm text-muted-foreground shrink-0">
              {item.quantities.map(formatQuantity).filter(Boolean).join(" + ")}
            </span>
          </div>
          {item.meals && item.meals.length > 0 && (
            <div className="text-xs text-muted-foreground">{item.meals.join(", ")}</div>
          )}
        </div>
      </label>
    </li>
  );
}
