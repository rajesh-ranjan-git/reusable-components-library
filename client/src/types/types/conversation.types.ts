import { UserProfileType } from "@/types/types/profile.types";
import { ConversationResponseType } from "@/types/types/response.types";
import { MessageContentType } from "@/types/types/message.types";

export type ConversationType = "direct" | "group" | "channel";

export type ConversationLastMessageType = {
  messageId: string;
  content: string;
  contentType: MessageContentType;
  sentBy: string;
  sentAt: string;
};

export type ConversationParticipantType = {
  user: UserProfileType;
  unreadCount: number;
  leftAt: string | null;
  mutedUntil: string | null;
  role: "member" | "admin" | "owner";
};

export type GroupSettingsType = {
  groupName: string;
  description: string;
  groupAvatar: string | null;
  sendPermission: "all" | "admins";
  editPermission: "all" | "admins";
  inviteLink: string | null;
  inviteLinkExpiry: string | null;
};

export type ConversationCallHistoryType = {
  callType: "audio" | "video";
  initiatedBy: string;
  startedAt: string;
  endedAt: string;
  duration: number;
  status: "completed" | "missed" | "rejected" | "failed";
};

export interface ConversationDisplayType {
  conversation: ConversationResponseType;
  id: string;
  title: string;
  subtitle: string;
  avatar: string;
  isOnline: boolean;
  lastActivity: string;
  unreadCount: number;
  participantsLabel: string;
  otherParticipants: ConversationParticipantType[];
}
