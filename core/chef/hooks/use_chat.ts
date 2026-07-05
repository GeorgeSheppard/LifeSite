import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "@/src/lib/axios";
import type { ChatMessage } from "../types";

interface ChatResponse {
  message: ChatMessage;
}

/**
 * Sends the full conversation history to Chef and returns the assistant's reply.
 * Hand-written (not Orval-generated) until the backend's OpenAPI spec is
 * redeployed and `yarn generate:api` is re-run — swap to a generated hook then.
 */
export const useSendChatMessage = () => {
  return useMutation({
    mutationFn: (messages: ChatMessage[]) =>
      axiosInstance<ChatResponse>({
        url: "/mise/chat",
        method: "POST",
        data: { messages },
      }),
  });
};
