"use client";

import { useEffect, useState } from "react";
import { SwipeDirectionType } from "@/types/types/discover.types";
import { DiscoverProfilesResponseType } from "@/types/types/response.types";
import { UserProfileType } from "@/types/types/profile.types";
import { useAppStore } from "@/store/store";
import { fetchProfiles } from "@/lib/actions/discover.actions";
import Header from "@/components/layout/header";
import AppSidebar from "@/components/layout/app.sidebar";
import BottomNav from "@/components/layout/bottom.navbar";
import ActionBar from "@/components/discover/action.bar";
import SwipeCard from "@/components/discover/swipe.card";

const DiscoverPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [profiles, setProfiles] = useState<UserProfileType[]>([]);
  const [page, setPage] = useState(1);

  const accessToken = useAppStore((state) => state.accessToken);

  const handleSwipe = (direction: SwipeDirectionType, userId?: string) => {
    const targetId =
      userId ??
      (profiles.length > 0 ? profiles[profiles.length - 1]?.userId : null);

    if (targetId !== null) {
      setProfiles((prev) => prev.filter((p) => p?.userId !== targetId));
    }
  };

  const loadProfiles = async () => {
    const response = await fetchProfiles(page);

    if (response.success && response?.data) {
      const data = response?.data as DiscoverProfilesResponseType;

      setProfiles(data.users);
    } else {
      setProfiles([]);
    }
  };

  useEffect(() => {
    if (accessToken) {
      loadProfiles();
    }
  }, [accessToken]);

  return (
    <div className="flex flex-col bg-bg-page h-dvh overflow-hidden text-text-primary">
      <Header
        type="default"
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      <main className="relative flex flex-1 overflow-hidden">
        <div className="hidden xl:flex">
          <AppSidebar />
        </div>

        <div className="relative flex flex-col flex-1 justify-center items-center p-4 pb-20 md:pb-6 overflow-hidden">
          <div className="relative flex justify-center items-center w-full max-w-90 md:max-w-md h-137.5 md:h-150">
            {profiles.length === 0 ? (
              <div className="p-8 border w-full text-center glass">
                <div className="flex justify-center items-center mx-auto mb-4 border border-glass-border-accent rounded-full w-20 h-20 r">
                  <span className="text-3xl">🚀</span>
                </div>
                <h3 className="mb-2 font-bold text-text-primary text-xl">
                  You're all caught up!
                </h3>
                <p className="text-text-secondary text-sm">
                  We're looking for more developers in your area. Check back
                  later or expand your search distance.
                </p>
              </div>
            ) : (
              profiles.map((profile, index) => (
                <SwipeCard
                  key={profile?.userId}
                  profile={profile}
                  active={index === profiles.length - 1}
                  onSwipe={handleSwipe}
                />
              ))
            )}
          </div>

          {profiles.length > 0 && <ActionBar onSwipe={handleSwipe} />}
        </div>
      </main>

      <BottomNav activeTab="discover" />
    </div>
  );
};

export default DiscoverPage;
