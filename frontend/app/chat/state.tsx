import { create } from "zustand";

export  interface MyStore {
    myBoolean: Boolean;
    currUserData:any;
    userData:any;
    token:any;
    message:string;
    getChat:any[];
    updateChat:any;
    tempo:any[];
    chanelType:boolean;
    chatMembers:any[];
    muted:any;
    baned:any;
    admin:any;
    userGroups:any;
    setMyBoolean: (value: Boolean) => void;
    setCurrUserData: (data: any) => void;
    setUserData: (data: any) => void;
    setToken: (data: any) => void;
    setMessage: (data: string) => void;
    setGetChat: (data: any[]) => void;
    setUpdateChat: (data: any) => void;
    setTempo: (data: any[]) => void;
    setChanelType: (value: boolean) => void;
    setChatMembers: (value: any) => void;
    setMuted: (value: any) => void;
    setBaned: (value: any) => void;
    setAdmin: (value: any) => void;
    setUserGroups: (data: any) => void;
  }
  
  export const useMyStore = create<MyStore>((set) => ({
    myBoolean: false,
    currUserData:[],
    userData: [],
    token:"",
    message:"",
    getChat:[],
    updateChat:[],
    tempo:[],
    chanelType:false,
    chatMembers:[],
    muted:[],
    baned:[],
    admin:[],
    userGroups:[],
    setMyBoolean: (value: Boolean) => set({ myBoolean: value }),
    setCurrUserData: (data: any) => set({ currUserData: data }),
    setUserData: (data: any) => set({ userData: data }),
    setToken: (data: any) => set({ token: data }),
    setMessage: (data: string) => set({ message: data }),
    setGetChat: (data) => set({ getChat: data }),
    setUpdateChat: (data:any) => set({ updateChat: data }),
    setTempo: (data) => set({ tempo: data }),
    setChanelType: (value: boolean) => set({ chanelType: value }),
    setChatMembers: (data) => set({ chatMembers: data }),
    setMuted: (value: any) => set({ muted: value }),
    setBaned: (value: any) => set({ baned: value }),
    setAdmin: (value: any) => set({ admin: value }),
    setUserGroups: (data:any) => set({ userGroups: data }),
  }));