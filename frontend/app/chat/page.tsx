"use client"
import React, { useState, useEffect } from 'react';
import ChatList from './chatList';
import ChatContent from './chatContent';
import EmptyChatContent from './emptyChatContent';
import { getCookie } from 'cookies-next';
import { SocketProvider, useSocketContext } from '../socket';
import jwt, { JwtPayload } from "jsonwebtoken";
import { useMyStore } from "./state";
import { useRouter } from 'next/navigation';


const page = () => {
  
  const {setUserGroups, userGroups,myBoolean, setToken, setCurrUserData, setMyBoolean} = useMyStore();
  const [currentUsername, setCurrentUsername] = useState<string>("");
  const [currentUserID, setCurrentUserID] = useState<number>(0);
  const router = useRouter()
  const {socket} = useSocketContext();
  useEffect(() => {
    setMyBoolean(false);
    const token = getCookie("accessToken");
    setToken(token);
    try {
      const user = jwt.decode(token as string) as JwtPayload
      if (user) {
        setCurrUserData(user);
        setCurrentUsername(user.username)
        setCurrentUserID(user.id)
      }
    } catch (error) {
      console.error('Error decoding token:');
    }
  }, [])
  const [userFriends, setUserFriends] = useState<any>([]);

  useEffect(() => {
      const token = getCookie("accessToken");
      socket?.emit("getFriendsWithChannels", {user: currentUsername});
      socket?.emit("getChannelsJoined", {userID: currentUserID});
      socket?.emit("getSocketId&JoinRoom", {token: token});
  }, [currentUserID]);

  useEffect(() => {
    socket?.on("getfriendswithchannels", (data:any) => {
      setUserFriends(data);
    })
    socket?.on("getchannelsjoined", (data:any) => {
      setUserGroups(data);
    })
  },[currentUsername])

  return (
    <div className=" w-screen h-screen mx-4 max-sm:mx-0 bg-opacity-80 shadow-md">
    <div className=" mt-[100px] h-[85%] flex gap-4 justify-center my-8 mx-20 max-xl:mx-4 max-sm:mx-0 bg-opacity-80 shadow-md rounded-3xl place-items-center"> {/* chat and friends */}
      <ChatList userFriends={userFriends} userGroups={userGroups}/>
      {myBoolean ? <ChatContent /> : <EmptyChatContent />}
    </div>
  </div>
  );
  }
  
  export default page
  