"use client";
import reaact from "react";
import Image from "next/image";
import GroupList from "./groupList";
import { useMyStore } from "./state";


function chatProfile() {
  const {setMyBoolean , myBoolean, userData} = useMyStore();
  if (!userData.user)
    return null;

  return (
    <div className="drawer drawer-end absolute w-[40%] h-[60%] max-sm:h-[90%] right-0 max-sm:w-full">
      <input
        id="my-drawer-4"
        type="checkbox"
        className="drawer-toggle bg-pink-600 right-0 "
      />
      <div className="drawer-content">
        <label
          htmlFor="my-drawer-4"
          className="drawer-button absolute mx-4 my-4 right-2 bottom-full pb-2 max-sm:pb-5"
        >
          <img src="/avatars/avatar1.png" alt="icon" className="w-[40px] max-sm:w-[30px]" />
        </label>
      </div>
      <div className="drawer-side flex flex-col absolute h-[95%] w-full px-4 z-30">
        <label htmlFor="my-drawer-4" className="drawer-overlay"></label>
        <div className="w-full mx-2 bg-[#4C2556] rounded-2xl">
          <div className="menu h-[50%] w-full flex-col bg-[#321B38] rounded-2xl items-center">
            <img src={userData.user.avatar_url} alt="icon" className="h-[100px] w-[100px] max-sm:mt-0 rounded-full max-xl:W-[65%]"/>
          </div>
          <div className=" space-y-2 my-4 flex-col flex items-center">
            <div className="px-8 bg-purple-700 h-[40px] rounded-md font-Bomb text-md text-white flex justify-center items-center">View profile</div>
            <div className="px-8 bg-pink-700 h-[40px] rounded-md font-Bomb text-md text-white flex justify-center items-center">chaleng to game</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default chatProfile;
