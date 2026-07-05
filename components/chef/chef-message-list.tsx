import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";
import type { ChatMessage } from "@/core/chef/types";
import { ChefRecipeCard } from "./chef-recipe-card";

export function ChefMessageList({
  messages,
  isSending,
}: {
  messages: ChatMessage[];
  isSending: boolean;
}) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSending]);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-6 sm:px-6">
        {messages.map((message, messageIndex) => (
          <div
            key={messageIndex}
            className={cn(
              "flex flex-col gap-3",
              message.role === "user" ? "items-end" : "items-start"
            )}
          >
            {message.content.map((block, blockIndex) =>
              block.type === "text" ? (
                <div
                  key={blockIndex}
                  className={cn(
                    "max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "border border-border bg-card"
                  )}
                >
                  {block.text}
                </div>
              ) : (
                <ChefRecipeCard key={blockIndex} recipe={block.recipe} />
              )
            )}
          </div>
        ))}
        {isSending && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Spinner />
            Chef is thinking…
          </div>
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
