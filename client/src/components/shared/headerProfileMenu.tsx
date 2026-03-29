import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useRouter } from "next/navigation";
import { FiCheckCircle } from "react-icons/fi";
import {
  LuCreditCard,
  LuLogOut,
  LuMessageSquare,
  LuSettings,
  LuUser,
} from "react-icons/lu";
import { FaHome } from "react-icons/fa";

type HeaderProfileMenuProps = {
  isOpen: boolean;
  onClose: () => void;
  positionClass?: string;
};

export default function HeaderProfileMenu({
  isOpen,
  onClose,
  positionClass = "top-full right-0 mt-3",
}: HeaderProfileMenuProps) {
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

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.15 }}
          className={`absolute ${positionClass} w-60 bg-white/95 dark:bg-[#0B0F1A]/95 backdrop-blur-2xl border border-black/10 dark:border-white/10 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.1)] dark:shadow-[0_0_40px_rgba(0,0,0,0.6)] z-50 py-2 flex flex-col`}
        >
          {/* User Preview */}
          <div className="flex items-center gap-3 mb-2 px-4 py-3 border-black/10 dark:border-white/10 border-b">
            <img
              src="https://i.pravatar.cc/150?u=devmatch"
              className="border border-black/10 dark:border-white/10 rounded-lg w-10 h-10 object-cover"
              alt="user"
            />
            <div className="min-w-0">
              <p className="font-semibold text-text-primary text-sm truncate">
                Alex Developer
              </p>
              <p className="flex items-center gap-1 mt-0.5 text-text-secondary text-xs">
                <FiCheckCircle size={12} className="text-primary shrink-0" />{" "}
                <span className="truncate">Pro Member</span>
              </p>
            </div>
          </div>

          <button
            onClick={() => handleNavigation("/profile")}
            className="flex items-center gap-3 hover:bg-black/5 dark:hover:bg-white/10 px-4 py-2 w-full text-text-primary text-sm text-left transition-colors"
          >
            <LuUser size={16} className="text-text-secondary" />
            View Profile
          </button>

          <button
            onClick={() => handleNavigation("/discover")}
            className="flex items-center gap-3 hover:bg-black/5 dark:hover:bg-white/10 px-4 py-2 w-full text-text-primary text-sm text-left transition-colors"
          >
            <FaHome size={16} className="text-text-secondary" />
            Discover
          </button>

          <button
            onClick={() => handleNavigation("/chat")}
            className="flex items-center gap-3 hover:bg-black/5 dark:hover:bg-white/10 px-4 py-2 w-full text-text-primary text-sm text-left transition-colors"
          >
            <LuMessageSquare size={16} className="text-text-secondary" />
            Chats
          </button>

          <button
            onClick={() => handleNavigation("/subscription")}
            className="flex items-center gap-3 hover:bg-black/5 dark:hover:bg-white/10 px-4 py-2 w-full text-text-primary text-sm text-left transition-colors"
          >
            <LuCreditCard size={16} className="text-text-secondary" />
            Subscriptions
          </button>

          <div className="bg-black/10 dark:bg-white/10 my-2 w-full h-px" />

          <button
            onClick={onClose}
            className="flex items-center gap-3 hover:bg-black/5 dark:hover:bg-white/10 px-4 py-2 w-full text-text-primary text-sm text-left transition-colors"
          >
            <LuSettings size={16} className="text-text-secondary" />
            Account Settings
          </button>

          <button
            onClick={() => handleNavigation("/")}
            className="group flex items-center gap-3 hover:bg-red-50 dark:hover:bg-red-500/10 px-4 py-2 w-full text-red-500 text-sm text-left transition-colors"
          >
            <LuLogOut
              size={16}
              className="group-hover:text-red-500 transition-colors"
            />
            Sign Out
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
