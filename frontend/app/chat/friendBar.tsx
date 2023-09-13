"use client";
import React from "react";
import Image from "next/image";
import ChatContent from "./chatContent";
import { useMyStore } from "./state";

// const renderChat = (e) => {
//   e.preventDefault();
//   const {setHidden , hidden} = useGenerateStor();
//   // console.log(hidden);
//   setHidden;
//   // console.log(hidden);
// }

const friendBar = ({friend}:any) => {
  const {setMyBoolean , myBoolean} = useMyStore();
  return (
    <button onClick={() =>setMyBoolean(true)}>
      <div className="relative h-[80px] flex-shrink-0 rounded-xl rounded-br-0 bg-[#2D0130] hover:bg-primary-purple-100 ">
        {/* <Image src="/vector.svg" width={40} height={40} alt="icon" className="absolute mx-4 right-2 bottom-8" /> */}
        {/* <Image src="/icons.png" width={40} height={40} alt="icon" className="absolute mx-4 right-2 bottom-8" /> */}
        <img
          src={friend.avatar_url}
          alt="pic"
          className="w-[50px] h-[50px] rounded-full absolute mx-4 left-0 bottom-4"
          />
        <h1 className=" absolute chat_text_username bottom-7 left-20">
          {friend.username}
        </h1>
        {/* <p className=" absolute chat_text_p bottom-3 left-20">{friend.username}</p> */}
        <div className=" float-right mx-4 my-7 h-7 w-7 rounded-full bg-pink-700 blur-sm">
          <div className=" relative place-content-center items-center h-7 w-7">
          </div>
        </div>
      </div>
    </button>
  );
};

export default friendBar;
