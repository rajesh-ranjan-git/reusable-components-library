import { MouseEvent, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useRouter } from "next/navigation";
import { LuHeart, LuMessageSquare, LuUserPlus } from "react-icons/lu";

type HeaderNotificationMenuProps = {
  isOpen: boolean;
  onClose: () => void;
  positionClass?: string;
};

export default function HeaderNotificationMenu({
  isOpen,
  onClose,
  positionClass = "top-full right-0 mt-3",
}: HeaderNotificationMenuProps) {
  const menuRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside: EventListener = (e) => {
      if (menuRef.current && menuRef.current.contains(e.target as Node)) {
        return;
      }

      onClose();
    };

    const timeoutId = setTimeout(() => {
      document.addEventListener("click", handleClickOutside);
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleNavigation = (path: string) => {
    router.push(path);
    onClose();
  };

  const notifications = [
    {
      id: 1,
      type: "match",
      text: "Sarah matched with you!",
      time: "2m ago",
      icon: LuHeart,
      color: "text-pink-500",
      path: "/chat",
    },
    {
      id: 2,
      type: "message",
      text: "Marcus sent you a message",
      time: "1h ago",
      icon: LuMessageSquare,
      color: "text-blue-400",
      path: "/chat",
    },
    {
      id: 3,
      type: "request",
      text: "Alex wants to connect",
      time: "2h ago",
      icon: LuUserPlus,
      color: "text-primary",
      path: "/profile",
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.15 }}
          className={`absolute ${positionClass} w-72 bg-white/95 dark:bg-[#0B0F1A]/95 backdrop-blur-2xl border border-black/10 dark:border-white/10 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.1)] dark:shadow-[0_0_40px_rgba(0,0,0,0.6)] z-50 py-1 flex flex-col`}
        >
          <div className="mb-1 px-4 py-3 border-black/10 dark:border-white/10 border-b">
            <h3 className="font-semibold text-text-primary">Notifications</h3>
          </div>

          <div className="max-h-75 overflow-y-auto custom-scrollbar">
            {notifications.length > 0 ? (
              notifications.map((notification) => {
                const Icon = notification.icon;
                return (
                  <button
                    key={notification.id}
                    onClick={() => handleNavigation(notification.path)}
                    className="flex items-start gap-3 hover:bg-black/5 dark:hover:bg-white/10 px-4 py-3 w-full text-left transition-colors"
                  >
                    <div className="bg-black/5 dark:bg-white/5 mt-0.5 p-1.5 border border-black/5 dark:border-white/5 rounded-full">
                      <Icon size={16} className={notification.color} />
                    </div>
                    <div className="flex-1">
                      <p className="text-text-primary text-sm leading-snug">
                        {notification.text}
                      </p>
                      <p className="mt-1 text-text-secondary text-xs">
                        {notification.time}
                      </p>
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="px-4 py-6 text-text-secondary text-sm text-center">
                No new notifications
              </div>
            )}
          </div>

          <div className="mt-1 py-1 border-black/10 dark:border-white/10 border-t">
            <button
              onClick={onClose}
              className="hover:bg-black/5 dark:hover:bg-white/10 px-4 py-3 w-full font-medium text-primary hover:text-indigo-400 text-xs text-center transition-colors"
            >
              Mark all as read
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
