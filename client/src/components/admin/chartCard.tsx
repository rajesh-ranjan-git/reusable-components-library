import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Jan", activeUsers: 4000, newMatches: 2400 },
  { name: "Feb", activeUsers: 5000, newMatches: 3100 },
  { name: "Mar", activeUsers: 6800, newMatches: 4200 },
  { name: "Apr", activeUsers: 8400, newMatches: 6100 },
  { name: "May", activeUsers: 9200, newMatches: 7800 },
  { name: "Jun", activeUsers: 11000, newMatches: 9400 },
];

export default function ChartCard() {
  return (
    <div className="flex flex-col lg:col-span-2 bg-surface/50 shadow-lg backdrop-blur-md p-6 border border-white/5 rounded-xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="font-semibold text-white text-lg">
            Platform Engagement
          </h3>
          <p className="text-text-secondary text-sm">
            Active users vs New matches over 6 months
          </p>
        </div>
        <select className="bg-bg/50 px-3 py-1.5 border border-white/10 focus:border-primary rounded-lg focus:outline-none text-white text-sm cursor-pointer">
          <option>Last 6 Months</option>
          <option>This Year</option>
          <option>All Time</option>
        </select>
      </div>

      <div className="flex-1 w-full min-h-75">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 10, bottom: 5, left: -20 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.05)"
              vertical={false}
            />
            <XAxis
              dataKey="name"
              stroke="#9CA3AF"
              tick={{ fill: "#9CA3AF", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              stroke="#9CA3AF"
              tick={{ fill: "#9CA3AF", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(val) => `${val / 1000}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0B0F1A",
                borderColor: "rgba(255,255,255,0.1)",
                borderRadius: "8px",
                color: "#E5E7EB",
              }}
              itemStyle={{ color: "#E5E7EB" }}
              cursor={{ stroke: "rgba(255,255,255,0.1)" }}
            />
            <Line
              type="monotone"
              dataKey="activeUsers"
              stroke="#4F46E5"
              strokeWidth={3}
              dot={{ fill: "#4F46E5", r: 4, strokeWidth: 0 }}
              activeDot={{ r: 6, strokeWidth: 0, fill: "#4F46E5" }}
              name="Active Users"
            />
            <Line
              type="monotone"
              dataKey="newMatches"
              stroke="#8B5CF6"
              strokeWidth={3}
              dot={{ fill: "#8B5CF6", r: 4, strokeWidth: 0 }}
              activeDot={{ r: 6, strokeWidth: 0, fill: "#8B5CF6" }}
              name="New Matches"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
