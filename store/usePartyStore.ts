import { Party } from "@/hooks/types";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface PartyStore {
  parties: Party[];
  fetchedElectionId: string | null;

  setParties: (electionId: string, parties: Party[]) => void;
  addParty: (party: Party) => void;
  updateParty: (id: string, updates: Partial<Party>) => void;
  removeParty: (id: string) => void;
  reset: () => void;
}

export const usePartyStore = create<PartyStore>()(
  persist(
    (set) => ({
      parties: [],
      fetchedElectionId: null,

      setParties: (electionId, parties) =>
        set({ parties, fetchedElectionId: electionId }),

      addParty: (party) =>
        set((state) => ({ parties: [...state.parties, party] })),

      updateParty: (id, updates) =>
        set((state) => ({
          parties: state.parties.map((p) =>
            p._id === id ? { ...p, ...updates } : p,
          ),
        })),

      removeParty: (id) =>
        set((state) => ({
          parties: state.parties.filter((p) => p._id !== id),
        })),

      reset: () => set({ parties: [], fetchedElectionId: null }),
    }),
    {
      name: "party-storage",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        parties: state.parties,
        fetchedElectionId: state.fetchedElectionId,
      }),
    },
  ),
);