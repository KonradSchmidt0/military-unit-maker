import { create } from "zustand";

export const useThemeStore = create<{isDark: boolean,setDark: (n: boolean) => void}>((set) => ({
  isDark: true,
  setDark: (n) => set({isDark: n})
}))