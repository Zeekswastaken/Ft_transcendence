"use client";
import React from "react"
import { useMyStore } from "./state";

function emptyChatList()
{
  const { myBoolean} = useMyStore();
    return (
    <div className={` relative w-[500px] h-[90%] bg-primary-purple-200 bg-opacity-60 p-1 m-4 rounded-2xl max-xl:w-[400px] ${myBoolean ? "max-lg:hidden" : "max-lg:w-full"}`}> {/* friends*/}
        <p className=" w-full h-full flex justify-center items-center font-Bomb text-2xl max-xl:text-xl">You have No friends</p>
    </div>);
}

export default emptyChatList;