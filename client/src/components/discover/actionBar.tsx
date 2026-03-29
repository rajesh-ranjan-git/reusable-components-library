import { LuHeart, LuStar, LuX } from "react-icons/lu";

type SwipeDirection = "left" | "right" | "super";

type ActionBarProps = {
  onSwipe: (direction: SwipeDirection, id?: number) => void;
};

export default function ActionBar({ onSwipe }: ActionBarProps) {
  return (
    <div className="z-10 flex justify-center items-center gap-6 mt-6 px-4 w-full max-w-sm">
      <button
        onClick={() => onSwipe("left")}
        className="flex justify-center items-center bg-surface hover:bg-red-500/10 shadow-lg border border-white/10 hover:border-red-500/30 rounded-full w-16 h-16 text-red-400 hover:scale-110 active:scale-95 transition-all"
      >
        <LuX size={32} strokeWidth={3} />
      </button>

      <button
        onClick={() => onSwipe("super")}
        className="flex justify-center items-center bg-surface hover:bg-accent/10 shadow-accent/20 shadow-lg border border-accent/30 hover:border-accent/50 rounded-full w-12 h-12 text-accent hover:scale-110 active:scale-95 transition-all"
      >
        <LuStar size={24} fill="currentColor" strokeWidth={0} />
      </button>

      <button
        onClick={() => onSwipe("right")}
        className="flex justify-center items-center bg-surface hover:bg-green-500/10 shadow-lg border border-white/10 hover:border-green-500/30 rounded-full w-16 h-16 text-green-400 hover:scale-110 active:scale-95 transition-all"
      >
        <LuHeart size={32} fill="currentColor" strokeWidth={0} />
      </button>
    </div>
  );
}
