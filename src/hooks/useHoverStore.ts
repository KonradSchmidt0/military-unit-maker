import { create } from "zustand";

export interface hoverStore {
  id: string | undefined;
  simple: {header: string, desc?: string} | undefined
  pos: { top: number; left: number };
  callId: (newHoveredId: string) => void;
  callSimple: (header: string, desc?: string) => void;
  callOff: () => void
  setPos: (pos: { top: number; left: number }) => void
}

export const useHoverStore = create<hoverStore>((set) => ({
  id: undefined,
  simple: undefined,
  pos: { top: 0, left: 0 },

  callId: (newHoveredId) => {
    set(() => ({ id: newHoveredId, simple: undefined }))
  },
  callSimple(header, desc) {
    set(() => ({simple: {header: header, desc: desc}, id: undefined}))
  },
  callOff() {
    set(() => ({id: undefined, simple: undefined}))
  },

  setPos: (pos) => set({ pos }),

}));
