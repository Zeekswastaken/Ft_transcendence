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

const friendBar = (props:any) => {
  const {setMyBoolean , myBoolean} = useMyStore();
  return (
    <button onClick={() =>setMyBoolean(!myBoolean)}>
      <div className="relative h-[80px] flex-shrink-0 rounded-xl rounded-br-0 bg-[#2D0130] hover:bg-primary-purple-100 ">
        {/* <Image src="/vector.svg" width={40} height={40} alt="icon" className="absolute mx-4 right-2 bottom-8" /> */}
        {/* <Image src="/icons.png" width={40} height={40} alt="icon" className="absolute mx-4 right-2 bottom-8" /> */}
        <Image
          src="/Ellipse.png"
          width={50}
          height={50}
          alt="pic"
          className="absolute mx-4 left-0 bottom-4"
          />
        <h1 className=" absolute chat_text_username bottom-7 left-20">
          Judith
        </h1>
        <p className=" absolute chat_text_p bottom-3 left-20">judith juanita</p>
        <div className=" float-right mx-4 my-7 h-7 w-7 rounded-full bg-pink-700">
          <div className=" relative place-content-start h-7 w-7">
            <p className="  font-Bomb text-xl mx-1 place-content-center">+9</p>
          </div>
        </div>
      </div>
    </button>
  );
};

export default friendBar;
