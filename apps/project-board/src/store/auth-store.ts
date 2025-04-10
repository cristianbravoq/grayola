// store/userStore.ts
import { RoleType } from '@utils';
import { create } from 'zustand';

type UserStore = {
  role: RoleType | null;
  setRole: (role: RoleType) => void;
  id: string | null;
  setId: (id: string) => void;
  email: string | null;
  setEmail: (email: string) => void;
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
  email: null,
  setEmail: (email: string) => { set({ email }); },
}));
