"use client";
import React from "react"
import Profile from './profile';
import FriendBar from './friendBar';
import { useMyStore } from "./state";

function chatList({props}:any)
{
  const {setMyBoolean , myBoolean} = useMyStore();
  console.log(props);
    return (
    <div className={` relative w-[400px] h-[90%] p-1 m-4 rounded-2xl max-xl:w-[300px] ${myBoolean ? "max-lg:hidden" : "max-lg:w-full"}`}> {/* friends*/}
      <div>
        <ul className='flex flex-row overflow-x-auto whitespace-no-wrap space-x-4 scrollbar-hide'>
        {props?.map((friend:any) => {
              return <Profile key={friend.id} name="elipsse" img={friend.username} href="#" alt="test" online={true} />
          })}
        </ul>
      </div>
      <div className="relative w-full h-[93%] mt-2">
        <div className=" w-full h-full overflow-y-scroll scrollbar-hide rounded-2xl">
          <ul className=" flex flex-col  whitespace-no-wrap space-y-2">
          {props?.map((friend:any) => {
            <FriendBar name="elipsse" img="/avatars/avatar3.png" href="#" alt="test" online={true} handleAppState/>
          })}
            
          </ul>
        </div>
      </div>
    </div>);
}

export default chatList;