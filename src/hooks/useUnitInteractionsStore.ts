import { create } from 'zustand';
import { UnitMap } from './useUnitStore';
import { getUnitIdAtPath } from '../logic/unitPath';

export interface SelectUnitBundle {
  selectedId: string | undefined;
  selectedPath: number[] | undefined;
  selected_parentId: string | undefined;
  setOnlySelectedId: (newId: string) => void;
  setSelectedPath: (newPath: number[], currentRootId: string, unitMap: UnitMap) => void;
  resetSelected: () => void;
}

type UnitInteractionStore = SelectUnitBundle & {
  hoveredId: string | undefined;
  setHoveredId: (newHoveredId: string | undefined) => void;
}

export const useUnitInteractionStore = create<UnitInteractionStore>((set, get) => ({
  hoveredId: undefined,
  setHoveredId: (newHoveredId) => set({ hoveredId: newHoveredId }),

  selectedId: undefined,
  selectedPath: undefined,
  selected_parentId: undefined,
  setOnlySelectedId: (newId) => set({ selectedId: newId, selectedPath: undefined, selected_parentId: undefined }),
  setSelectedPath: (newPath, currentRootId, unitMap) => {
    const id = getUnitIdAtPath(currentRootId, newPath, unitMap)
    const parentId = newPath.length === 0 ? getUnitIdAtPath(currentRootId, newPath.slice(0, -1), unitMap) : undefined
    set( { selectedId: id, selected_parentId: parentId, selectedPath: newPath } )
  },

  resetSelected: () => set({ selectedId: undefined, selectedPath: undefined, selected_parentId: undefined }),
}));

export const useSelectUnitBundle = () => {
  return useUnitInteractionStore(s => s);
}