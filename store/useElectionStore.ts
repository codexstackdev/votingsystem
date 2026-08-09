import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { electionProps } from "@/hooks/types";

interface ElectionStats {
  positions: number;
  parties: number;
  candidates: number;
  ballots: number;
}

interface ElectionStore {
  elections: electionProps[];
  hasFetched: boolean;

  setElections: (elections: electionProps[]) => void;
  addElection: (election: electionProps) => void;
  updateElection: (id: string, updates: Partial<electionProps>) => void;
  removeElection: (id: string) => void;
  reset: () => void;

  selectedElection: electionProps | null;
  selectedElectionId: string | null;
  stats: ElectionStats | null;

  setSelectedElection: (election: electionProps, stats: ElectionStats) => void;
  updateSelectedElection: (updates: Partial<electionProps>) => void;
  setStats: (stats: Partial<ElectionStats>) => void;
  clearSelectedElection: () => void;
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

          selectedElection:
            state.selectedElection?.id === id
              ? { ...state.selectedElection, ...updates }
              : state.selectedElection,
        })),

      removeElection: (id) =>
        set((state) => ({
          elections: state.elections.filter((e) => e.id !== id),
          selectedElection:
            state.selectedElection?.id === id ? null : state.selectedElection,
          selectedElectionId:
            state.selectedElectionId === id ? null : state.selectedElectionId,
          stats: state.selectedElectionId === id ? null : state.stats,
        })),

      reset: () => set({ elections: [], hasFetched: false }),

      selectedElection: null,
      selectedElectionId: null,
      stats: null,

      setSelectedElection: (election, stats) =>
        set({
          selectedElection: election,
          selectedElectionId: election.id,
          stats,
        }),

      updateSelectedElection: (updates) =>
        set((state) => ({
          selectedElection: state.selectedElection
            ? { ...state.selectedElection, ...updates }
            : state.selectedElection,
        })),

      setStats: (statsUpdates) =>
        set((state) => ({
          stats: state.stats
            ? { ...state.stats, ...statsUpdates }
            : state.stats,
        })),

      clearSelectedElection: () =>
        set({ selectedElection: null, selectedElectionId: null, stats: null }),
    }),
    {
      name: "election-storage",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        elections: state.elections,
        hasFetched: state.hasFetched,
        selectedElection: state.selectedElection,
        selectedElectionId: state.selectedElectionId,
        stats: state.stats,
      }),
    },
  ),
);
