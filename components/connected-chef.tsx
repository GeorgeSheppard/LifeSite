import { useState } from "react";
import { useSendChatMessage } from "@/core/chef/hooks/use_chat";
import type { ChatMessage } from "@/core/chef/types";
import { ChefEmptyState } from "./chef/chef-empty-state";
import { ChefMessageList } from "./chef/chef-message-list";
import { ChefInput } from "./chef/chef-input";

export function ConnectedChef() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const sendMessage = useSendChatMessage();

  const handleSend = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || sendMessage.isLoading) return;

    const nextMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content: [{ type: "text", text: trimmed }] },
    ];
    setMessages(nextMessages);
    setDraft("");

    try {
      const response = await sendMessage.mutateAsync(nextMessages);
      setMessages([...nextMessages, response.message]);
    } catch {
      setMessages([
        ...nextMessages,
        {
          role: "assistant",
          content: [
            {
              type: "text",
              text: "Sorry, something went wrong reaching Chef. Please try again.",
            },
          ],
        },
      ]);
    }
  };

  return (
    <div className="flex h-full flex-col">
      {messages.length === 0 ? (
        <ChefEmptyState onExampleClick={handleSend} />
      ) : (
        <ChefMessageList messages={messages} isSending={sendMessage.isLoading} />
      )}
      <ChefInput
        value={draft}
        onChange={setDraft}
        onSend={handleSend}
        disabled={sendMessage.isLoading}
      />
    </div>
  );
}
