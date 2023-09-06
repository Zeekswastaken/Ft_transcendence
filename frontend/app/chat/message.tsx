import React from 'react'

interface messageElements
{
    message: any;
}

const message = ({message} : messageElements) => { 
  return (
    <div className="p-1 m-4 flex flex-col">
      {/* <div className="chat chat-start">
        <div className="chat-image avatar">
          <div className="w-10 rounded-full">
            <img src="/Ellipse-1.png" />
          </div>
        </div>
        <div className="chat-header">
          Obi-Wan Kenobi
          <time className="text-xs opacity-50">12:45</time>
        </div>
        <div className="chat-bubble bg-yellow-700  break-words">
          {message.text}
        </div>
        <div className="chat-footer opacity-50">
        Delivered
        </div> */}
    {/* </div> */}
    <div className="chat chat-end">
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          <img src="/Ellipse-2.png" />
        </div>
      </div>
      <div className="chat-header">
        Anakin
        <time className="text-xs opacity-50">12:46</time>
      </div>
      <div className="chat-bubble bg-blue-700 break-words">
      {message.text}
        </div>
      <div className="chat-footer opacity-50">
        Seen at 12:46
      </div>
    </div>
  </div>
  )
}

export default message