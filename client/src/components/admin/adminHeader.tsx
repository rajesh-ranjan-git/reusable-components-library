import { Dispatch, SetStateAction } from "react";
import { LuBell, LuMenu, LuSearch } from "react-icons/lu";

export default function AdminHeader({
  setMobileOpen,
}: {
  setMobileOpen: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <header className="top-0 z-30 sticky flex justify-between items-center bg-surface/80 backdrop-blur-md px-4 md:px-8 border-white/10 border-b h-16">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setMobileOpen(true)}
          className="md:hidden text-text-secondary hover:text-white"
        >
          <LuMenu size={24} />
        </button>
        <span className="hidden sm:block font-semibold text-white text-xl">
          Dashboard Overview
        </span>
      </div>

      <div className="hidden md:block relative flex-1 mx-6 max-w-md">
        <LuSearch className="top-1/2 left-3 absolute w-4 h-4 text-text-secondary -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search stats, users..."
          className="bg-white/5 py-1.5 pr-4 pl-10 border border-white/10 focus:border-primary rounded-full focus:outline-none focus:ring-1 focus:ring-primary w-full placeholder-text-secondary text-white text-sm transition-all"
        />
      </div>

      <div className="flex items-center gap-4">
        <button className="relative text-text-secondary hover:text-white transition-colors">
          <LuBell size={20} />
          <span className="top-0 right-0 absolute bg-red-500 border border-bg rounded-full w-2 h-2"></span>
        </button>
        <button className="border border-white/20 hover:border-primary rounded-full w-8 h-8 overflow-hidden transition-colors">
          <img
            src="https://i.pravatar.cc/150?u=admin"
            alt="Admin"
            className="w-full h-full object-cover"
          />
        </button>
      </div>
    </header>
  );
}
