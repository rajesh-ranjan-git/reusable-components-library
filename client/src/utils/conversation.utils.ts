import { staticImagesConfig } from "@/config/common.config";
import { ConversationDisplayType } from "@/types/types/conversation.types";
import { LoggedInUserType } from "@/types/types/auth.types";
import {
  ConversationResponseType,
  NormalizeConversationResponseType,
} from "@/types/types/response.types";
import {
  MessageDisplayType,
  MessageResponseType,
} from "@/types/types/message.types";
import { UserProfileType } from "@/types/types/profile.types";
import { formatTime } from "@/utils/date.utils";
import { getFullName } from "@/helpers/profile.helpers";

const getInitials = (value: string) =>
  value
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

export const normalizeConversationResponse = (
  conversation: NormalizeConversationResponseType,
): ConversationResponseType => {
  const groupSettings = conversation.groupSettings;

  return {
    ...conversation,
    conversationId:
      conversation.conversationId ?? conversation.id ?? conversation._id ?? "",
    groupSettings: groupSettings
      ? {
          ...groupSettings,
          groupName: groupSettings.groupName ?? "",
          groupAvatar: groupSettings.groupAvatar ?? null,
        }
      : null,
  };
};

export const getConversationDisplay = (
  conversation: ConversationResponseType,
  loggedInUser: LoggedInUserType,
): ConversationDisplayType => {
  const currentUserId = loggedInUser?.userId;
  const otherParticipants = conversation.participants.filter(
    (participant) => participant.user.userId !== currentUserId,
  );
  const currentParticipant = conversation.participants.find(
    (participant) => participant.user.userId === currentUserId,
  );

  const fallbackParticipant =
    otherParticipants[0] ?? conversation.participants[0] ?? null;
  const isGroup = conversation.type !== "direct";
  const groupName = conversation.groupSettings?.groupName;
  const title = isGroup
    ? groupName || `${conversation.activeParticipantCount} members`
    : fallbackParticipant?.user.fullName ||
      fallbackParticipant?.user.userName ||
      "Unknown user";

  const subtitle =
    conversation.lastMessage?.content ||
    (isGroup
      ? otherParticipants
          .map((participant) => participant.user.fullName)
          .join(", ")
      : fallbackParticipant?.user.currentJobRole) ||
    "No messages yet";

  const isOnline = isGroup
    ? conversation.activeParticipantCount > 1
    : fallbackParticipant?.user.status === "active";

  return {
    conversation,
    id: conversation.conversationId,
    title,
    subtitle,
    avatar:
      (isGroup
        ? conversation.groupSettings?.groupAvatar
        : fallbackParticipant?.user.avatar) ||
      staticImagesConfig.avatarPlaceholder.src,
    isOnline,
    lastActivity: formatTime(
      conversation.lastMessage?.sentAt ?? conversation.updatedAt,
    ),
    unreadCount: currentParticipant?.unreadCount ?? 0,
    participantsLabel: isGroup
      ? `${conversation.activeParticipantCount} members`
      : isOnline
        ? "Online"
        : "Offline",
    otherParticipants,
  };
};

const getMessageSenderId = (sender: UserProfileType) => {
  if (typeof sender === "string") return sender;

  return sender.userId ?? "";
};

const getMessagePreview = (message: MessageResponseType) => {
  if (message.contentType === "deleted" || message.deletedAt) {
    return "This message was deleted";
  }

  if (message.contentType === "text") return message.content;

  return `[${message.contentType}]`;
};

export const getMessageDisplay = (
  message: MessageResponseType,
  loggedInUser: LoggedInUserType,
): MessageDisplayType => {
  const senderId = getMessageSenderId(message.sender);
  const isDeleted = message.isDeleted || message.contentType === "deleted";

  return {
    messageId:
      message.messageId ?? message.id ?? `${message.createdAt}-${senderId}`,
    content: getMessagePreview(message),
    contentType: message.contentType,
    time: formatTime(message.createdAt),
    senderName:
      senderId === loggedInUser?.userId ? "You" : getFullName(message.sender),
    isOwn: senderId === loggedInUser?.userId,
    isEdited: Boolean(message.isEdited || message.editHistory?.length),
    isDeleted,
  };
};

export const getAvatarFallback = (title: string) => getInitials(title) || "U";
