import { IconType } from "react-icons";
import {
  LuCode,
  LuGitCommitHorizontal,
  LuGitMerge,
  LuStar,
} from "react-icons/lu";

type Activity = {
  type: string;
  date: string;
  title: string;
  description: string;
};

type ActivitySectionProps = { activities: Activity[] };

export default function ActivitySection({ activities }: ActivitySectionProps) {
  return (
    <div className="bg-surface/50 shadow-lg backdrop-blur-md mb-20 md:mb-6 p-6 border border-white/5 rounded-2xl">
      <h2 className="mb-8 font-semibold text-white text-xl">
        Recent Activity & Highlights
      </h2>

      <div className="space-y-0">
        {activities.map((activity, idx) => {
          let Icon: IconType = LuCode;
          let colorClass = "text-text-secondary";

          if (activity.type === "commit") {
            Icon = LuGitCommitHorizontal;
            colorClass = "text-green-400";
          }
          if (activity.type === "pr") {
            Icon = LuGitMerge;
            colorClass = "text-accent";
          }
          if (activity.type === "star") {
            Icon = LuStar;
            colorClass = "text-yellow-400";
          }
          if (activity.type === "hackathon") {
            Icon = LuCode;
            colorClass = "text-primary";
          }

          return (
            <div key={idx} className="group flex gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-white/10 group-hover:border-white/20 transition-all shadow-md`}
                >
                  <Icon size={18} className={colorClass} />
                </div>
                {idx !== activities.length - 1 && (
                  <div className="bg-linear-to-b from-white/10 group-hover:from-white/20 to-transparent my-1 w-px h-full transition-colors"></div>
                )}
              </div>
              <div className="pb-8 w-full">
                <p className="inline-block bg-white/5 mb-2 px-2 py-1 rounded-md font-medium text-text-secondary text-xs">
                  {activity.date}
                </p>
                <div className="bg-white/5 hover:bg-white/10 shadow-sm group-hover:shadow-md p-4 border border-white/5 hover:border-white/10 rounded-xl transition-all">
                  <h4 className="mb-1.5 font-medium text-white">
                    {activity.title}
                  </h4>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    {activity.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
