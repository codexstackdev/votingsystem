import { Position } from "@/hooks/types";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface PositionStore {
  positions: Position[];
  fetchedElectionId: string | null;

  setPositions: (electionId: string, positions: Position[]) => void;
  addPosition: (position: Position) => void;
  updatePosition: (id: string, updates: Partial<Position>) => void;
  removePosition: (id: string) => void;
  reset: () => void;
}

export const usePositionStore = create<PositionStore>()(
  persist(
    (set) => ({
      positions: [],
      fetchedElectionId: null,

      setPositions: (electionId, positions) =>
        set({ positions, fetchedElectionId: electionId }),

      addPosition: (position) =>
        set((state) => ({ positions: [...state.positions, position] })),

      updatePosition: (id, updates) =>
        set((state) => ({
          positions: state.positions.map((p) =>
            p._id === id ? { ...p, ...updates } : p,
          ),
        })),

      removePosition: (id) =>
        set((state) => ({
          positions: state.positions.filter((p) => p._id !== id),
        })),

      reset: () => set({ positions: [], fetchedElectionId: null }),
    }),
    {
      name: "position-storage",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        positions: state.positions,
        fetchedElectionId: state.fetchedElectionId,
      }),
    },
  ),
);