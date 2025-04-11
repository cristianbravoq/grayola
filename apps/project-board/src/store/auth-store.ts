// store/userStore.ts
import { RoleType } from '@utils';
import { create } from 'zustand';

type UserStore = {
  role: RoleType | null;
  setRole: (role: RoleType | null) => void;
  id: string | null;
  setId: (id: string | null) => void;
  email: string | null;
  setEmail: (email: string | null) => void;
};

export const useUserStore = create<UserStore>((set) => ({
  role: null,
  id: null,
  setRole: (role: RoleType | null) => {
    set({ role });
  },
  setId: (id: string | null) => {
    set({ id });
  },
  email: null,
  setEmail: (email: string | null) => { set({ email }); },
}));
