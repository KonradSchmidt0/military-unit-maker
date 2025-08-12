import { create } from 'zustand';

export interface StaffText {
  path: number[], comment: string
}

interface GlobalStore {
  echelonFoldingLevel: number;
  setEchelonFoldingLevel: (n: number) => void;
  foldingDepth: number
  setFoldingDepth: (n: number) => void;
  displayParentBox: boolean;
  setDisplayParentBox: (b: boolean) => void;
  isGlobalMini: boolean;
  setIsGlobalMini: (b: boolean) => void;
  isPalletMini: boolean;
  setIsPalletMini: (b: boolean) => void;
  isChangeLogMini: boolean;
  setIsChangeLogMini: (b: boolean) => void;
  stacking: boolean;
  setStacking: (b: boolean) => void;

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

export const useGlobalStore = create<GlobalStore>((set, get) => ({
  echelonFoldingLevel: 0,
  setEchelonFoldingLevel: (n) => set({echelonFoldingLevel: n }),
  foldingDepth: 3,
  setFoldingDepth: (n) => set({foldingDepth: n}),
  displayParentBox: false,
  setDisplayParentBox: (b) => set({displayParentBox: b}),
  isGlobalMini: true,
  setIsGlobalMini: (b) => set({isGlobalMini: b}),
  isPalletMini: true,
  setIsPalletMini: (b) => set({isPalletMini: b}),
  isChangeLogMini: true,
  setIsChangeLogMini: (b) => set({isChangeLogMini: b}),
  stacking: false,
  setStacking: (b) => set({stacking: b}),



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


}));