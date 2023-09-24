import React from 'react'
import { useMyStore } from "./state";

interface messageElements
{
    messages: any;
}

const message = ({messages}:messageElements) => { 

  const {currUserData} = useMyStore();
  if (!messages || !messages.user || !messages.user.id || !messages.message) {
    return null;
  }

  return (
    messages.user.id != currUserData.id ? (
      <div className="p-1 m-4 flex flex-col">
        <div className="chat chat-start">
          <div className="chat-image avatar">
            <div className="w-12 rounded-full">
              <img src={messages.user.avatar_url} />
            </div>
          </div>
          <div className="chat-header">
            {messages.user.username}
            <time className="text-xs opacity-50">{messages.message.Created_at}</time>
          </div>
          <div className=" chat-bubble bg-[#360d36] break-words text-2xl text-white">
            {messages.message.text}
          </div>
        </div>
      </div>
    ) : (
      <div className="chat chat-end mr-4">
        <div className="chat-image avatar">
          <div className="w-12  rounded-full">
            <img src={messages.user.avatar_url} />
          </div>
        </div>
        <div className="chat-header">
        {messages.user.username}
          <time className="text-xs opacity-50">{messages.message.Created_at}</time>
        </div>
        <div className="chat-bubble bg-[#4A3A61]  break-words text-2xl text-white">
          {messages.message.text}
        </div>
      </div>
    ));
}

export default message