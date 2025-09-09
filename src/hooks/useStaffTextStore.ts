import { create } from "zustand";

export interface StaffText {
  path: number[], comment: string
}

interface StaffTextStore {
  staffComments: StaffText[];
  setStaffComments: (n: StaffText[]) => void
  setStaffComment: (path: number[], comment: string) => void;
  removeStaffComment: (path: number[]) => void;
  getStaffComment: (path: number[]) => string;

  staffNames: StaffText[];
  setStaffNames: (n: StaffText[]) => void;
  setStaffName: (path: number[], name: string) => void;
  removeStaffName: (path: number[]) => void;
  getStaffName: (path: number[]) => string;
}

export const useStaffTextStore = create<StaffTextStore>((set, get) => ({

  staffComments: [],

  setStaffComments: (n) =>
    set({staffComments: n}),

  setStaffComment: (path, comment) =>{
    set((state) => ({
      staffComments: [
        ...state.staffComments.filter((entry) => entry.path.toString() !== path.toString()),
        { path, comment },
      ],
    }))},

  removeStaffComment: (path) =>
    set((state) => ({
      staffComments: state.staffComments.filter((entry) => entry.path.toString() !== path.toString()),
    })),

  getStaffComment: (path: number[]) =>
    get().staffComments.find((entry) => entry.path.toString() === path.toString())?.comment ?? '',
    

  staffNames: [{path: [1], comment: "Test"}],

  setStaffNames: (n) =>
    set({ staffNames: n }),

  setStaffName: (path, comment) => {
    set((state) => ({
      staffNames: [
        ...state.staffNames.filter((entry) => entry.path.toString() !== path.toString()),
        { path, comment },
      ],
    }));
  },

  removeStaffName: (path) =>
    set((state) => ({
      staffNames: state.staffNames.filter((entry) => entry.path.toString() !== path.toString()),
    })),

  getStaffName: (path: number[]) =>
    get().staffNames.find((entry) => entry.path.toString() === path.toString())?.comment ?? ''
}))