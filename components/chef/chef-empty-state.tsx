import { ChefHat } from "lucide-react";
import { Button } from "@/components/ui/button";

const EXAMPLE_PROMPTS = [
  "Find me a quick weeknight chicken curry",
  "What can I make with chicken, rice and broccoli?",
  "Add my lasagne to Wednesday's meal plan",
  "Suggest 3 dinners for this week from my saved recipes",
];

export function ChefEmptyState({
  onExampleClick,
}: {
  onExampleClick: (text: string) => void;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
        <ChefHat className="size-7" />
      </div>
      <div className="flex flex-col gap-1">
        <h1 className="font-serif text-2xl text-foreground">Chef</h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          Ask me to find recipes online, search your own collection, or
          update your meal plan.
        </p>
      </div>
      <div className="flex max-w-md flex-wrap justify-center gap-2">
        {EXAMPLE_PROMPTS.map((prompt) => (
          <Button
            key={prompt}
            variant="outline"
            size="sm"
            className="h-auto whitespace-normal rounded-full py-2 text-left"
            onClick={() => onExampleClick(prompt)}
          >
            {prompt}
          </Button>
        ))}
      </div>
    </div>
  );
}
