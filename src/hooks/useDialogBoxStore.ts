import { create } from "zustand"

interface DialogOption {
  text: string
  action: () => void
}

interface DialogBoxStore {
  isOpen: boolean
  header: string
  longText: string
  options: DialogOption[]

  open: (header: string, longText: string, options: DialogOption[]) => void
  close: () => void
}

export const useDialogBoxStorage = create<DialogBoxStore>((set) => ({
  isOpen: false,
  header: "",
  longText: "",
  options: [],

  open: (header, longText, options) => {
    set({ isOpen: true, header, longText, options })
  },
  close: () =>
    set({ isOpen: false, header: "", longText: "", options: [] }),
}))
