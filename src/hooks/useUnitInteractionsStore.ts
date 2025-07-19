import { create } from 'zustand';

export interface SelectUnitBundle {
  selectedId: string | undefined;
  setSelectedId: (newSelectedId: string | undefined) => void;
  selected_parentId: string | undefined;
  setSelected_parentId: (newSelected_parentId: string | undefined) => void;
}

type UnitInteractionStore = SelectUnitBundle & {
  hoveredId: string | undefined;
  setHoveredId: (newHoveredId: string | undefined) => void;
  resetSelected: () => void;
}

export const useUnitInteractionStore = create<UnitInteractionStore>((set, get) => ({
  hoveredId: undefined,
  setHoveredId: (newHoveredId) => set({ hoveredId: newHoveredId }),

  selectedId: undefined,
  setSelectedId: (newSelectedId) => set({ selectedId: newSelectedId }),

  selected_parentId: undefined,
  setSelected_parentId: (newSelected_parentId) => set({ selected_parentId: newSelected_parentId }),

  resetSelected: () => set({ selectedId: undefined, selected_parentId: undefined }),
}));

export const useSelectUnitBundle = () => {
  return useUnitInteractionStore(s => s);
}