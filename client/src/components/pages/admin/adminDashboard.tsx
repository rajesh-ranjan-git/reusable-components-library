"use client";

import { useState } from "react";
import {
  LuActivity,
  LuDollarSign,
  LuDownload,
  LuTarget,
  LuUsers,
} from "react-icons/lu";
import ActivityFeed from "@/components/admin/activityFeed";
import AdminHeader from "@/components/admin/adminHeader";
import AdminSidebar from "@/components/admin/adminSidebar";
import ChartCard from "@/components/admin/chartCard";
import StatCard from "@/components/admin/statCard";

export default function AdminDashboard() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex bg-bg selection:bg-primary/30 min-h-dvh overflow-hidden text-text-primary">
      <AdminSidebar isMobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <div className="flex flex-col flex-1 md:ml-20 lg:ml-64 w-full h-dvh overflow-hidden transition-all duration-300">
        <AdminHeader setMobileOpen={setMobileOpen} />

        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto custom-scrollbar">
          <div className="space-y-6 md:space-y-8 mx-auto pb-10 max-w-7xl">
            <div className="flex sm:flex-row flex-col justify-between sm:items-end gap-4">
              <div>
                <h1 className="font-bold text-white text-2xl md:text-3xl tracking-tight">
                  Overview
                </h1>
                <p className="mt-1 text-text-secondary text-sm md:text-base">
                  Monitor platform metrics and activity.
                </p>
              </div>
              <button className="inline-flex justify-center items-center gap-2 bg-primary hover:bg-indigo-600 shadow-md shadow-primary/20 px-4 py-2.5 rounded-lg font-medium text-white text-sm transition-all">
                <LuDownload size={16} />
                Generate Report
              </button>
            </div>

            {/* KPI Stats Row */}
            <div className="gap-4 md:gap-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                title="Total Users"
                value="12,482"
                change={12.5}
                trend="up"
                icon={LuUsers}
              />
              <StatCard
                title="Active Matches"
                value="8,234"
                change={8.2}
                trend="up"
                icon={LuTarget}
              />
              <StatCard
                title="Platform Revenue"
                value="$42,500"
                change={4.1}
                trend="up"
                icon={LuDollarSign}
              />
              <StatCard
                title="Bounce Rate"
                value="24.2%"
                change={2.4}
                trend="down"
                icon={LuActivity}
              />
            </div>

            <div className="gap-4 md:gap-6 grid grid-cols-1 xl:grid-cols-3 h-auto xl:h-112.5">
              <ChartCard />
              <ActivityFeed />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
