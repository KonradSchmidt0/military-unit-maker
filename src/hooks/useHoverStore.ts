import { create } from "zustand";

export interface hoverStore {
  id: string | undefined;
  pos: { top: number; left: number };
  call: (newHoveredId: string | undefined, pos?: { top: number; left: number }) => void;
}

export const useHoverStore = create<hoverStore>((set) => ({
  id: undefined,
  pos: { top: 0, left: 0 },

  call: (newHoveredId, pos) => {
    set((state) => ({ id: newHoveredId, pos: pos ?? state.pos }))
  },

}));
