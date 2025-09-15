import { create } from "zustand";


export type simpleHover = {
  header: string;
  desc?: string;
} | string

export interface hoverStore {
  id: string | undefined;
  simple: simpleHover | undefined
  pos: { top: number; left: number };
  callId: (newHoveredId: string) => void;
  callSimple: (header: string, desc?: string) => void;
  callSimpleI: (n: simpleHover) => void;
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
  callSimpleI(n) {
    set(() => ({simple: n, id: undefined}))
  },
  callOff() {
    set(() => ({id: undefined, simple: undefined}))
  },

  setPos: (pos) => set({ pos }),

}));
