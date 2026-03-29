"use client";

import { MouseEvent, useState } from "react";
import Link from "next/link";
import { LuBell, LuMenu, LuSearch, LuX } from "react-icons/lu";
import ThemeToggle from "@/components/theme/themeToggle";
import AppSidebar from "@/components/layout/appSidebar";
import HeaderNotificationMenu from "@/components/shared/headerNotificationMenu";
import HeaderProfileMenu from "@/components/shared/headerProfileMenu";

export default function Header() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationMenuOpen, setIsNotificationMenuOpen] = useState(false);

  const toggleProfileMenu = (e: MouseEvent) => {
    e.stopPropagation();
    setIsProfileMenuOpen(!isProfileMenuOpen);
    setIsNotificationMenuOpen(false);
  };

  const toggleNotificationMenu = (e: MouseEvent) => {
    e.stopPropagation();
    setIsNotificationMenuOpen(!isNotificationMenuOpen);
    setIsProfileMenuOpen(false);
  };

  return (
    <>
      <header className="top-0 z-40 sticky flex justify-between items-center bg-bg/80 backdrop-blur-md px-4 lg:px-6 border-white/10 border-b h-16">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="md:hidden text-text-secondary hover:text-white transition-colors"
          >
            <LuMenu size={24} />
          </button>
          <Link
            href="/discover"
            className="flex items-center gap-2 hover:opacity-90 font-bold text-white text-xl tracking-tight transition-opacity"
          >
            <div className="flex justify-center items-center bg-linear-to-br from-primary to-accent shadow-lg rounded-lg w-8 h-8">
              <span className="text-white text-sm">DM</span>
            </div>
            <span>DevMatch</span>
          </Link>
        </div>

        <div className="hidden md:block relative flex-1 mx-6 max-w-md">
          <LuSearch className="top-1/2 left-3 absolute w-4 h-4 text-text-secondary -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search developers, skills..."
            className="bg-white/5 py-1.5 pr-4 pl-10 border border-white/10 focus:border-primary rounded-full focus:outline-none focus:ring-1 focus:ring-primary w-full placeholder-text-secondary text-white text-sm transition-all"
          />
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <ThemeToggle />
          <div className="relative">
            <button
              onClick={toggleNotificationMenu}
              className={`text-text-secondary hover:text-primary transition-colors relative p-1.5 rounded-lg ${isNotificationMenuOpen ? "bg-primary/10 text-primary" : ""}`}
            >
              <LuBell size={20} />
              <span className="top-1.5 right-1.5 absolute bg-red-500 border border-bg rounded-full w-2 h-2"></span>
            </button>
            <HeaderNotificationMenu
              isOpen={isNotificationMenuOpen}
              onClose={() => setIsNotificationMenuOpen(false)}
            />
          </div>
          <div className="relative">
            <button
              onClick={toggleProfileMenu}
              className={`w-9 h-9 rounded-full overflow-hidden border-2 transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-primary/50 relative z-10 ${isProfileMenuOpen ? "border-primary" : "border-white/10 hover:border-primary"}`}
            >
              <img
                src="https://i.pravatar.cc/150?u=devmatch"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </button>
            <HeaderProfileMenu
              isOpen={isProfileMenuOpen}
              onClose={() => setIsProfileMenuOpen(false)}
            />
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      <div
        className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${isSidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* Sliding Drawer */}
      <div
        className={`fixed top-0 left-0 h-dvh w-72 sm:w-80 bg-[#0B0F1A] md:hidden z-50 transition-transform duration-300 shadow-2xl ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="top-4 right-4 z-50 absolute">
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="bg-surface/80 hover:bg-white/10 p-1.5 rounded-lg text-text-secondary hover:text-white transition-colors"
          >
            <LuX size={20} />
          </button>
        </div>
        <div className="pt-2 w-full h-full overflow-hidden">
          <AppSidebar />
        </div>
      </div>
    </>
  );
}
