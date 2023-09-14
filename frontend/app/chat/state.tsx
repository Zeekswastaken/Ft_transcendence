import { create } from "zustand";

interface MyStore {
    myBoolean: boolean;
    userData:any;
    token:any;
    message:string;
    setMyBoolean: (value: boolean) => void;
    setUserData: (data: any) => void;
    setToken: (data: any) => void;
    setMessage: (data: string) => void;
  }

export const useMyStore = create<MyStore>((set) => ({
    myBoolean: false,
    userData: [],
    token:"",
    message:"",
    setMyBoolean: (value: boolean) => set({ myBoolean: value }),
    setUserData: (data: any) => set({ userData: data }),
    setToken: (data: any) => set({ token: data }),
    setMessage: (data: string) => set({ message: data }),
  }));