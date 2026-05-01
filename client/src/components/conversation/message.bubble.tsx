import { LuCheck, LuCheckCheck, LuClock3 } from "react-icons/lu";
import { MessageBubbleProps } from "@/types/props/message.props";

const MessageBubble = ({ message, onResend }: MessageBubbleProps) => {
  const isFailed = message.deliveryStatus === "failed";
  const isSending = message.deliveryStatus === "sending";
  const isSeen = message.deliveryStatus === "seen";
  const isDelivered = message.deliveryStatus === "delivered";

  const renderDeliveryStatus = () => {
    if (!message.isOwn || isFailed) return null;

    if (isSending) {
      return <LuClock3 size={12} className="text-text-secondary" />;
    }

    if (isDelivered || isSeen) {
      return (
        <LuCheckCheck
          size={14}
          className={isSeen ? "text-status-info-text" : "text-text-secondary"}
        />
      );
    }

    return <LuCheck size={13} className="text-text-secondary" />;
  };

  return (
    <div
      className={`flex w-full mb-3 ${message.isOwn ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[75%] px-4 py-2 rounded-2xl shadow-sm ${
          isFailed
            ? "bg-status-error-bg text-status-error-text border border-status-error-border rounded-tr-sm"
            : message.isOwn
              ? "bg-status-success-bg text-status-success-text rounded-tr-sm border border-status-success-border"
              : "bg-status-info-bg text-status-info-text border-status-info-border rounded-tl-sm border "
        } ${message.isDeleted ? "opacity-75 italic" : ""}`}
      >
        {!message.isOwn && (
          <p className="mb-1 font-medium text-[11px]">{message.senderName}</p>
        )}
        <p className="text-sm whitespace-pre-wrap wrap-anywhere">
          {message.content}
        </p>
        <div
          className={`flex items-center gap-1 mt-1 text-[10px] text-text-secondary ${
            message.isOwn ? "justify-between" : "justify-start"
          }`}
        >
          <span
            className={`items-center min-w-0 ${message.isOwn ? "flex" : "hidden"}`}
          >
            {renderDeliveryStatus()}
          </span>
          <span>
            {message.isEdited && !message.isDeleted ? "Edited - " : ""}
            {message.time}
            {isFailed ? " - Failed" : ""}
          </span>
        </div>
        {isFailed && message.isOwn && (
          <div className="flex justify-end items-center gap-2 mt-2">
            <span className="text-[10px] text-text-secondary">
              {message.errorMessage ?? "Message was not saved."}
            </span>

            <button
              type="button"
              onClick={() => onResend?.(message.messageId)}
              className="px-2 py-1 rounded-md font-medium text-[11px] hover:text-text-primary glass"
            >
              Resend
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
