"use client";
import React, { useState } from "react";
import { useMyStore } from "./state";


function emptyChatContent() {

  const {myBoolean} = useMyStore();

  return (
    <div className={` relative w-[1200px] max-xl:w-[900px] h-[90%]  m-4 bg-primary-purple-100 bg-opacity-80 shadow-md  rounded-2xl ${myBoolean ? "max-md:w-full" : "max-md:hidden"}`}>
        <p className=" w-full h-full flex justify-center items-center font-Glitch text-2xl max-xl:text-xl">You have To select a conversation</p>
    </div>
  );
}

export default emptyChatContent;