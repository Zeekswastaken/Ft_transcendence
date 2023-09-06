import { create } from "zustand";

interface MyStore {
    myBoolean: boolean;
    setMyBoolean: (value: boolean) => void;
  }

export const useMyStore = create<MyStore>((set) => ({
    myBoolean: false,
    setMyBoolean: (value: boolean) => set({ myBoolean: value }),
  }));