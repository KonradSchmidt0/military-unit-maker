import { create } from 'zustand';

export interface StaffComment {
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

  staffComments: StaffComment[];
  setStaffComments: (n: StaffComment[]) => void
  setStaffComment: (path: number[], comment: string) => void;
  removeStaffComment: (path: number[]) => void;
  getStaffComment: (path: number[]) => string;
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
    get().staffComments.find((entry) => entry.path.toString() === path.toString())?.comment ?? ''
    

}));