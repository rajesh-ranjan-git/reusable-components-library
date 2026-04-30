import { ConversationResponseType } from "@/types/types/response.types";

export interface ConversationProps {
  params: {
    userName: string;
  };
}

export interface ConversationPageProps {
  userName?: string;
}

export interface ConversationListProps {
  selectedConversationId: string | null;
  onSelectConversation: (conversation: ConversationResponseType) => void;
}

export interface ConversationWindowProps {
  conversation: ConversationResponseType | null;
  onBack: () => void;
}
