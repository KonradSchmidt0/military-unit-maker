import { create } from 'zustand';
import { UnitMap } from './useUnitStore';
import { GetChildIdFromPath, GetFlatIds } from '../logic/childManaging';
import { ChildrenList } from '../logic/logic';

export interface UnitInteractionStore {
  select: string | number[] | undefined
  setSelect: (newSelect: string | number[] | undefined) => void;
  getSelectedParent: (map: UnitMap, trueRootId: string) => string | undefined
  // TODO: Remove
  path: number[] | undefined // Causes bugs because stupind react rerenders
  selectChild: (newElement: number) => void
  selectParent: () => void
  offsetSelect: () => void
  changeSelectedChild: (newPos: "top" | "bottom", parentChildren: ChildrenList) => void
  getIdFromPath: (map: UnitMap, trueRootId: string, path: number[]) => string
  selectSibling: (siblingFlatIndex: number) => void
  resetSelected: () => void;
}

export const useUnitInteractionStore = create<UnitInteractionStore>((set, get) => ({
  select: undefined,
  setSelect: (newSelect) => {set({select: newSelect})},
  getSelectedParent(map, trueRootId) {
    const s = get().select
    if (!Array.isArray(s))
      return undefined
    if (s.length === 0)
      return undefined
    return GetChildIdFromPath(trueRootId, s.slice(0, -1), map)
  },

  get path() {
    const s = get().select
    if (Array.isArray(s)) {
      return s
    }
    return undefined
  },

  selectChild: (n) => {
    const s = get().select
    if (!Array.isArray(s)) {
      console.warn("s is not a path!")
      return
    }
    set({select: [...s, n]})
  },

  selectParent: () => {
    const s = get().select
    if (!Array.isArray(s)) {
      console.warn("s is not a path!")
      return
    }

    set({select: s.slice(0, -1)})
  },

  offsetSelect: () => {
    const s = get().select
    if (!Array.isArray(s)) {
      console.warn("s is not a path!")
      return
    }

    set({select: [0, ...s]})
  },

  changeSelectedChild: (newPos, parentChildren) => {
    const s = get().select
    if (!Array.isArray(s)) {
      console.warn("s is not a path!")
      return
    }

    const flat = GetFlatIds(parentChildren)

    set({select: [...s.slice(0, -1), newPos === 'top' ? 0 : flat.length - 1]})
  },

  selectSibling: (siblingFlatIndex) => {
    const s = get().select
    if (!Array.isArray(s)) {
      console.warn("s is not a path!")
      return
    }
    set({select: [...s.slice(0, -1), siblingFlatIndex]})
  },

  getIdFromPath: (map, trueRootId, path) => {
    return GetChildIdFromPath(trueRootId, path, map)
  },

  resetSelected: () => set({ select: undefined}),
}));

export function processSelect(select: string | number[] | undefined, map: UnitMap, trueRootId: string) {
  if (!select)
    return undefined
  if (Array.isArray(select)) {
    return GetChildIdFromPath(trueRootId, select, map)
  }
  return select
}