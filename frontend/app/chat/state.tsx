import { create } from "zustand";

interface MyStore {
    myBoolean: boolean;
    userData:any;
    setMyBoolean: (value: boolean) => void;
    setUserData: (data: any) => void;
  }

export const useMyStore = create<MyStore>((set) => ({
    myBoolean: false,
    userData: [],
    setMyBoolean: (value: boolean) => set({ myBoolean: value }),
    setUserData: (data: any) => set({ userData: data }),
  }));