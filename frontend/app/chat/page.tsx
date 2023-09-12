"use client"
import React, { useState, useEffect } from 'react';
import ChatList from './chatList';
import ChatListMobil from './chatListMobil';
// import Board from './board';
import ChatContent from './chatContent';
import { getCookie } from 'cookies-next';
import { io } from 'socket.io-client';
import { useSocketContext } from '../socket';
import jwt, { JwtPayload } from "jsonwebtoken";
import { useParams, useRouter } from "next/navigation";


const page = () => {

  const [currentUsername, setCurrentUsername] = useState<string>("");
  const [currentUserID, setCurrentUserID] = useState<number>(0);


  useEffect(() => {
    const token = getCookie("accessToken");
    try {
      const user = jwt.decode(token as string) as JwtPayload
      if (user) {
        setCurrentUsername(user.username)
        setCurrentUserID(user.id)
      }
      // setCurrentUsername(jwt.decode(token).username);
    } catch (error) {
      console.error('Error decoding token:');
    }
  }, [])
  const {socket} = useSocketContext();
  const [userFriends, setUserFriends] = useState<any>([]);

  useEffect(() => {
    socket?.emit("getFriends", {user: currentUsername});
  }, [currentUserID])
  useEffect(() => {
    console.log("heer");
    socket?.on("getfriends", (data:any) => {
      // console.log("data = ", data);
      setUserFriends(data);
    })
  },[userFriends])
  console.log(userFriends);
  // socket?.emit("Duo", {token:token,name:'Oussama'});

  return (
    <div className=" w-screen h-screen mx-4 max-sm:mx-0 bg-opacity-80 shadow-md">
    <div className=" mt-[100px] h-[85%] max-xl:h-[75%] max-sm:h-[80%] flex gap-4 justify-center my-8 mx-20 max-xl:mx-4 max-sm:mx-0 bg-opacity-80 shadow-md backdrop-blur-md rounded-3xl place-items-center"> {/* chat and friends */}
      <ChatList Friends={userFriends}/>
      <ChatContent />
    </div>
  </div>
  );
  }
  
  export default page
  