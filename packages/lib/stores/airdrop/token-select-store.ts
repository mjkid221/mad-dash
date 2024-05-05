import create from "zustand";

import { UserTokensType } from "../../types";

export interface TokenSelectStore {
  token?: UserTokensType;
  setToken: (token: UserTokensType) => void;
  isOpen: boolean;
  setIsOpen: () => void;
  setIsClosed: () => void;
}

export const useTokenSelectStore = create<TokenSelectStore>((set) => ({
  token: undefined,
  setToken: (token: UserTokensType) => set({ token }),
  isOpen: false,
  setIsOpen: () => set({ isOpen: true }),
  setIsClosed: () => set({ isOpen: false }),
}));
