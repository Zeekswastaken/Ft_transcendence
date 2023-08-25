"use client"

import { setUserData } from "@/redux/features/userDataSlice";
import { useAppDispatch } from "@/redux/hooks";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { JsxEmit } from "typescript";

type userData = {
  id:number
  username: string
  Bio: string
  avatar_url: string
  birthDay:string
  gender:string
  privacy:boolean
  stats:{
    matches_played:number
    losses:number
    wins:number
    winrate:number
    level: number
  }
}


// Create the context with the appropriate type
const userDataContext = createContext<userData | undefined>(undefined);

// Define the hook to consume the userData context
export function useUserDataContext(): userData | undefined {
  return useContext(userDataContext);
}
// Define the userDataProvider component
interface userDataProviderProps {
  children: React.ReactNode;
}


export function UserDataProvider({ children, }: userDataProviderProps) {
  // let e: Event
  // e.preventDefault()
  const User = useParams().username;
  const router = useRouter();
  const [user, setUser] = useState<userData>({} as userData)
  useEffect(() => {
    axios.get(`http://localhost:3000/profile/${User}`).then((res) =>{
      if(!res.data){
        // router.push("/not-found");
        return;
      }
      setUser(res.data);
    }).catch((err) => {
      console.log(err);
    })
    
  }, [User])

  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setUserData(user));
  }, [dispatch, user]);

  return (
    <userDataContext.Provider value={user}>
      {children}
    </userDataContext.Provider>
  );
}