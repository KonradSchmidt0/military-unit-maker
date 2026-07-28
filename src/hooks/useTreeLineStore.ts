import { createRef, RefObject } from "react";
import { create } from "zustand";

export interface PathRefPair {
  path: number[]
  ref: RefObject<HTMLDivElement | null>
  setEl: (el: HTMLDivElement | null) => void  // add this
}

export interface TreeLineStore {
  rootRef: RefObject<HTMLDivElement | null>
  refs: Map<string, PathRefPair>
  version: number  // add this
  registerRef: (path: number[]) => void;
  unregisterRef: (path: number[]) => void;
}

export const useTreeLineStore = create<TreeLineStore>((set, get) => ({
  rootRef: createRef<HTMLDivElement>(),
  refs: new Map(),
  version: 0,

  registerRef: (path) => {
    const key = path.toString()
    if (get().refs.has(key)) return;
    const ref = createRef<HTMLDivElement>() as { current: HTMLDivElement | null };
    const setEl = (el: HTMLDivElement | null) => {
      ref.current = el;
      // bump version when DOM element actually arrives
      set(state => ({ version: state.version + 1 }))
    }
    set(state => ({
      refs: new Map(state.refs).set(key, { path, ref, setEl }),
      version: state.version + 1,
    }));
  },

  unregisterRef: (path) => {
    set(state => {
      const newRefs = new Map(state.refs);
      newRefs.delete(path.toString());
      return { refs: newRefs, version: state.version + 1 };
    });
  },
}));