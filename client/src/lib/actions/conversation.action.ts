import { ApiErrorResponseType, ApiResponseType } from "@/types/types/api.types";
import { api } from "@/lib/api/apiHandler";
import { apiUrls } from "@/lib/api/apiUtils";

export const fetchConversationsList = async (): Promise<ApiResponseType> => {
  try {
    return await api.get(apiUrls.conversation.actionConversations, {
      requireAuth: true,
    });
  } catch (error) {
    return error as ApiErrorResponseType;
  }
};

export const fetchDirectConversation = async (
  userName: string,
): Promise<ApiResponseType> => {
  try {
    return await api.post(
      `${apiUrls.conversation.directConversation}/${userName}`,
      {},
      { requireAuth: true },
    );
  } catch (error) {
    return error as ApiErrorResponseType;
  }
};

export const fetchConversationMessages = async (
  conversationId: string,
): Promise<ApiResponseType> => {
  try {
    return await api.get(
      `${apiUrls.conversation.actionMessage}/${conversationId}/messages`,
      { requireAuth: true },
    );
  } catch (error) {
    return error as ApiErrorResponseType;
  }
};

export const sendConversationMessage = async (
  conversationId: string,
  content: string,
): Promise<ApiResponseType> => {
  try {
    return await api.post(
      `${apiUrls.conversation.actionMessage}/${conversationId}/message`,
      {
        conversationId,
        contentType: "text",
        content,
      },
      { requireAuth: true },
    );
  } catch (error) {
    return error as ApiErrorResponseType;
  }
};
