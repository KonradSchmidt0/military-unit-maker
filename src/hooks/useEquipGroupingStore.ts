import { create } from "zustand";

export interface EquipGroup {
  name: string, 
  entries: string[]
  minimalized: boolean
}

interface EquipGroupingStore {
  groups: EquipGroup[];
  setGroups: (newGroups: EquipGroup[]) => void;
}


export const useEquipGroupingStore = create<EquipGroupingStore>((set) => ({
  groups: [],

  setGroups: (newGroups) => set({ groups: newGroups }),
})
);

export function bumpGroup(
  groups: EquipGroup[],
  giverIndex: number,
  receiverIndex: number
): EquipGroup[] {

  const output = [...groups];
  const giver = output[giverIndex];
  output.splice(giverIndex, 1);
  output.splice(receiverIndex, 0, giver);
  return output;
}

export function toggleGroup(
  groups: EquipGroup[],
  signature?: number | string,
): EquipGroup[] {

  const output = groups.map((g, i) =>
      i === signature || g.name === signature ? { ...g, minimalized: !g.minimalized } : g
    );
  return output;
}