import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useThemeStore = create<{isDark: boolean,setDark: (n: boolean) => void}>()(
  persist(
    (set) => ({
      isDark: true,
      setDark: (n) => set({isDark: n})
    }),
    {
      name: "theme-options-store"
    }
  )
)