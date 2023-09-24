"use client";
import DiscutionHeader from "./discutionHeader";
import SendMessage from "./sendMessage";
import ChatBox from "./chatBox";
import ChatMembers from "./chatMembers";
import ChatProfile from "./chatProfile";
import { useMyStore } from "./state";


function chatContent() {
  const { myBoolean, userData, chanelType, setChatMembers, baned, currUserData } = useMyStore();

  return <div className={` relative w-[1200px] max-xl:w-[900px] h-[90%]  m-4 bg-primary-purple-100 bg-opacity-80 shadow-md  rounded-2xl ${myBoolean ? "max-lg:w-full" : "max-lg:hidden"}`}>
    <DiscutionHeader />
  {chanelType ?(baned.isBanned ?(currUserData.id === baned.userID && userData.id === baned.channelID? (
    <p className=" w-full h-full flex justify-center items-center font-Glitch text-2xl max-xl:text-xl max-sm:text-sm">You Have Been Banned</p>
  ):(
    <>
    {chanelType ? <ChatMembers /> : <ChatProfile />}
    <ChatBox />
    <SendMessage />
    </>
    )):(<>
      {chanelType ? <ChatMembers /> : <ChatProfile />}
      <ChatBox />
      <SendMessage />
      </>)
    ):(<>
      {chanelType ? <ChatMembers /> : <ChatProfile />}
      <ChatBox />
      <SendMessage />
      </>)}
    </div>
}

export default chatContent;