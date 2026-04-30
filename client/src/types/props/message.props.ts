import { MessageDisplayType } from "@/types/types/message.types";

export interface MessageBubbleProps {
  message: MessageDisplayType;
  onResend?: (messageId: string) => void;
}
