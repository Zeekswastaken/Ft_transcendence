"use client";

import React, { KeyboardEvent, MouseEvent, useEffect, useState } from "react";
import Image from "next/image";
import SendMessage from "./sendMessage";
import SendButton from "./SendButton";
import { useSocketContext } from '../socket';
import initialContent, { Content } from "./content";
import { useMyStore } from "./state";
import { current } from "@reduxjs/toolkit";
import { useRouter } from "next/navigation";


interface addContentProps {
  addContent: (newContent: initialContent) => void;
}

const sendMessage = ({ addContent }: addContentProps) => {

  const {muted, tempo, setTempo, token, userData, setMessage,getChat, setGetChat, currUserData, setUpdateChat, updateChat, setNotification, setChanelType, chanelType} = useMyStore();
  const {socket} = useSocketContext();
  const [value, setValue] = useState("");
  const router = useRouter();


  const submitSendMessage = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (value.trim() != "") {
      // const newContent: initialContent = {
      //   id: Math.floor(Math.random() * 1000000),
      //   text: value,
      // };
      // addContent(newContent);
      if (!chanelType){

        const receiver = userData.user.username;
        const channelid = userData.channelid;
        socket?.emit("Duo",  {token, message:value, receiver, channelid});;
        const message = {text:value, Created_at:"15:15" };
        const obj = {user:currUserData, message, channelid};
        setTempo([...tempo, obj]);
        socket?.emit("obj", {obj, receiver});
      }
      else{

        const channelid = userData.id;
          const message = {text:value, Created_at:"15:15" };
          const obj = {user:currUserData, message, channelid};
          setTempo([...tempo, obj]);
          socket?.emit("ToRoom", {Token:token, message:value, channelid});
      }
      setValue("");
    }
  };

  const handlSendMessage = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.keyCode == 13 && e.shiftKey == false) {
      e.preventDefault();
      if (value.trim() != "") {
        if (!chanelType){

        const receiver = userData.user.username;
        const channelid = userData.channelid;
        socket?.emit("Duo",  {token, message:value, receiver, channelid});;
        const message = {text:value, Created_at:"15:15" };
        const obj = {user:currUserData, message, channelid};
        setTempo([...tempo, obj]);
        socket?.emit("obj", {obj, receiver});
        }
        else{
          const channelid = userData.id;
          const message = {text:value, Created_at:"15:15" };
          const obj = {user:currUserData, message, channelid};
          setTempo([...tempo, obj]);
          socket?.emit("ToRoom", {Token:token, message:value, channelid});
        }
        setValue("");
      }
    }
  };
  
  // useEffect(() => {
  //   console.log("it works twice");
  //   socket?.on("OBJ", (data:any) => {
  //     console.log("it works");
  //     console.log(data);
  //     setUpdateChat(data);
  //   })
  //   console.log("end");
  // },[])
  useEffect(() => {
    socket?.on( "ToDuo", (data:any) => {
      setNotification(data);
    })
  },[])
  console.log(muted);
  return ((!muted.isMuted) && (currUserData.id != muted.userID)? (
    <form onSubmit={submitSendMessage} onKeyDown={handlSendMessage}>
      <div className="flex justify-center absolute bottom-3 w-full h-16">
        <div className="flex items-center px-3 py-2 rounded-lg w-[90%] h-full bg-[#4F2150]">
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            type="text"
            rows="1"
            className=" my-1 py-4 resize-none text-white mx-4 p-2.5 w-full text-sm  bg-[#4F2150] rounded-lg focus:outline-none no-scrollbar "
            placeholder="Type here ..."
          ></textarea>
          <SendButton />
        </div>
      </div>
    </form>):null
  )
};

export default sendMessage;
