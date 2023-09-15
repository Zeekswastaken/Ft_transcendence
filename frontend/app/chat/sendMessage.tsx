"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import SendMessage from "./sendMessage";
import SendButton from "./SendButton";
import { useSocketContext } from '../socket';
import initialContent, { Content } from "./content";
import { useMyStore } from "./state";


interface addContentProps {
  addContent: (newContent: initialContent) => void;
}

const sendMessage = ({ addContent }: addContentProps) => {

  const {token, userData, setMessage} = useMyStore();
  const {socket} = useSocketContext();
  const [value, setValue] = useState("");

  const submitSendMessage = (e) => {
    e.preventDefault();
    if (value.trim() != "") {
      const newContent: initialContent = {
        id: Math.floor(Math.random() * 1000000),
        text: value,
      };
      addContent(newContent);
      setValue("");
    }
  };

  const handlSendMessage = (e) => {
    if (e.keyCode == 13 && e.shiftKey == false) {
      e.preventDefault();
      if (value.trim() != "") {
        // const newContent: initialContent = {
        //   id: Math.floor(Math.random() * 1000000),
        //   text: value,
        // };
        // addContent(newContent);
        const receiver = userData.user.username;
        const channelid = userData.channelid;
        console.log("value = "+value);
        socket?.emit("Duo",  {token, message:value, receiver, channelid});
        socket?.emit("getmessages",  {token, channelid});
        setValue("");
      }
    }
  };
  
  // useEffect(() => {
    console.log("start");
    console.log("socket id = " + socket.id);
    socket?.on("messages", (data:any) => {
      console.log("it works");
      console.log(data);
      // setMessage(data);
    })
    console.log("end")
  // },[])
  // useEffect(() => {
  //   console.log("heeer inside");
  //   socket?.on( "getmessages", (data:any) => {
  //     console.log(data);
  //     // setMessage(data);
  //   })
  // },[value])

  return (
    <form onSubmit={submitSendMessage} onKeyDown={handlSendMessage}>
      <div className="flex justify-center absolute bottom-3 w-full h-16">
        <div className="flex items-center px-3 py-2 rounded-lg w-[90%] h-full bg-[#4F2150]">
          <button
            type="button"
            className="p-2 text-gray-500 rounded-lg cursor-pointer hover:bg-[#2D0130]"
          >
            <Image
              src="/avatars/avatar1.png"
              width={35}
              height={35}
              alt="icon"
              className=" bottom-4 space-y-2"
            />
          </button>
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
    </form>
  );
};

export default sendMessage;
