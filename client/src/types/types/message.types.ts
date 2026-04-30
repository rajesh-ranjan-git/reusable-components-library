import { UserProfileType } from "@/types/types/profile.types";

export type MessageContentType =
  | "text"
  | "image"
  | "video"
  | "audio"
  | "file"
  | "location"
  | "call"
  | "deleted";

export type MessageReceiptType = {
  user: string;
  deliveredAt: string | null;
  seenAt: string | null;
};

export type MessageReactionType = {
  user: string;
  emoji: string;
  reactedAt: string;
};

export type MessageAttachmentType = {
  url: string;
  mimeType: string;
  fileName: string | null;
  sizeBytes: number | null;
  thumbnailUrl: string | null;
  duration: number | null;
};

export type MessageLocationType = {
  latitude: number;
  longitude: number;
  label: string | null;
};

export type MessageEditHistoryType = {
  content: string;
  editedAt: string;
};

export type MessageCallDataType = {
  callType: "audio" | "video";
  duration: number;
  status: "completed" | "missed" | "rejected";
};

export type MessageDeliveryStatusType = "sending" | "sent" | "failed";

export type MessageResponseType = {
  id?: string;
  messageId?: string;
  clientMessageId?: string;

  conversation: string;
  sender: UserProfileType;

  contentType: MessageContentType;
  content: string;

  attachments: MessageAttachmentType[];
  location: MessageLocationType | null;

  replyTo: string | MessageResponseType | null;
  forwardedFrom: string | null;

  receipts: MessageReceiptType[];
  reactions: MessageReactionType[];

  deletedAt: string | null;

  editHistory: MessageEditHistoryType[];

  callData: MessageCallDataType | null;

  createdAt: string;
  updatedAt: string;

  isEdited?: boolean;
  isDeleted?: boolean;
  deliveryStatus?: MessageDeliveryStatusType;
  errorMessage?: string;
};

export type MessageDisplayType = {
  messageId: string;
  content: string;
  contentType: MessageContentType;
  time: string;
  senderName: string;
  isOwn: boolean;
  isEdited: boolean;
  isDeleted: boolean;
  deliveryStatus: MessageDeliveryStatusType;
  errorMessage?: string;
};
