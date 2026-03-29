import { ElementType } from "react";

type StatCardProps = {
  title: string;
  value: string;
  change: number;
  trend: "up" | "down";
  icon: ElementType;
};

export default function StatCard({
  title,
  value,
  change,
  trend = "up",
  icon: Icon,
}: StatCardProps) {
  return (
    <div className="bg-surface/50 shadow-lg backdrop-blur-md p-6 border border-white/5 hover:border-white/10 rounded-xl transition-all hover:-translate-y-1">
      <div className="flex justify-between items-start mb-4">
        <div className="flex justify-center items-center bg-white/5 border border-white/10 rounded-xl w-10 h-10">
          <Icon className="w-5 h-5 text-white" />
        </div>
        <span
          className={`text-xs font-semibold px-2 py-1 rounded-full ${trend === "up" ? "text-green-400 bg-green-400/10 border border-green-400/20" : "text-red-400 bg-red-400/10 border border-red-400/20"}`}
        >
          {trend === "up" ? "+" : "-"}
          {Math.abs(change)}%
        </span>
      </div>
      <div>
        <h3 className="mb-1 font-medium text-text-secondary text-sm">
          {title}
        </h3>
        <p className="font-bold text-white text-2xl lg:text-3xl tracking-tight">
          {value}
        </p>
      </div>
    </div>
  );
}
