"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useRouter } from "next/navigation";
import { LuMessageCircle, LuUserPlus } from "react-icons/lu";

type SwipeDirection = "left" | "right" | "super";

type Request = {
  id: number;
  name: string;
  role: string;
  avatar: string;
};

const initialMockRequests: Request[] = [
  {
    id: 1,
    name: "Sarah Connor",
    role: "Backend Engineer",
    avatar: "https://i.pravatar.cc/150?u=sarah",
  },
  {
    id: 2,
    name: "Kyle Reese",
    role: "DevOps Specialist",
    avatar: "https://i.pravatar.cc/150?u=kyle",
  },
  {
    id: 3,
    name: "John Connor",
    role: "Full Stack Lead",
    avatar: "https://i.pravatar.cc/150?u=john",
  },
  {
    id: 4,
    name: "Miles Dyson",
    role: "AI Researcher",
    avatar: "https://i.pravatar.cc/150?u=miles",
  },
];

export default function AppSidebar() {
  const router = useRouter();
  const [showAllRequests, setShowAllRequests] = useState(false);
  const [requests, setRequests] = useState(initialMockRequests);
  const [exitDirection, setExitDirection] = useState<
    Record<number, SwipeDirection>
  >({});

  const handleAction = (id: number, direction: SwipeDirection) => {
    setExitDirection((prev) => ({ ...prev, [id]: direction }));
    setTimeout(() => {
      setRequests((prev) => prev.filter((req) => req.id !== id));
    }, 0);
  };

  const visibleRequests = showAllRequests ? requests : requests.slice(0, 2);

  return (
    <div className="flex flex-col bg-white/50 dark:bg-surface/30 border-black/10 dark:border-white/10 border-r md:w-64 lg:w-72 h-full shrink-0">
      <div className="p-4 border-black/10 dark:border-white/10 border-b">
        <h2 className="font-semibold text-text-primary text-xl">Network</h2>
      </div>
      <div className="flex-1 p-4 overflow-y-auto custom-scrollbar">
        <div className="mb-6">
          <h3 className="mb-3 font-semibold text-text-secondary text-xs uppercase tracking-wider">
            Requests
          </h3>
          <div className="flex justify-between items-center bg-primary/10 hover:bg-primary/20 mb-3 p-3 border border-primary/20 rounded-lg transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <LuUserPlus className="text-primary" size={20} />
              <span className="font-medium text-text-primary text-sm">
                {requests.length} New Requests
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <AnimatePresence initial={false}>
              {visibleRequests.map((req) => (
                <motion.div
                  key={req.id}
                  initial={{ opacity: 0, height: 0, scale: 0.95 }}
                  animate={{ opacity: 1, height: "auto", scale: 1 }}
                  exit={{
                    opacity: 0,
                    x: exitDirection[req.id] === "right" ? 100 : -100,
                    height: 0,
                    marginTop: 0,
                    marginBottom: 0,
                    transition: { duration: 0.25, ease: "backIn" },
                  }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="group flex justify-between items-center hover:bg-black/5 dark:hover:bg-white/5 p-2 rounded-lg overflow-hidden transition-colors cursor-pointer">
                    <div className="flex items-center gap-3 pr-2 min-w-0">
                      <img
                        src={req.avatar}
                        alt={req.name}
                        className="rounded-full w-10 h-10 object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-text-primary group-hover:text-primary text-sm truncate transition-colors">
                          {req.name}
                        </h4>
                        <p className="text-text-secondary text-xs truncate">
                          {req.role}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => handleAction(req.id, "right")}
                        className="flex justify-center items-center bg-green-500/20 hover:bg-green-500 shadow-sm rounded-md w-7 h-7 text-green-500 hover:text-white transition-colors"
                      >
                        ✓
                      </button>
                      <button
                        onClick={() => handleAction(req.id, "left")}
                        className="flex justify-center items-center bg-red-500/10 hover:bg-red-500/80 shadow-sm rounded-md w-7 h-7 text-red-500 hover:text-white transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {!showAllRequests && requests.length > 2 && (
            <button
              onClick={() => setShowAllRequests(true)}
              className="bg-surface hover:bg-primary/10 shadow-sm mt-4 py-2.5 border border-black/10 hover:border-primary/50 dark:border-white/10 rounded-lg w-full font-semibold text-text-secondary hover:text-primary text-xs transition-all"
            >
              Show all requests ({requests.length})
            </button>
          )}
        </div>

        <div>
          <h3 className="mb-3 font-semibold text-text-secondary text-xs uppercase tracking-wider">
            Connections
          </h3>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                onClick={() => router.push(`/profile/${i}`)}
                className="group flex justify-between items-center hover:bg-black/5 dark:hover:bg-white/5 p-2 rounded-lg transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3 pr-2 min-w-0">
                  <div className="relative shrink-0">
                    <img
                      src={`https://i.pravatar.cc/150?u=${i + 10}`}
                      alt="User"
                      className="rounded-full w-10 h-10 object-cover"
                    />
                    <div
                      className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border border-bg ${i % 2 === 0 ? "bg-green-500" : "bg-gray-500"}`}
                    ></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-text-primary group-hover:text-primary text-sm truncate transition-colors">
                      Developer {i}
                    </h4>
                    <p className="text-text-secondary text-xs truncate">
                      Frontend Engineer
                    </p>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push("/chat");
                  }}
                  className="z-10 flex justify-center items-center bg-primary/10 hover:bg-primary rounded-full w-8 h-8 text-primary hover:text-white transition-colors shrink-0"
                  aria-label="Chat"
                >
                  <LuMessageCircle size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
