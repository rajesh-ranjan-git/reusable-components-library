import { MessageBubbleProps } from "@/types/props/message.props";

const MessageBubble = ({ message }: MessageBubbleProps) => {
  return (
    <div
      className={`flex w-full mb-3 ${message.isOwn ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[75%] px-4 py-2 rounded-2xl shadow-sm ${
          message.isOwn
            ? "bg-status-success-bg text-status-success-text rounded-tr-sm border border-status-success-border"
            : "bg-status-info-bg text-status-info-text border-status-info-border rounded-tl-sm border "
        } ${message.isDeleted ? "opacity-75 italic" : ""}`}
      >
        {!message.isOwn && (
          <p className="mb-1 font-medium text-[11px]">{message.senderName}</p>
        )}
        <p className="text-sm wrap-break-word whitespace-pre-wrap">
          {message.content}
        </p>
        <span
          className={`text-[10px] block text-text-secondary mt-1 ${message.isOwn ? "text-right" : ""}`}
        >
          {message.isEdited && !message.isDeleted ? "Edited - " : ""}
          {message.time}
        </span>
      </div>
    </div>
  );
};

export default MessageBubble;
