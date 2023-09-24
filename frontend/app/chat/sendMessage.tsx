"use client";

import React, { KeyboardEvent, MouseEvent, useEffect, useState } from "react";
import SendButton from "./SendButton";
import { useSocketContext } from '../socket';
import { useMyStore } from "./state";



const sendMessage = () => {

  const {muted, token, userData, currUserData, setUpdateChat, chanelType} = useMyStore();
  const {socket} = useSocketContext();
  const [value, setValue] = useState("");

  const submitSendMessage = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (value.trim() != "") {
      if (!chanelType){

          const now = new Date();
          const hours = now.getHours();
          const minutes = now.getMinutes();
          const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
          const receiver = userData.user.username;
          const channelid = userData.channelid;
          socket?.emit("Duo",  {token, message:value, receiver, channelid});
          const message = {text:value, Created_at:formattedTime };
          const obj = {user:currUserData, message, channelid};
          setUpdateChat(obj);
          socket?.emit("obj", {obj, receiver});
      }
      else{
          const now = new Date();
          const hours = now.getHours();
          const minutes = now.getMinutes();
          const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
          const channelid = userData.id;
          const message = {text:value, Created_at:formattedTime};
          const obj = {user:currUserData, message, channelid};
          setUpdateChat(obj);
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
          const now = new Date();
          const hours = now.getHours();
          const minutes = now.getMinutes();
          const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
          const receiver = userData.user.username;
          const channelid = userData.channelid;
          socket?.emit("Duo",  {token, message:value, receiver, channelid});
          const message = {text:value, Created_at:formattedTime };
          const obj = {user:currUserData, message, channelid};
          setUpdateChat(obj);
          socket?.emit("obj", {obj, receiver});
        }
        else{
          const now = new Date();
          const hours = now.getHours();
          const minutes = now.getMinutes();
          const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
          const channelid = userData.id;
          const message = {text:value, Created_at:formattedTime};
          const obj = {user:currUserData, message, channelid};
          setUpdateChat(obj);
          socket?.emit("ToRoom", {Token:token, message:value, channelid});
        }
        setValue("");
      }
    }
  };

  return (chanelType ?(muted.isMuted ?(currUserData.id === muted.userID && userData.id === muted.channelID? (
    <div className="flex justify-center absolute bottom-3 w-full h-16">
      <p className="flex justify-center items-center font-Bomb">you have been muted</p>
    </div>
  ):(
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
  </form>)):(<form onSubmit={submitSendMessage} onKeyDown={handlSendMessage}>
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
    </form>)
  ):(<form onSubmit={submitSendMessage} onKeyDown={handlSendMessage}>
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
  </form>))
};

export default sendMessage;
