import { useEffect, useMemo, useRef, useState, KeyboardEvent } from "react";
import Image from "next/image";
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
import {
  getConversationDisplay,
  getMessageDisplay,
} from "@/utils/conversation.utils";
import {
  fetchConversationMessages,
  sendConversationMessage,
} from "@/lib/actions/conversation.action";
import MessageBubble from "@/components/conversation/message.bubble";
import FormTextarea from "@/components/forms/shared/form.textarea";

const ConversationWindow = ({
  conversation,
  onBack,
}: ConversationWindowProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<MessageResponseType[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const loggedInUser = useAppStore((state) => state.loggedInUser);

  const conversationDisplay = useMemo(
    () =>
      conversation ? getConversationDisplay(conversation, loggedInUser) : null,
    [conversation, loggedInUser],
  );
  const displayMessages = useMemo(
    () => messages.map((message) => getMessageDisplay(message, loggedInUser)),
    [messages, loggedInUser],
  );

  const getConversationMessages = async (
    conversation: ConversationResponseType,
  ) => {
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
  };

  useEffect(() => {
    if (!conversation?.conversationId) return;

    getConversationMessages(conversation);
  }, [conversation?.conversationId]);

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

  const handleSend = async () => {
    const content = draft.trim();
    if (!content || !conversation?.conversationId || isSending) return;

    setIsSending(true);

    const response = await sendConversationMessage(
      conversation.conversationId,
      content,
    );

    if (response.success && response.data) {
      const data = response.data as MessageResponseDataType;
      if (data.message) {
        setMessages((currentMessages) => [...currentMessages, data.message]);
      }
    }

    setDraft("");
    if (textareaRef.current) textareaRef.current.value = "";
    resetHeight();
    setIsSending(false);
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
            <MessageBubble key={message.messageId} message={message} />
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
