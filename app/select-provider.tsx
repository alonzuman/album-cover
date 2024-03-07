import { create } from "zustand";

type Store = {
  selecting: boolean;
  toggleSelecting: () => void;
};

export const useSelect = create<Store>()((set) => ({
  selecting: false,
  toggleSelecting: () => set((state) => ({ selecting: !state.selecting })),
}));
