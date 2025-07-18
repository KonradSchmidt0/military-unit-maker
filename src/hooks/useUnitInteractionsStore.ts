import { create } from 'zustand';
import { UnitMap } from './useUnitStore';
import { ChildrenList, OrgUnit } from '../logic/logic';

interface UnitInteractionStore {
  hoveredId: string | undefined;
  setHoveredId: (newHoveredId: string | undefined) => void;
  selectedId: string | undefined;
  setSelectedId: (newSelectedId: string | undefined) => void;
  selected_parentId: string | undefined;
  setSelected_parentId: (newSelected_parentId: string | undefined) => void;
  resetSelected: () => void;

  rootId: string;
  setRootId: (newRootId: string) => void;
  popNewRoot: (unitMap: UnitMap, updateMap: Function) => void;
}

export const useUnitInteractionStore = create<UnitInteractionStore>((set, get) => ({
  hoveredId: undefined,
  setHoveredId: (newHoveredId) => set({ hoveredId: newHoveredId }),

  selectedId: undefined,
  setSelectedId: (newSelectedId) => set({ selectedId: newSelectedId }),

  selected_parentId: undefined,
  setSelected_parentId: (newSelected_parentId) => set({ selected_parentId: newSelected_parentId }),

  resetSelected: () => set({ selectedId: undefined, selected_parentId: undefined }),

  rootId: "",
  setRootId: (newRootId) => set({ rootId: newRootId }),

  popNewRoot: (map, update) => {
    const oldRootId = get().rootId
    const oldRoot = map[oldRootId]
    const newRootId = crypto.randomUUID()
    // No idea why, but when i do it as children: {rootUnitId : 1} it reads rootUnitId as a string of value "rootUnitId"
    let c: ChildrenList = { }; c[oldRootId] = 1;

    const newRoot: OrgUnit = { 
      ...oldRoot,
      type: "org", name: "New Root Unit", echelonLevel: oldRoot.echelonLevel + 1,
      children: c
    }
    
    get().setSelectedId(newRootId)
    update(newRootId, newRoot)
    get().setRootId(newRootId)
  }
}));
