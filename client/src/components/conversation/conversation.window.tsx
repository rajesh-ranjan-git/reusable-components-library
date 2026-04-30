import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  KeyboardEvent,
} from "react";
import Image from "next/image";
import { Socket } from "socket.io-client";
import {
  LuArrowLeft,
  LuMessageSquare,
  LuPaperclip,
  LuPhone,
  LuSend,
  LuVideo,
} from "react-icons/lu";
import { IoMdMore } from "react-icons/io";
import { ConversationWindowProps } from "@/types/props/conversation.props";
import {
  ConversationResponseType,
  MessageResponseDataType,
  MessagesResponseType,
} from "@/types/types/response.types";
import { MessageResponseType } from "@/types/types/message.types";
import { useAppStore } from "@/store/store";
import { getConversationDisplay } from "@/utils/conversation.utils";
import { getMessageDisplay } from "@/utils/message.utils";
import {
  fetchConversationMessages,
  sendConversationMessage,
} from "@/lib/actions/conversation.action";
import { createSocketConnection } from "@/socket/socket";
import { UserProfileType } from "@/types/types/profile.types";
import MessageBubble from "@/components/conversation/message.bubble";
import FormTextarea from "@/components/forms/shared/form.textarea";

const ConversationWindow = ({
  conversation,
  onBack,
}: ConversationWindowProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const activeConversationIdRef = useRef<string | null>(null);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<MessageResponseType[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const loggedInUser = useAppStore((state) => state.loggedInUser);
  const accessToken = useAppStore((state) => state.accessToken);

  const conversationDisplay = useMemo(
    () =>
      conversation ? getConversationDisplay(conversation, loggedInUser) : null,
    [conversation, loggedInUser],
  );
  const targetUserId = useMemo(() => {
    if (!conversation || conversation.type !== "direct") return null;

    return (
      conversation.participants.find(
        (participant) => participant.user.userId !== loggedInUser?.userId,
      )?.user.userId ?? null
    );
  }, [conversation, loggedInUser?.userId]);
  const displayMessages = useMemo(
    () => messages.map((message) => getMessageDisplay(message, loggedInUser)),
    [messages, loggedInUser],
  );

  const upsertMessage = useCallback((message: MessageResponseType) => {
    const incomingId = message.messageId ?? message.id;

    setMessages((currentMessages) => {
      if (
        activeConversationIdRef.current &&
        message.conversation !== activeConversationIdRef.current
      ) {
        return currentMessages;
      }

      const matchedIndex = currentMessages.findIndex((currentMessage) => {
        const currentId = currentMessage.messageId ?? currentMessage.id;

        return (
          (incomingId && currentId === incomingId) ||
          (message.clientMessageId &&
            currentMessage.clientMessageId === message.clientMessageId)
        );
      });

      if (matchedIndex === -1) return [...currentMessages, message];

      return currentMessages.map((currentMessage, index) =>
        index === matchedIndex ? message : currentMessage,
      );
    });
  }, []);

  const getConversationMessages = useCallback(
    async (conversation: ConversationResponseType) => {
      setIsLoadingMessages(true);

      const fetchConversationMessagesResponse = await fetchConversationMessages(
        conversation.conversationId,
      );

      if (
        fetchConversationMessagesResponse.success &&
        fetchConversationMessagesResponse.data
      ) {
        const data =
          fetchConversationMessagesResponse.data as MessagesResponseType;

        setMessages(data.messages);
      } else {
        setMessages([]);
      }

      setIsLoadingMessages(false);
    },
    [],
  );

  useEffect(() => {
    activeConversationIdRef.current = conversation?.conversationId ?? null;

    if (!conversation?.conversationId) return;

    void Promise.resolve().then(() => getConversationMessages(conversation));
  }, [conversation, getConversationMessages]);

  useEffect(() => {
    if (!accessToken) return;

    const socket = createSocketConnection({ token: accessToken });
    socketRef.current = socket;

    socket.on("received-message", upsertMessage);
    socket.on("received-group-message", upsertMessage);

    return () => {
      socket.off("received-message", upsertMessage);
      socket.off("received-group-message", upsertMessage);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [accessToken, upsertMessage]);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !conversation?.conversationId) return;

    if (conversation.type === "direct" && targetUserId) {
      socket.emit("join-chat", { targetUserId });
      return;
    }

    socket.emit("join-group-chat", {
      conversationId: conversation.conversationId,
    });

    return () => {
      socket.emit("leave-group-chat", {
        conversationId: conversation.conversationId,
      });
    };
  }, [
    accessToken,
    conversation?.conversationId,
    conversation?.type,
    targetUserId,
  ]);

  const handleInput = () => {
    const el = textareaRef.current;
    if (!el) return;

    el.style.height = "auto";

    const lineHeight = parseInt(window.getComputedStyle(el).lineHeight);

    const maxHeight = lineHeight * 3;

    el.style.height = Math.min(el.scrollHeight, maxHeight) + "px";
    setDraft(el.value);
  };

  const resetHeight = () => {
    const el = textareaRef.current;
    if (!el) return;

    el.style.height = "auto";
  };

  const emitMessage = (message: MessageResponseType) => {
    const socket = socketRef.current;
    if (!socket || !conversation) return;

    if (conversation.type === "direct" && targetUserId) {
      socket.emit("send-message", { targetUserId, message });
      return;
    }

    socket.emit("send-group-message", {
      conversationId: conversation.conversationId,
      message,
    });
  };

  const createPendingMessage = (content: string): MessageResponseType => {
    const now = new Date().toISOString();
    const clientMessageId = `local-${crypto.randomUUID()}`;
    const sender = {
      userId: loggedInUser?.userId ?? "",
      status: loggedInUser?.status,
      email: loggedInUser?.email ?? "",
      emailVerified: true,
      phoneVerified: false,
      userName: loggedInUser?.userName ?? "",
      firstName: loggedInUser?.firstName,
      lastName: loggedInUser?.lastName,
      fullName: loggedInUser?.fullName,
      avatar: loggedInUser?.avatar,
      createdAt: now,
      updatedAt: now,
    } as UserProfileType;

    return {
      id: clientMessageId,
      messageId: clientMessageId,
      clientMessageId,
      conversation: conversation?.conversationId ?? "",
      sender,
      contentType: "text",
      content,
      attachments: [],
      location: null,
      replyTo: null,
      forwardedFrom: null,
      receipts: [],
      reactions: [],
      deletedAt: null,
      editHistory: [],
      callData: null,
      createdAt: now,
      updatedAt: now,
      deliveryStatus: "sending",
    };
  };

  const persistAndEmitMessage = async (
    clientMessageId: string,
    content: string,
  ) => {
    if (!conversation?.conversationId) return;

    setIsSending(true);
    setMessages((currentMessages) =>
      currentMessages.map((message) =>
        message.clientMessageId === clientMessageId ||
        message.messageId === clientMessageId
          ? {
              ...message,
              deliveryStatus: "sending",
              errorMessage: undefined,
            }
          : message,
      ),
    );

    const response = await sendConversationMessage(
      conversation.conversationId,
      content,
    );

    if (response.success && response.data) {
      const data = response.data as MessageResponseDataType;
      if (data.message) {
        const savedMessage = {
          ...data.message,
          clientMessageId,
          deliveryStatus: "sent" as const,
        };

        upsertMessage(savedMessage);
        emitMessage(savedMessage);
      }
    } else {
      setMessages((currentMessages) =>
        currentMessages.map((message) =>
          message.clientMessageId === clientMessageId ||
          message.messageId === clientMessageId
            ? {
                ...message,
                deliveryStatus: "failed",
                errorMessage: response.message ?? "Message could not be saved.",
              }
            : message,
        ),
      );
    }

    setIsSending(false);
  };

  const handleSend = async () => {
    const content = draft.trim();
    if (!content || !conversation?.conversationId || isSending) return;

    const pendingMessage = createPendingMessage(content);
    upsertMessage(pendingMessage);
    setDraft("");
    if (textareaRef.current) textareaRef.current.value = "";
    resetHeight();

    await persistAndEmitMessage(pendingMessage.clientMessageId ?? "", content);
  };

  const handleResend = async (messageId: string) => {
    if (isSending) return;

    const failedMessage = messages.find(
      (message) =>
        message.messageId === messageId ||
        message.clientMessageId === messageId,
    );

    if (!failedMessage) return;

    await persistAndEmitMessage(
      failedMessage.clientMessageId ?? failedMessage.messageId ?? messageId,
      failedMessage.content,
    );
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!conversation) {
    return (
      <div className="hidden relative md:flex flex-col flex-1 justify-center items-center gap-2">
        <div className="flex justify-center items-center mb-4 rounded-full w-16 h-16 text-text-secondary glass">
          <LuMessageSquare size={32} />
        </div>
        <h3>Your Messages</h3>
        <p className="text-text-secondary">
          Select a chat to start messaging...
        </p>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col flex-1 w-full h-full">
      <div className="z-(--z-raised) flex justify-between items-center px-4 glass-nav h-16">
        <div className="flex items-center gap-2 md:gap-3">
          <button
            onClick={onBack}
            className="md:hidden -m-2 p-0 pr-2 text-text-secondary hover:text-text-primary transition-colors"
          >
            <LuArrowLeft size={28} />
          </button>
          <div className="relative shrink-0">
            <Image
              src={conversationDisplay?.avatar ?? ""}
              alt={conversationDisplay?.title ?? "Conversation"}
              width={100}
              height={100}
              className="shadow-glass rounded-full w-10 h-10 object-cover shrink-0"
            />
            {conversationDisplay?.isOnline ? (
              <span className="right-0 bottom-0 absolute bg-green-500 border-[#0B0F1A] border-2 rounded-full w-3 h-3"></span>
            ) : (
              <span className="right-0 bottom-0 absolute bg-gray-500 border-[#0B0F1A] border-2 rounded-full w-3 h-3"></span>
            )}
          </div>
          <div>
            <h6 className="font-medium text-text-primary truncate">
              {conversationDisplay?.title}
            </h6>
            <p
              className={`text-xs ${conversationDisplay?.isOnline ? "text-green-500" : "text-gray-500"}`}
            >
              {conversationDisplay?.participantsLabel}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 md:gap-3 text-text-secondary">
          <button className="p-2 rounded-lg text-text-secondary hover:text-text-primary glass">
            <LuPhone size={20} />
          </button>
          <button className="p-2 rounded-lg text-text-secondary hover:text-text-primary glass">
            <LuVideo size={20} />
          </button>
          <button className="p-2 rounded-lg text-text-secondary hover:text-text-primary glass">
            <IoMdMore size={20} />
          </button>
        </div>
      </div>

      <div className="z-(--z-base) relative flex flex-col flex-1 p-4 pb-20 md:pb-4 overflow-y-auto">
        {isLoadingMessages ? (
          <div className="flex flex-1 justify-center items-center text-text-secondary text-sm">
            Loading messages...
          </div>
        ) : displayMessages.length > 0 ? (
          displayMessages.map((message) => (
            <MessageBubble
              key={message.messageId}
              message={message}
              onResend={handleResend}
            />
          ))
        ) : (
          <div className="flex flex-1 justify-center items-center text-text-secondary text-sm">
            No messages yet.
          </div>
        )}
      </div>

      <div className="bottom-0 z-(--z-raised) md:static gap-2 md:gap-3 flex items-center absolute p-2 pb-1 glass-nav border-glass-border border-b-0 border-t border w-full">
        <button className="p-2 rounded-full h-max text-text-secondary hover:text-text-primary glass">
          <LuPaperclip size={18} />
        </button>

        <div className="w-full">
          <FormTextarea
            rows={1}
            ref={textareaRef}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            disabled={isSending}
            className="[&::-webkit-scrollbar]:hidden mt-1 pl-4 h-auto [-ms-overflow-style:none] overflow-y-auto resize-none [scrollbar-width:none]"
          />
        </div>

        <button
          onClick={handleSend}
          disabled={!draft.trim() || isSending}
          className="disabled:opacity-50 p-2 rounded-full h-max text-text-secondary hover:text-text-primary disabled:cursor-not-allowed glass"
        >
          <LuSend size={18} />
        </button>
      </div>
    </div>
  );
};

export default ConversationWindow;
