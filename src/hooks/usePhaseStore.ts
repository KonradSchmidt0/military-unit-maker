import { create } from 'zustand';

interface PhaseStore {
  currentPhase: number
  setCurrentPhase: (newCurrentPhase: number) => void
  allPhases: Phase[]
  changePhaseAtIndex: (index: number, change: (prev?: Phase) => Phase) => void
  removePhaseAtIndex: (index: number) => void
}

interface Phase {
  name: string
  uuid: string
}

export const usePhaseStore = create<PhaseStore>((set) => ({
  currentPhase: 0,
  setCurrentPhase(newCurrentPhase) {
    set((_) => ({currentPhase: newCurrentPhase}))
  },
  allPhases: [{name: "Organic", uuid: crypto.randomUUID()}],
  changePhaseAtIndex(index, change) {
    set((state) => ({
      allPhases: [...Array(index + 1)].map((_, i) => state.allPhases[i] ?? undefined).map((p, i) => i === index ? change(p) : p)
    }))
  },
  removePhaseAtIndex(index) {
    set((state) => ({
      allPhases: state.allPhases.filter((p, i) => i !== index)
    }))
  },
}));