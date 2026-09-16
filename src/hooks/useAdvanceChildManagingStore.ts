import { create } from "zustand";
import { SelectionSignature } from "./useUnitInteractionsStore";

export interface AdvanceChildManagingStore {
  selectedParentSignature: SelectionSignature | undefined
  Open: (selectSignature: SelectionSignature) => void,
  Close: () => void,
}

export const useAdvanceChildManagingStore = create<AdvanceChildManagingStore>((set, get) => ({
  selectedParentSignature: undefined,
  Open(selectSignature) {
    set({selectedParentSignature: selectSignature})
  },
  Close() {
    set({selectedParentSignature: undefined})
  },
}))