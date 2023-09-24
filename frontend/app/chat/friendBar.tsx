"use client";
import React, { MouseEvent, useEffect, useState } from "react";
import { useSocketContext } from '../socket';
import { useMyStore } from "./state";

const friendBar = ({friend}:any) => {
  const {token , setMyBoolean , setUserData, setChanelType, setGetChat, setUpdateChat, setTempo, currUserData, chanelType} = useMyStore();
  const {socket} = useSocketContext();
  const setMyStore = (e: MouseEvent<HTMLButtonElement>) =>{
    e.preventDefault();
    const userid = currUserData.id;
    setMyBoolean(true);
    setUserData(friend);
    setChanelType(false);
    const channelid = friend.channelid;
    socket?.emit("getmessages",  {token, channelid});
    socket?.emit("isDuo",{channelid, userid} );
    setUpdateChat([]);
    setTempo([]);
    setGetChat([])
    socket?.on("messages", (data:any) => {
      setGetChat(data);
    })
  }

  return (
    <button onClick={setMyStore}>
      <div className="relative h-[80px] flex-shrink-0 rounded-xl rounded-br-0 bg-[#2D0130] hover:bg-primary-purple-100 ">
        <div className={`absolute mx-4 max-sm:mx-2 bottom-4 rounded-full p-[3px] ${friend.user.status === "Online" ? "bg-green-500" : "bg-gray-500"}`}>
          <img
            src={friend.user.avatar_url}
            alt="pic"
            className="w-[50px] h-[50px] bg-white p-[1px] rounded-full"
            />
        </div>
        <h1 className=" absolute font-Bomb max-sm:text-lg text-xl text-white bottom-6 left-20 max-sm:left-[72px]">
          {friend.user.username}
        </h1>
      </div>
    </button>
  );
};
export default friendBar;
