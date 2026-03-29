import { Dispatch, SetStateAction } from "react";
import { LuSearch } from "react-icons/lu";

type Chat = {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
};

type ChatListProps = {
  selectedChatId: number | null;
  onSelectChat: (chat: Chat) => void;
};

const mockChats: Chat[] = [
  {
    id: 1,
    name: "Alice Cooper",
    avatar: "https://i.pravatar.cc/150?u=alice",
    lastMessage: "Hey, I checked out your recent PR!",
    time: "10:42 AM",
    unread: 2,
    online: true,
  },
  {
    id: 2,
    name: "Bob Smith",
    avatar: "https://i.pravatar.cc/150?u=bob",
    lastMessage: "Let's collaborate on that side project.",
    time: "Yesterday",
    unread: 0,
    online: false,
  },
  {
    id: 3,
    name: "Charlie Davis",
    avatar: "https://i.pravatar.cc/150?u=charlie",
    lastMessage: "Thanks for the help with React hooks.",
    time: "Tue",
    unread: 0,
    online: true,
  },
  {
    id: 4,
    name: "Charlie Davis",
    avatar: "https://i.pravatar.cc/150?u=charlie",
    lastMessage: "Thanks for the help with React hooks.",
    time: "Tue",
    unread: 0,
    online: true,
  },
  {
    id: 5,
    name: "Charlie Davis",
    avatar: "https://i.pravatar.cc/150?u=charlie",
    lastMessage: "Thanks for the help with React hooks.",
    time: "Tue",
    unread: 0,
    online: true,
  },
  {
    id: 6,
    name: "Charlie Davis",
    avatar: "https://i.pravatar.cc/150?u=charlie",
    lastMessage: "Thanks for the help with React hooks.",
    time: "Tue",
    unread: 0,
    online: true,
  },
  {
    id: 7,
    name: "Charlie Davis",
    avatar: "https://i.pravatar.cc/150?u=charlie",
    lastMessage: "Thanks for the help with React hooks.",
    time: "Tue",
    unread: 0,
    online: true,
  },
  {
    id: 8,
    name: "Charlie Davis",
    avatar: "https://i.pravatar.cc/150?u=charlie",
    lastMessage: "Thanks for the help with React hooks.",
    time: "Tue",
    unread: 0,
    online: true,
  },
  {
    id: 9,
    name: "Charlie Davis",
    avatar: "https://i.pravatar.cc/150?u=charlie",
    lastMessage: "Thanks for the help with React hooks.",
    time: "Tue",
    unread: 0,
    online: true,
  },
  {
    id: 10,
    name: "Charlie Davis",
    avatar: "https://i.pravatar.cc/150?u=charlie",
    lastMessage: "Thanks for the help with React hooks.",
    time: "Tue",
    unread: 0,
    online: true,
  },
];

export default function ChatList({
  selectedChatId,
  onSelectChat,
}: ChatListProps) {
  return (
    <div className="flex flex-col bg-surface md:bg-transparent border-black/10 dark:border-white/10 md:border-r w-full md:w-72 lg:w-80 h-full shrink-0">
      <div className="p-4 border-black/10 dark:border-white/10 border-b">
        <h2 className="mb-4 font-semibold text-text-primary text-xl">
          Messages
        </h2>
        <div className="relative">
          <LuSearch className="top-1/2 left-3 absolute w-4 h-4 text-text-secondary -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search messages..."
            className="bg-black/5 dark:bg-white/5 py-2 pr-4 pl-10 border border-black/10 focus:border-primary dark:border-white/10 rounded-lg focus:outline-none w-full placeholder-text-secondary text-text-primary text-sm transition-all"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {mockChats.map((chat) => (
          <button
            key={chat.id}
            onClick={() => onSelectChat(chat)}
            className={`w-full text-left p-4 flex gap-3 items-center border-b border-black/5 dark:border-white/5 transition-[background-color] duration-200 hover:bg-black/5 dark:hover:bg-white/5 ${selectedChatId === chat.id ? "bg-black/10 dark:bg-white/10" : ""}`}
          >
            <div className="relative shrink-0">
              <img
                src={chat.avatar}
                alt={chat.name}
                className="rounded-full w-12 h-12 object-cover"
              />
              {chat.online && (
                <span className="right-0 bottom-0 absolute bg-green-500 border-[#0B0F1A] border-2 rounded-full w-3 h-3"></span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="font-medium text-text-primary truncate">
                  {chat.name}
                </h3>
                <span className="ml-2 text-text-secondary text-xs shrink-0">
                  {chat.time}
                </span>
              </div>
              <p className="text-text-secondary text-sm truncate">
                {chat.lastMessage}
              </p>
            </div>
            {chat.unread > 0 && (
              <div className="flex justify-center items-center bg-primary rounded-full w-5 h-5 shrink-0">
                <span className="font-bold text-[10px] text-white">
                  {chat.unread}
                </span>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
