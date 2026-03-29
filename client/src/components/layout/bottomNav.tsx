"use client";

import { useRouter } from "next/navigation";
import { LuCompass, LuMessageSquare, LuUser } from "react-icons/lu";

export default function BottomNav({ activeTab = "chats", hidden = false }) {
  const router = useRouter();
  if (hidden) return null;

  const tabs = [
    { id: "discover", icon: LuCompass, label: "Discover", path: "/discover" },
    {
      id: "chats",
      icon: LuMessageSquare,
      label: "Chats",
      badge: 3,
      path: "/chat",
    },
    { id: "profile", icon: LuUser, label: "Profile", path: "/profile" },
  ];

  return (
    <div className="sm:hidden right-0 bottom-0 left-0 z-40 fixed flex justify-between items-center bg-surface backdrop-blur-lg px-6 pt-2 pb-4 pb-safe border-white/10 border-t">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => router.push(tab.path)}
            className={`flex flex-col items-center gap-1 relative ${isActive ? "text-primary" : "text-text-secondary hover:text-white transition-colors"}`}
          >
            <Icon size={24} className={isActive ? "fill-primary/20" : ""} />
            <span className="font-medium text-[10px]">{tab.label}</span>
            {tab.badge && (
              <span className="-top-1 -right-2 absolute flex justify-center items-center bg-red-500 rounded-full w-4 h-4 text-[10px] text-white">
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
