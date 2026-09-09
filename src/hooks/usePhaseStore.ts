import { create } from 'zustand';

interface PhaseStore {
  phase: number
  setPhase: (newPhase: number) => void
}

export const usePhaseStore = create<PhaseStore>((set) => ({
  phase: 0,
  setPhase(newPhase) {
    set((_) => ({phase: newPhase}))
  },
}));