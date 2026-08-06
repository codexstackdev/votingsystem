import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { electionProps } from "@/app/hooks/types";

interface ElectionStore {
  elections: electionProps[];
  hasFetched: boolean;

  setElections: (elections: electionProps[]) => void;
  addElection: (election: electionProps) => void;
  updateElection: (id: string, updates: Partial<electionProps>) => void;
  removeElection: (id: string) => void;
  reset: () => void;
}

export const useElectionStore = create<ElectionStore>()(
  persist(
    (set) => ({
      elections: [],
      hasFetched: false,

      setElections: (elections) => set({ elections, hasFetched: true }),

      addElection: (election) =>
        set((state) => ({ elections: [election, ...state.elections] })),

      updateElection: (id, updates) =>
        set((state) => ({
          elections: state.elections.map((e) =>
            e.id === id ? { ...e, ...updates } : e,
          ),
        })),

      removeElection: (id) =>
        set((state) => ({
          elections: state.elections.filter((e) => e.id !== id),
        })),

      reset: () => set({ elections: [], hasFetched: false }),
    }),
    {
      name: "election-storage",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        elections: state.elections,
        hasFetched: state.hasFetched,
      }),
    },
  ),
);