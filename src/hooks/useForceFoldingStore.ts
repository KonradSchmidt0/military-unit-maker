import { create } from "zustand";

type FoldState = "Fold" | "Unfold";
type PathAsString = string
export type FoldingMap = Record<PathAsString, FoldState>

interface ForceFoldingStore {
  // Problem: When comparing arrays JS is messy (objects vs data i think)
  // Solution: Stringify the array to make sure same path gives the same value, no mater where it was instantiate
  foldingUnfoldingMap: FoldingMap;
  resetMap: () => void;
  add: (path: number[], state: FoldState) => void;
  remove: (path: number[]) => void;
}

export const useForceFoldingStore = create<ForceFoldingStore>((set) => ({
  foldingUnfoldingMap: {},

  resetMap: () => set({ foldingUnfoldingMap: {} }),

  add: (path, state) =>
    set((s) => ({
      foldingUnfoldingMap: {
        ...s.foldingUnfoldingMap,
        [getPathAsString(path)]: state,
      },
    })),

  remove: (path) =>
    set((s) => {
      const newMap = { ...s.foldingUnfoldingMap };
      delete newMap[getPathAsString(path)];
      return { foldingUnfoldingMap: newMap };
    }),
}));

export function getPathAsString(path: number[]) {
  return JSON.stringify(path)
}