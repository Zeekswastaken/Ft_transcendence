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
    notification:any;
    chatMembers:any[];
    muted:any;
    setMyBoolean: (value: Boolean) => void;
    setCurrUserData: (data: any) => void;
    setUserData: (data: any) => void;
    setToken: (data: any) => void;
    setMessage: (data: string) => void;
    setGetChat: (data: any[]) => void;
    setUpdateChat: (data: any) => void;
    setTempo: (data: any[]) => void;
    setChanelType: (value: boolean) => void;
    setNotification: (value: any) => void;
    setChatMembers: (value: any) => void;
    setMuted: (value: any) => void;
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
    notification:[],
    chatMembers:[],
    muted:[],
    setMyBoolean: (value: Boolean) => set({ myBoolean: value }),
    setCurrUserData: (data: any) => set({ currUserData: data }),
    setUserData: (data: any) => set({ userData: data }),
    setToken: (data: any) => set({ token: data }),
    setMessage: (data: string) => set({ message: data }),
    setGetChat: (data) => set({ getChat: data }),
    setUpdateChat: (data:any) => set({ updateChat: data }),
    setTempo: (data) => set({ tempo: data }),
    setChanelType: (value: boolean) => set({ chanelType: value }),
    setNotification: (value: any) => set({ notification: value }),
    setChatMembers: (data) => set({ chatMembers: data }),
    setMuted: (value: any) => set({ muted: value }),
  }));