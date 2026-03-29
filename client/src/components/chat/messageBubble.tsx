type Message = {
  id: number;
  text: string;
  time: string;
  isOwn: boolean;
};

type MessageBubbleProps = { message: Message; isOwn: boolean };

export default function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  return (
    <div
      className={`flex w-full mb-4 ${isOwn ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[75%] px-4 py-2 rounded-2xl shadow-sm ${
          isOwn
            ? "bg-primary text-white rounded-tr-sm"
            : "bg-white/10 text-text-primary rounded-tl-sm border border-white/5"
        }`}
      >
        <p className="text-sm">{message.text}</p>
        <span
          className={`text-[10px] block mt-1 ${isOwn ? "text-indigo-200 text-right" : "text-text-secondary"}`}
        >
          {message.time}
        </span>
      </div>
    </div>
  );
}
