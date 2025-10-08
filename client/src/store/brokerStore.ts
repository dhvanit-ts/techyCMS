import { create } from "zustand";
import type { IAdmin } from "../types/IAdmin";

interface AdminState {
  admin: IAdmin | null;
  setAdmin: (admin: IAdmin) => void;
  updateAdmin: (updatedAdmin: IAdmin) => void;
  removeAdmin: () => void;
}

const useAdminStore = create<AdminState>((set) => ({
  admin: null,
  setAdmin: (admin) => set({ admin }),
  updateAdmin: (updatedAdmin) =>
    set((state) => ({
      admin: { ...state.admin, ...updatedAdmin },
    })),
  removeAdmin: () =>
    set({
      admin: {
        id: 0,
        username: "",
        email: "",
      },
    }),
}));

export default useAdminStore;
