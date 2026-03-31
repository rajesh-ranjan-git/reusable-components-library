import { Dispatch, SetStateAction } from "react";
import { create } from "zustand";
import { themeConfig } from "@/config/common.config";
import { ThemeTypes } from "@/types/types";

type AppState = {
  activeTheme: ThemeTypes;
  setActiveTheme: Dispatch<SetStateAction<ThemeTypes>>;
};

export const useAppStore = create<AppState>((set) => ({
  activeTheme: themeConfig.dark,
  setActiveTheme: (themeOrUpdater) =>
    set((state) => ({
      activeTheme:
        typeof themeOrUpdater === "function"
          ? themeOrUpdater(state.activeTheme)
          : themeOrUpdater,
    })),
}));
