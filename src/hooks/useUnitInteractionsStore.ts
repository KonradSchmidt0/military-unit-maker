import { create } from 'zustand';

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
}

export const useUnitInteractionStore = create<UnitInteractionStore>((set) => ({
  hoveredId: undefined,
  setHoveredId: (newHoveredId) => set({ hoveredId: newHoveredId }),

  selectedId: undefined,
  setSelectedId: (newSelectedId) => set({ selectedId: newSelectedId }),

  selected_parentId: undefined,
  setSelected_parentId: (newSelected_parentId) => set({ selected_parentId: newSelected_parentId }),

  resetSelected: () => set({ selectedId: undefined, selected_parentId: undefined }),

  rootId: "",
  setRootId: (newRootId) => set({ rootId: newRootId }),
}));
