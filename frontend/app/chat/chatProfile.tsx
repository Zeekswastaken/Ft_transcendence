"use client";
import react, { MouseEvent } from "react";
import { useMyStore } from "./state";
import { useRouter } from "next/navigation";
import { useSocketContext } from "../socket";


function chatProfile() {
  const {userData, currUserData} = useMyStore();
  const router = useRouter()
  function showProfile () {
    router.push("/users/" + userData.user.username);
  }
  const {socket} = useSocketContext()
  function chaleng (e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    socket.emit("AddtoInviteQueue", {userid: currUserData.id, receiver: userData.user.username});
    socket.on("pendingqueue", (data:any) => {
      router.push("/queue/friendqueue")
    })
  }
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
          <img src="/Vector.svg" alt="icon" className="w-[40px] max-sm:w-[30px]" />
        </label>
      </div>
      <div className="drawer-side flex flex-col absolute h-[95%] w-full px-4 z-30">
        <label htmlFor="my-drawer-4" className="drawer-overlay"></label>
        <div className="w-full mx-2 bg-[#4C2556] rounded-2xl">
          <div className="menu h-[50%] w-full flex-col bg-[#321B38] rounded-2xl items-center">
            <img src={userData.user.avatar_url} alt="icon" className="h-[100px] w-[100px] max-sm:mt-0 rounded-full max-xl:W-[65%]"/>
          </div>
          <div className=" space-y-2 my-4 flex-col flex items-center">
            <button onClick={showProfile} className="px-8 bg-purple-700 h-[40px] rounded-md font-Bomb text-md text-white flex justify-center items-center">View profile</button>
            <button onClick={chaleng} className="px-8 bg-pink-700 h-[40px] rounded-md font-Bomb text-md text-white flex justify-center items-center">chaleng to game</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default chatProfile;
