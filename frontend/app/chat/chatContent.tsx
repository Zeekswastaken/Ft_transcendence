"use client";
import React, { useState } from "react";
import Image from "next/image";
import DiscutionHeader from "./discutionHeader";
import SendMessage from "./sendMessage";
import ChatBox from "./chatBox";
import initialContent, { Content } from "./content";
import ChatMembers from "./chatMembers";
import { useMyStore } from "./state";


function chatContent() {
  const [content, setContent] = useState<content[]>(initialContent);
  const addContent = (newContent: initialContent) => {
    setContent([...content, newContent]);
  };
  const {myBoolean} = useMyStore();

  return (
    <div className={` relative w-[1200px] h-[90%]  m-4 bg-primary-purple-100 bg-opacity-80 shadow-md  rounded-2xl ${myBoolean ? "max-lg:w-full" : "max-lg:hidden"}`}>
      {" "}
      {/* chat*/}
      <DiscutionHeader />
      <ChatMembers />
      <ChatBox content={content} />
      <SendMessage addContent={addContent} />
    </div>
  );
}

export default chatContent;