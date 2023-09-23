"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import DiscutionHeader from "./discutionHeader";
import SendMessage from "./sendMessage";
import ChatBox from "./chatBox";
import initialContent, { Content } from "./content";
import ChatMembers from "./chatMembers";
import ChatProfile from "./chatProfile";
import { useMyStore } from "./state";
import { useSocketContext } from '../socket';


function chatContent() {
  const { myBoolean, userData, chanelType, setChatMembers, baned, currUserData } = useMyStore();
  const { socket } = useSocketContext();
  // useEffect(() =>{

  //   if(chanelType){
  //     socket?.emit("getChannelMembers", {channelid:userData.id})
  //     socket?.on("members", (data:any) => {
  //       setChatMembers(data);
  //     })
  //   }
  // }, [])

  return <div className={` relative w-[1200px] max-xl:w-[900px] h-[90%]  m-4 bg-primary-purple-100 bg-opacity-80 shadow-md  rounded-2xl ${myBoolean ? "max-lg:w-full" : "max-lg:hidden"}`}>
    <DiscutionHeader />
  {chanelType ?(baned.isBanned ?(currUserData.id === baned.userID && userData.id === baned.channelID? (null):(
    <>
    {chanelType ? <ChatMembers /> : <ChatProfile />}
    <ChatBox />
    <SendMessage />
    </>
    )):(<>
      {chanelType ? <ChatMembers /> : <ChatProfile />}
      <ChatBox />
      <SendMessage />
      </>)
    ):(<>
      {chanelType ? <ChatMembers /> : <ChatProfile />}
      <ChatBox />
      <SendMessage />
      </>)}
    </div>
}

export default chatContent;