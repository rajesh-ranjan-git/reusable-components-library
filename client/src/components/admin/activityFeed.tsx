import { FiCheckCircle } from "react-icons/fi";
import { LuRefreshCw, LuUserPlus } from "react-icons/lu";
import { TbAlertCircle } from "react-icons/tb";

const activities = [
  {
    id: 1,
    type: "user_joined",
    user: "Alex Merced",
    action: "joined DevMatch",
    time: "5m ago",
    icon: LuUserPlus,
    color: "text-green-400",
    bg: "bg-green-400/10 border-green-400/20",
  },
  {
    id: 2,
    type: "subscription",
    user: "Sarah Connor",
    action: "upgraded to Premium",
    time: "12m ago",
    icon: LuRefreshCw,
    color: "text-primary",
    bg: "bg-primary/10 border-primary/20",
  },
  {
    id: 3,
    type: "report",
    user: "System",
    action: "flagged suspicious account (ID: 942)",
    time: "1h ago",
    icon: TbAlertCircle,
    color: "text-red-400",
    bg: "bg-red-400/10 border-red-400/20",
  },
  {
    id: 4,
    type: "project_created",
    user: "David Kim",
    action: 'created a new squad "Web3 Dash"',
    time: "3h ago",
    icon: FiCheckCircle,
    color: "text-accent",
    bg: "bg-accent/10 border-accent/20",
  },
  {
    id: 5,
    type: "user_joined",
    user: "Emily Chen",
    action: "joined DevMatch",
    time: "5h ago",
    icon: LuUserPlus,
    color: "text-green-400",
    bg: "bg-green-400/10 border-green-400/20",
  },
];

export default function ActivityFeed() {
  return (
    <div className="flex flex-col bg-surface/50 shadow-lg backdrop-blur-md p-6 border border-white/5 rounded-xl">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-semibold text-white text-lg">Recent Activity</h3>
        <button className="font-medium text-primary hover:text-indigo-400 text-sm transition-colors">
          View all
        </button>
      </div>

      <div className="flex-1 space-y-3 pr-2 overflow-y-auto custom-scrollbar">
        {activities.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className="group flex items-start gap-4 hover:bg-white/5 p-3 border border-transparent hover:border-white/5 rounded-lg transition-colors"
            >
              <div
                className={`w-10 h-10 rounded-full border flex items-center justify-center shrink-0 ${item.bg}`}
              >
                <Icon className={`${item.color} w-5 h-5`} />
              </div>
              <div className="flex-1 pt-0.5 min-w-0">
                <p className="text-white text-sm truncate">
                  <span className="mr-1 font-medium">{item.user}</span>
                  <span className="text-text-secondary">{item.action}</span>
                </p>
                <p className="mt-1 text-text-secondary group-hover:text-white/70 text-xs transition-colors">
                  {item.time}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
