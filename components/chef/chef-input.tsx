import { KeyboardEvent } from "react";
import { SendHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function ChefInput({
  value,
  onChange,
  onSend,
  disabled,
}: {
  value: string;
  onChange: (value: string) => void;
  onSend: (text: string) => void;
  disabled?: boolean;
}) {
  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      onSend(value);
    }
  };

  return (
    <div className="border-t border-border bg-card">
      <div className="mx-auto flex max-w-3xl items-end gap-2 px-4 py-3 sm:px-6">
        <Textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask Chef to find a recipe, edit your meal plan…"
          className="min-h-11 resize-none"
          rows={1}
        />
        <Button
          size="icon"
          onClick={() => onSend(value)}
          disabled={disabled || !value.trim()}
        >
          <SendHorizontal className="size-4" />
        </Button>
      </div>
    </div>
  );
}
