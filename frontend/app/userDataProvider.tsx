"use client"

import { setUserData } from "@/redux/features/userDataSlice";
import { useAppDispatch } from "@/redux/hooks";
import axios from "axios";
import { getCookie } from "cookies-next";
import jwt,{ JwtPayload } from "jsonwebtoken";
import { useParams, useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

type userData = {
  user: {
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
  friends: Array<{
    id:number
    username: string
    avatar_url: string
    status : string
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
  // let e: Event
  // e.preventDefault()
  let User = useParams().username;
  // console.log('User =', User )
  const [user, setUser] = useState<userData | undefined>({} as userData)
  useEffect(() => {
    // if (!User)
    // {
    //   const token = getCookie("accessToken");
    //   try {
    //     const user = jwt.decode(token as string) as JwtPayload
    //     if (user)
    //       User = user?.username
    //     // setCurrentUsername(jwt.decode(token).username);
    //   } catch (error) {
    //     console.error('Error decoding token:');
    //   }
    // }
    if (User) {
      axios.get(`http://localhost:3000/profile/${User}`).then((res) =>{
        if(res.data.message === "not-found"){
          setUser(undefined)
          return;
        }
        else
          setUser(res.data);
      }).catch((err) => {
        console.log(err);
      })
    }
    
  }, [User])
  // const dispatch = useAppDispatch();
  // useEffect(() => {
  //   dispatch(setUserData(user));
  // }, [dispatch, user]);

  return (
    <userDataContext.Provider value={user}>
      {children}
    </userDataContext.Provider>
  );
}