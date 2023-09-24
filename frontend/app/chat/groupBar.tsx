"use client";
import React, { MouseEvent } from "react";
import { useSocketContext } from '../socket';
import { useMyStore } from "./state";
import { useRouter } from "next/navigation";

const groupBar = ({friend}:any) => {
    const {userData,setBaned, setMuted,setChatMembers, token,setMyBoolean , setUserData, setChanelType, setGetChat, setUpdateChat, setTempo, currUserData} = useMyStore();
    const {socket} = useSocketContext();
    const router = useRouter();
    const setMyGroupStor = (e: MouseEvent<HTMLButtonElement>) =>{
      e.preventDefault();
      setMyBoolean(true);
      setUserData(friend);
      setChanelType(true);
      const channelid = friend.id;
      const userid = currUserData.id;
      socket?.emit("getInfos",  {channelID:friend.id, userID:currUserData.id});
      socket?.emit("getGroupMessages",  {token, channelid});
      socket?.emit("isDuo",{channelid, userid} );
      setUpdateChat([]);
      setTempo([]);
      socket?.on("state", (data:any) => {
        setMuted(data);
        setBaned(data);
      });

      socket?.on("groupmessages", (data:any) => {
        setGetChat(data);
      });
      
      socket?.emit("getChannelMembers", {channelid:friend.id})
      socket?.on("members", (data:any) => {
        setChatMembers(data);
      })
      
    }
    return (
      <button onClick={setMyGroupStor}>
        <div className="relative h-[80px] flex-shrink-0 rounded-xl rounded-br-0 bg-[#2D0130] hover:bg-primary-purple-100 ">
          <img
            src={friend.avatar}
            alt="pic"
            className="w-[50px] h-[50px] rounded-full absolute mx-4 max-sm:mx-2 left-0 bottom-4"
            />
          <h1 className=" absolute font-Bomb max-sm:text-lg text-xl bottom-7 left-20 max-sm:left-[72px]">
            {friend.Name}
          </h1>
        </div>
      </button>
    );
  };
export default groupBar;