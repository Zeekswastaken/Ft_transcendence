"use client";
import React, { MouseEvent } from "react";
import Image from "next/image";
import ChatContent from "./chatContent";
import { useSocketContext } from '../socket';
import { useMyStore } from "./state";

const friendBar = ({friend}:any) => {
  const {token,setMyBoolean , setUserData, setChanelType, setGetChat, setUpdateChat, setTempo, currUserData} = useMyStore();
  const {socket} = useSocketContext();
  const setMyStore = (e: MouseEvent<HTMLButtonElement>) =>{
    e.preventDefault();
    const userid = currUserData.id;
    setMyBoolean(true);
    setUserData(friend);
    const channelid = friend.channelid;
    socket?.emit("getmessages",  {token, channelid});
    socket?.emit("isDuo",{channelid, userid} );
    setUpdateChat([]);
    setTempo([]);
    socket?.on("messages", (data:any) => {
      setGetChat(data);
    })
    socket?.on("isduo", (data:any)=>{
      setChanelType(data.bol);
    });
  }
  return (
    <button onClick={setMyStore}>
      <div className="relative h-[80px] flex-shrink-0 rounded-xl rounded-br-0 bg-[#2D0130] hover:bg-primary-purple-100 ">
        {/* <Image src="/vector.svg" width={40} height={40} alt="icon" className="absolute mx-4 right-2 bottom-8" /> */}
        {/* <Image src="/icons.png" width={40} height={40} alt="icon" className="absolute mx-4 right-2 bottom-8" /> */}
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
        {/* <p className=" absolute text-sm font-Heading tracking-wider bottom-3 left-20">{friend.user.status}</p> */}
        <div className=" float-right mx-4 my-8 h-5 w-5 rounded-full bg-pink-700 blur-sm">
          {/* <div className=" relative place-content-center items-center h-3 ">
          </div> */}
        </div>
      </div>
    </button>
  );
};
export default friendBar;
