// store/userStore.ts
import { RoleType } from '@utils';
import { create } from 'zustand';

type UserStore = {
  role: RoleType | null;
  setRole: (role: RoleType) => void;
  id: string | null;
  setId: (id: string) => void;
};

export const useUserStore = create<UserStore>((set) => ({
  role: null,
  id: null,
  setRole: (role: RoleType) => {
    set({ role });
  },
  setId: (id: string) => {
    set({ id });
  },
}));
