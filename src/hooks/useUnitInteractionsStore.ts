import { create } from 'zustand';
import { UnitMap } from './useUnitStore';
import { OrgUnit } from '../logic/Units/logic';
import { GetChildIdFromPath, GetFlatIds } from '../logic/Units/childGetting';

export interface UnitInteractionStore {
  selectSignature: string | number[] | undefined
  setSelect: (newSelect: string | number[] | undefined) => void;
  getSelectedParent: (map: UnitMap, trueRootId: string, phase: number) => string | undefined
  selectChild: (newElement: number) => void
  selectParent: () => void
  offsetSelect: () => void
  changeSelectedChild: (newPos: "top" | "bottom", parent: OrgUnit, phase: number) => void
  selectSibling: (siblingFlatIndex: number) => void
  resetSelected: () => void;
}

export const useUnitInteractionStore = create<UnitInteractionStore>((set, get) => ({
  selectSignature: undefined,
  setSelect: (newSelect) => {set({selectSignature: newSelect})},
  getSelectedParent(map, trueRootId, phase) {
    const s = get().selectSignature
    if (!Array.isArray(s))
      return undefined
    if (s.length === 0)
      return undefined
    return GetChildIdFromPath(trueRootId, s.slice(0, -1), map, phase)
  },

  get path() {
    const s = get().selectSignature
    if (Array.isArray(s)) {
      return s
    }
    return undefined
  },

  selectChild: (n) => {
    const s = get().selectSignature
    if (!Array.isArray(s)) {
      console.warn("s is not a path!")
      return
    }
    set({selectSignature: [...s, n]})
  },

  selectParent: () => {
    const s = get().selectSignature
    if (!Array.isArray(s)) {
      console.warn("s is not a path!")
      return
    }

    set({selectSignature: s.slice(0, -1)})
  },

  offsetSelect: () => {
    const s = get().selectSignature
    if (!Array.isArray(s)) {
      console.warn("s is not a path!")
      return
    }

    set({selectSignature: [0, ...s]})
  },

  changeSelectedChild: (newPos, parentChildren, phase) => {
    const s = get().selectSignature
    if (!Array.isArray(s)) {
      console.warn("s is not a path!")
      return
    }

    const flat = GetFlatIds(parentChildren, phase)

    set({selectSignature: [...s.slice(0, -1), newPos === 'top' ? 0 : flat.length - 1]})
  },

  selectSibling: (siblingFlatIndex) => {
    const s = get().selectSignature
    if (!Array.isArray(s)) {
      console.warn("s is not a path!")
      return
    }
    set({selectSignature: [...s.slice(0, -1), siblingFlatIndex]})
  },

  resetSelected: () => set({ selectSignature: undefined}),
}));

export function processSelect(select: string | number[] | undefined, map: UnitMap, trueRootId: string, phase: number) {
  if (!select)
    return undefined
  return processSignature(select, map, trueRootId, phase)
}

export function processSignature(signature: string | number[], map: UnitMap, trueRootId: string, phase: number) {
  if (Array.isArray(signature)) {
    return GetChildIdFromPath(trueRootId, signature, map, phase)
  }
  return signature
}