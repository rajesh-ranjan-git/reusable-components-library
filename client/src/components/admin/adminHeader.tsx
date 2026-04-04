import { Dispatch, MouseEvent, SetStateAction, useState } from "react";
import Image from "next/image";
import { LuBell, LuMenu, LuSearch } from "react-icons/lu";
import { staticImages } from "@/config/common.config";
import ThemeToggle from "@/components/theme/themeToggle";
import HeaderNotificationMenu from "@/components/shared/headerNotificationMenu";
import HeaderProfileMenu from "@/components/shared/headerProfileMenu";
import Link from "next/link";

export default function AdminHeader({
  isSidebarOpen,
  setIsSidebarOpen,
}: {
  isSidebarOpen: boolean;
  setIsSidebarOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationMenuOpen, setIsNotificationMenuOpen] = useState(false);

  const toggleProfileMenu = (e: MouseEvent) => {
    e.stopPropagation();

    if (isSidebarOpen) {
      setIsSidebarOpen(false);
    }

    setIsProfileMenuOpen(!isProfileMenuOpen);
    setIsNotificationMenuOpen(false);
  };

  const toggleNotificationMenu = (e: MouseEvent) => {
    e.stopPropagation();

    if (isSidebarOpen) {
      setIsSidebarOpen(false);
    }

    setIsNotificationMenuOpen(!isNotificationMenuOpen);
    setIsProfileMenuOpen(false);
  };

  return (
    <header className="top-0 z-(--z-sticky) sticky flex justify-between items-center px-2 md:px-6 h-16 glass-nav">
      <div className="flex items-center gap-2 md:gap-4">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="md:hidden px-0 py-1 text-text-secondary hover:text-text-primary transition-colors"
        >
          <LuMenu size={24} />
        </button>

        <Link href="/admin" className="group flex items-center gap-2">
          <h1 className="pt-1.5 font-arima md:text-3xl">Dashboard</h1>
        </Link>
      </div>

      <div className="hidden md:block relative flex-1 mx-6 max-w-md">
        <LuSearch className="top-1/2 left-3 absolute w-4 h-4 text-text-secondary -translate-y-1/2" />

        <input
          type="search"
          className="pl-9"
          placeholder="Search stats, users..."
        />
      </div>

      <div className="flex items-center gap-1.5 md:gap-4">
        <ThemeToggle />

        <div className="relative">
          <button
            onClick={toggleNotificationMenu}
            className={`hover:text-text-primary glass transition-colors relative p-1.5 rounded-lg ${isNotificationMenuOpen ? "text-text-primary" : "text-text-secondary"}`}
          >
            <LuBell size={20} />
            <span className="top-1.5 right-1.5 absolute bg-red-500 border border-bg rounded-full w-2 h-2"></span>
          </button>

          <HeaderNotificationMenu
            isOpen={isNotificationMenuOpen}
            onClose={() => setIsNotificationMenuOpen(false)}
          />
        </div>

        <div className="relative pt-1 md:pt-0">
          <button
            onClick={toggleProfileMenu}
            className={`relative w-10 h-10 rounded-full glass overflow-hidden border transition-all shadow-md focus:outline-none focus:ring-1 focus:ring-accent-purple-dark z-(--z-raised) ${isProfileMenuOpen ? "border-accent-purple-dark" : "border-glass-border hover:border-glass-border-accent"}`}
          >
            <Image
              src={staticImages.avatarPlaceholder.src}
              alt={staticImages.avatarPlaceholder.alt}
              fill
              sizes="2.5rem"
              className="shadow-glass-bg shadow-md rounded-full w-full h-full object-cover select-none"
            />
          </button>

          <HeaderProfileMenu
            isOpen={isProfileMenuOpen}
            onClose={() => setIsProfileMenuOpen(false)}
          />
        </div>
      </div>
    </header>
  );
}
