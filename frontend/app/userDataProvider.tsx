"use client"

import { setUserData } from "@/redux/features/userDataSlice";
import { useAppDispatch } from "@/redux/hooks";
import axios from "axios";
import { getCookie } from "cookies-next";
import jwt,{ JwtPayload } from "jsonwebtoken";
import { useParams, useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
const url = `http://${process.env.NEXT_PUBLIC_HOST}:${process.env.NEXT_PUBLIC_PORT}/profile/`;
export type userData = {
  user: {
    id:number
    username: string
    Bio: string
    avatar_url: string
    birthDay:string
    gender:string
    privacy:boolean
    status:string
    stats:{
      matches_played:number
      losses:number
      wins:number
      winrate:number
      level: number
    }
  }
  matches: [
    Date:string,
    id:number,
    player1:Object,
    player2:Object,
    player1Score:number,
    player2Score:number,
    result:number
  ]
  friends: Array<{
    id:number
    username: string
    avatar_url: string
    status : string
  }>
  blocked: Array<{
    id:number
    username: string
    avatar_url: string
  }>
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
  let User = useParams().username;
  const [user, setUser] = useState<userData | undefined>({} as userData)
  useEffect(() => {
    if (User) {
      axios.get(`${url}${User}`).then((res) =>{
        if(res.data.message === "not-found"){
          setUser(undefined)
          return;
        }
        else {
          setUser(res.data);
        }
      }).catch((err) => {
        console.log(err);
      })
    }
    
  }, [User])
  return (
    <userDataContext.Provider value={user}>
      {children}
    </userDataContext.Provider>
  );
}