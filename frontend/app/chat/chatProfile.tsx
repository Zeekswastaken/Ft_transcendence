"use client";
import reaact from "react";
import Image from "next/image";
import GroupList from "./groupList";

function chatProfile() {
  return (
    <div className="drawer drawer-end absolute w-[60%] max-2xl:w-[70%] h-[60%] max-sm:h-[90%] right-0 max-sm:w-full">
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
        <div className="h-[95%] w-full mx-2 bg-[#4C2556] rounded-2xl">
          <div className="menu h-[50%] w-full flex-col bg-[#321B38] rounded-2xl items-center">
            <img src="/avatars/avatar1.png" alt="icon" className="h-[60%] max-sm:h-[60%] max-sm:mt-0 rounded-full max-xl:W-[65%]"/>
            <div className="font-Glitch text-2xl  bg-purple-700 max-lg:text-lg px-10 mt-4 h-[50px] max-sm:h-[50px] max-sm:mt-4 mx-8 rounded-xl flex justify-center items-center">View profile</div>
          </div>
          <div className="h-[50%] flex-col flex items-center justify-center">
            <div className="my-2 px-10 bg-pink-700 h-[50px] rounded-2xl font-Glitch text-xl max-lg:text-lg text-white flex justify-center items-center">chaleng to game</div>
            
          </div>
        </div>
      </div>
    </div>
  );
}

export default chatProfile;
