"use client";
import React from "react"
import { useMyStore } from "./state";

function emptyGroupList()
{
  const { myBoolean} = useMyStore();
    return (
    <div className="relative h-full max-sm:h-[90%] max-xl:h-[95%] bg-primary-purple-200 bg-opacity-60 p-1 rounded-2xl">
        <p className=" w-full h-full flex justify-center items-center font-Bomb text-2xl max-xl:text-xl">You Have No Groups</p>
    </div>);
}

export default emptyGroupList;