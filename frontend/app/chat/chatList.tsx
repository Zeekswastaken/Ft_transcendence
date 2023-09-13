"use client";
import React from "react"
import Profile from './profile';
import FriendBar from './friendBar';
import { useMyStore } from "./state";

function chatList({userFriends}:any)
{
  const {setMyBoolean , myBoolean} = useMyStore();
  console.log(userFriends);
  {userFriends?.map((freind:any) => {
    console.log(freind.username);
  })}
    return (
    <div className={` relative w-[500px] h-[90%] p-1 m-4 rounded-2xl max-xl:w-[400px] glass ${myBoolean ? "max-lg:hidden" : "max-lg:w-full"}`}> {/* friends*/}
      <div>
        <ul className='flex flex-row overflow-x-auto whitespace-no-wrap space-x-4 no-scrollbar'>
        {userFriends?.map((friend:any) => {
              return <Profile friend={friend} />
          })}
        </ul>
      </div>
      <div className="relative w-full h-[93%] mt-2">
        <div className=" w-full h-full overflow-y-scroll no-scrollbar rounded-2xl">
          <ul className=" flex flex-col  whitespace-no-wrap space-y-2">
          {userFriends?.map((friend:any) => {
              return <FriendBar friend={friend} />
          })}
          </ul>
        </div>
      </div>
    </div>);
}

export default chatList;