import { type } from "os";
import React from "react";

type Props = {
  styles: string;
};

const GroupCard = ( {styles}:Props ) => {
  return (
    <div className={` ${styles} bg-[#3A0E3B] drop-shadow-[6px_5px_0_rgba(0,0,00.15)] h-[160px] rounded-xl`}>
      <div className=" h-[40%] bg-[url('/neon-background2.jpeg')] rounded-t-xl bg-cover bg-center "></div>
      <p className=" text-white font-Heading text-xl tracking-widest pt-3 px-4">
        Vestibulum
      </p>
      <div className=" flex justify-between mt-2 items-center">
        <div className=" flex space-x-2 mx-4">
          <div className=" bg-primary-pink-300 hover:bg-primary-pink-300/[0.8] duration-300 text-base rounded-lg font-Heading tracking-wider text-white py-1 px-3 ">
            <button>Chat</button>
          </div>
          <div className=" bg-[#6E4778] hover:bg-[#6E4778]/[0.8] duration-300 text-base rounded-lg font-Heading tracking-wider text-white py-1 px-3">
            <button>Joined</button>
          </div>
        
        </div>
        <div className=" flex   ">
          <div className="  rounded-full bg-[url('/avatars/avatar1.png')] bg-cover bg-center w-9 h-9 "></div>
          <div className="  rounded-full bg-[url('/avatars/avatar2.png')] bg-cover bg-center w-9 h-9 "></div>
          <div className="  rounded-full bg-[url('/avatars/avatar3.png')] bg-cover bg-center w-9 h-9 "></div>
        </div>
      </div>
    </div>
  );
};

const Groups = () => {
  return (
    <div className=" border-2 mt-10 border-primary-pink-300 rounded-[20px]">
      <div className=" glass w-full min-w-[380px]  h-auto  ">
        <div className=" px-10 md:px-20 pt-20 pb-12">
          <h1 className="  text-white font-Bomb text-4xl mb-4 break-all">
            Channels
          </h1>
          <div className=" overflow-auto no-scrollbar py-8  bg-[#2F0331] rounded-3xl">
            <div className=" overflow-y-auto no-scrollbar max-h-[450px] mx-4 md:mx-10 grid grid-cols-1 xl:grid-cols-2 gap-4 ">
              <GroupCard styles="animate-fade-up animate-delay-100"/>
              <GroupCard styles="animate-fade-up animate-delay-200"/>
              <GroupCard styles="animate-fade-up animate-delay-300"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Groups;
