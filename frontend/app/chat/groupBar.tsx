"use client";
import React, { MouseEvent } from "react";
import Image from "next/image";
import ChatContent from "./chatContent";
import { useSocketContext } from '../socket';
import { useMyStore } from "./state";

const groupBar = ({friend}:any) => {
    const {token,setMyBoolean , setUserData, setChanelType, setGetChat, setUpdateChat, setTempo, currUserData} = useMyStore();
    const {socket} = useSocketContext();
    const setMyGroupStor = (e: MouseEvent<HTMLButtonElement>) =>{
      e.preventDefault();
      setMyBoolean(true);
      setUserData(friend);
      setChanelType(true);
      const channelid = friend.id;
      const userid = currUserData.id;
      socket?.emit("getGroupMessages",  {token, channelid});
    socket?.emit("isDuo",{channelid, userid} );
      setUpdateChat([]);
      setTempo([]);
      // socket?.on("isduo", (data:any)=>{
      //   console.log(data);
      //   setChanelType(data.bool);
      // });
      // console.log("Done");
      socket?.on("groupmessages", (data:any) => {
        setGetChat(data);
      })
    }
    return (
      <button onClick={setMyGroupStor}>
        <div className="relative h-[80px] flex-shrink-0 rounded-xl rounded-br-0 bg-[#2D0130] hover:bg-primary-purple-100 ">
          {/* <Image src="/vector.svg" width={40} height={40} alt="icon" className="absolute mx-4 right-2 bottom-8" /> */}
          {/* <Image src="/icons.png" width={40} height={40} alt="icon" className="absolute mx-4 right-2 bottom-8" /> */}
          <img
            src="/avatars/avatar3.png"
            alt="pic"
            className="w-[50px] h-[50px] rounded-full absolute mx-4 max-sm:mx-2 left-0 bottom-4"
            />
          <h1 className=" absolute font-Bomb max-sm:text-lg text-xl bottom-7 left-20 max-sm:left-[72px]">
            {friend.Name}
          </h1>
          {/* <p className=" absolute chat_text_p bottom-3 left-20">{friend.user.username}</p> */}
          <div className=" float-right mx-4 my-7 h-7 max-sm:h-5 max-sm:w-5 rounded-full bg-pink-700 blur-sm">
            <div className=" relative place-content-center items-center h-7 w-7">
            </div>
          </div>
        </div>
      </button>
    );
  };
export default groupBar;