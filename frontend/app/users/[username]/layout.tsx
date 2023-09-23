"use client";

import React, { FormEvent, MouseEvent, use, useEffect, useState } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import ProfileSvgs from "@/components/tools/ProfileSvgs";
import Link from "next/link";
import { getCookie } from "cookies-next";
import axios from "axios";
import jwt, { JwtPayload } from "jsonwebtoken";
import { useUserDataContext } from "../../userDataProvider";
// import socket from "@/app/socket";
import { io } from "socket.io-client";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useSocketContext } from "@/app/socket";


interface Props {
  styles: string;
  title: string;
  link: string;
}

const ProfileTabs: React.FC<Props> = ({ title, link, styles }) => {
  const pathname = usePathname();
  useEffect(() => {}, [pathname]);
  return (
    <div className={styles}>
      {pathname === link ? (
        <div className=" text-primary-pink-300 flex space-x-3 pb-4 duration-300">
          <ProfileSvgs SvgColor="#FF1382" SvgName={title} />
          <p className=" pt-1 font-Heading text-2xl tracking-widest ">
            {title}
          </p>
        </div>
      ) : (
        <div className=" text-white flex space-x-3 pb-4 hover:text-primary-pink-300 duration-300">
          <ProfileSvgs SvgColor="#fff" SvgName={title} />
          <p className=" pt-1 font-Heading text-2xl tracking-widest ">
            {title}
          </p>
        </div>
      )}
    </div>
  );
};

interface ToggleTextButtonProps {
  initialText: string;
  newText: string;
  styles: string;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const User = useParams().username;
  const [currentUsername, setCurrentUsername] = useState<string>("");
  const [currentUserID, setCurrentUserID] = useState<number>();
  const Data = useUserDataContext();
  const {socket} = useSocketContext();
  const userData = Data?.user ;
  const token = getCookie("accessToken");
  useEffect(() => {
    try {
      const user = jwt.decode(token as string) as JwtPayload
      console.log("userid = ", user.id)
      // if (user) {
        console.log("Im here")
        setCurrentUsername(user.username as string)
        setCurrentUserID(user.id as number)
      // }
    } catch (error) {
      console.error('Error decoding token:');
    }
  }, [])

  const router = useRouter();
  const isPrivate = !userData?.privacy;
  const [isFriend, setIsFriend] = useState<boolean>(false);
  const [isPending, setIsPending] = useState<boolean>(false);
  const [isClicked, setIsClicked] = React.useState(true);
  const [receiver, setReceiverUsername] = useState("");
  const [Status, setStatus] = useState();
  const [isBlocking, setIsBlocking] = useState<boolean>(false);
  const [isBlocked, setIsBlocked] = useState<boolean>(false);
  
  
  useEffect(() => {
  socket?.on("ispending", (data:any) => {
    if (!data) {
      setIsPending(false);
    } else {
      setReceiverUsername(data.receiver_username);
      setIsPending(data.state);
      setIsClicked(data.state);
    }
  });
  socket?.on("isfriend", (data:any) => {
    if(!data) {
      setIsFriend(false);
    } else {
      setIsFriend(data);
    }
  })
  
  socket?.on('GetUserStatus', (data: any) => {
    if (data) {
      setStatus(data.status);
    }
  });

  socket?.on('isblocking', (data: any) => {
    if (data) {
      setIsBlocking(data);
    }
  });

  socket?.on("isblocked", (data:any) => {
    if (!data) {
      setIsBlocked(false);
    } else {
      setIsBlocked(data);
    }
  });
  return () => {
    socket?.off("isfriend")
    socket?.off("ispending");
  };
}, [socket, currentUserID, userData, isClicked, isPending, isFriend, Status, isBlocking, isBlocked]);


useEffect(() => {
  if (currentUserID && userData?.id) {
      console.log("currentUserID = ", currentUserID, "userData = ", userData?.id, "username = ", currentUsername);
      socket?.emit("checkPending", {
        userID: currentUserID,
        recipientID: userData.id,
      });
    
      // console.log("llllllllllll")
      socket?.emit("checkFriend", {
        userID: currentUserID,
        recipientID: userData.id,
      });
    }
  }, [currentUserID, userData, isPending, isFriend])

  const handleCancel = () => {
      socket?.emit("Unfriend", { userID: currentUserID, recipientID: userData?.id });
      setIsPending(false); // Clear the pending status
      setIsClicked(!isClicked);
      router.refresh();
  };

  const handleAddFriend = () => {
    if (!isPending && isClicked) {
      socket?.emit("sendFriendRequest", { userID: currentUserID, recipientID: Data?.user?.id });
    }
    setIsClicked(!isClicked);
  };

  const handleDecline = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    socket?.emit("denyFriendRequest", {userID: currentUserID, recipientID: Data?.user?.id});
    router.push(`/users/${Data?.user.username}/`)
  }
  
  const handleAccept = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    socket?.emit("acceptFriendRequest", {userID: currentUserID, recipientID: Data?.user?.id});
    router.push(`/users/${Data?.user.username}/`)
  }
  
  const handleUnfriend = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    socket?.emit("Unfriend", {userID: currentUserID, recipientID: Data?.user?.id});
    // router.push(`/users/${Data?.user.username}/`)
    router.refresh();
  }

  const handleUnblock = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    socket?.emit("Unblock", {userID: currentUserID, recipientID: Data?.user?.id});
    router.push(`/users/${Data?.user.username}/`)
  }

	socket?.emit('UserStatus', {username:userData?.username});
  //ISBLOCKING=======WACH KHAYNA BLOCKAK
  socket?.emit('isBlocking', {userID: currentUserID, recipientID: Data?.user?.id});
  //ISBLOCKED WACH BLOCKITI KHAYNA
  socket?.emit('isBlocked', {userID: currentUserID, recipientID: Data?.user?.id});
  let statusStyle
  if (Status) {
    if (Status === "Online")
      statusStyle = "bg-green-400";
    else if (Status === "Offline")
      statusStyle = "bg-red-400";
    else
      statusStyle = "bg-blue-400"
  }

  const avatar = userData?.avatar_url.replace("../frontend/public/", "/");
  return (
    <>
    {Data ? (
      <>
        {!isBlocking ? (
          <div className=" bg-[url('/neon-background2.jpeg')] bg-cover bg-center bg-no-repeat h-screen overflow-y-scroll no-scrollbar w-full">
            <div className=" 2xl:mt-[270px] lg:mt-[160px] mt-[50px] min-w-[400px] overflow-y-scroll w-full h-[80vh] no-scrollbar ">
              <div className=" grid grid-cols-1 2xl:grid-cols-3 mb-10 gap-y-3">
                {isPrivate && !isFriend && (userData?.username !== currentUsername)  ?  (
                  <div className=" 2xl:order-1 order-2 col-span-2  p-20">
                    <div className=" flex items-center place-content-center glass w-full 2xl:h-full">
                      <h1 className=" text-3xl font-Heading text-white tracking-wider">
                        This account is Private
                      </h1>
                    </div>
                  </div>
                ) : (
                  <div className=" h-auto 2xl:order-1 order-2 col-span-2 lg:mx-10 px-2 min-w-[400px] ">
                    {children}
                  </div>
                )}
                <div className="  mt-20 lg:mt-0 order-1 flex place-content-center">
                  <div className="  bg-[#321B38]/[0.7] shadow-2xl rounded-2xl w-[85%]">
                    <div className=" 2xl:mb-0 mt-[50px] grid place-content-center ">
                      <div className=" relative w-[150px] h-[150px] flex place-content-center border-4 border-primary-pink-300 rounded-full ">
                        <img
                          src={avatar}
                          alt="avatar"
                          className=" whandleAddFriend-full h-full rounded-full"
                        />
                        <div className={` mt-[120px] absolute place-content-center items-center w-[70px] h-[30px] ${statusStyle} flex  pt-1 rounded-[26px]`}>
                          <p className=" text-white/[0.9] tracking-wide font-Bomb ">{Status}</p>
                        </div>
                      </div>
                      <div className=" text-center pt-4 space-y-2 font-bold tracking-wider">
                        <p className=" text-3xl text-white overflow-hidden text-ellipsis ">{User}</p>
                      </div>
                    </div>
                    <div className=" grid place-items-center">
                      {userData?.Bio ? (
                      <div className="  bg-[#411941]/[0.8]  shadow-xl overflow-hidden whitespace-wrap mt-5 w-[75%] h-auto rounded-xl">
                        {/* max 180 character */}
                        <p className=" shadow-none text-white text-center font-Heading text-xl leading-9 tracking-normal p-5 ">{userData?.Bio}</p>
                      </div>

                      ) : ("")}
                      {isPrivate && !isFriend && (userData?.username !== currentUsername) ? (
                        <div className=" bg-[#411941]/[0.8]  shadow-xl overflow-hidden whitespace-wrap mt-10 w-[75%] rounded-xl mb-10">
                          <div className=" grid place-items-center items-center  h-[200px]">
                            <img
                              src="/eye.png"
                              width={50}
                              height={50}
                              alt="private"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className=" bg-[#411941]/[0.8]  shadow-xl mb-5 overflow-hidden whitespace-wrap mt-10 w-[75%] rounded-xl">
                          <div className=" px-14 pt-4 cursor-pointer">
                            <Link href={`/users/${User}`}>
                              <ProfileTabs
                                link={`/users/${User}`}
                                styles=""
                                title="Overview"
                              />
                            </Link>
                            {/* /* if current user is the same as the user in the url then show the settings tab */}
                            {currentUsername === User ? (
                              <Link href={`/users/${User}/settings`}>
                                <ProfileTabs
                                  link={`/users/${User}/settings`}
                                  styles=""
                                  title="Settings"
                                />
                              </Link>
                            ) : (
                              ""
                            )}
                            <Link href={`/users/${User}/friends`}>
                              <ProfileTabs
                                link={`/users/${User}/friends`}
                                styles=""
                                title="Friends"
                              />
                            </Link>
                            <Link href={`/users/${User}/groups`}>
                              <ProfileTabs
                                link={`/users/${User}/groups`}
                                styles=""
                                title="Channels"
                              />
                            </Link>
                          </div>
                        </div>
                      )}
                      { currentUsername !== User && !isFriend && (
                        <>
                          {!isBlocked ? (
                            <div className=" mt-10 mb-5 ">
                              {isPending && currentUsername === receiver ? (
                                <div className=" flex space-x-4 text-white font-Bomb text-2xl">
                                  <button onClick={handleAccept} className=" rounded-xl bg-green-500 hover:bg-green-500/[0.7] duration-300">
                                    <p className=" py-1 px-2">ACCEPT</p>
                                  </button>
                                  <button onClick={handleDecline} className=" rounded-xl  bg-red-500 hover:bg-red-500/[0.7] duration-300">
                                    <p className=" py-1 px-2">DECLINE</p>
                                  </button>
                                  {/* <div onClick={handleDecline}><XMarkIcon className=" h-7 w-7 text-red-600"/> </div>
                                  <div onClick={handleAccept}><CheckIcon className=" h-7 w-7 text-green-400"/></div> */}
                                </div>
                              ) : (
                                <>
                                  {isPending && currentUsername !== receiver ? (
                                    <>
                                    {isClicked ? (
                                      <button
                                        className="text-white font-Bomb text-2xl px-5 pt-3 pb-2 rounded-2xl bg-[#6E4778] hover:text-gray-100 hover:bg-[#8d549c] shadow-inner duration-300"
                                        onClick={handleCancel}
                                      >
                                        Cancel Request
                                      </button>
                                    ) : (
                                      <button
                                      className="text-white font-Bomb text-2xl px-5 pt-3 pb-2 rounded-2xl bg-[#6E4778] hover:text-gray-100 hover:bg-[#8d549c] shadow-inner duration-300"
                                      onClick={handleAddFriend}
                                      >
                                        Add Friend
                                      </button>
                                    )}
                                    </>
                                  ) : (
                                    <>
                                      {isClicked ? (
                                      <button
                                        className="text-white font-Bomb text-2xl px-5 pt-3 pb-2 rounded-2xl bg-[#6E4778] hover:text-gray-100 hover:bg-[#8d549c] shadow-inner duration-300"
                                        onClick={handleAddFriend}
                                      >
                                        Add friend
                                      </button>
                                    ) : (
                                      <button
                                      className="text-white font-Bomb text-2xl px-5 pt-3 pb-2 rounded-2xl bg-[#6E4778] hover:text-gray-100 hover:bg-[#8d549c] shadow-inner duration-300"
                                      onClick={handleCancel}
                                      >
                                        cancel Request
                                      </button>
                                    )}
                                    </>
                                    // </button>
                                  ) }
                                </>
                              )}
                            </div>
                          ) : (
                            <button onClick={handleUnblock} className="text-white my-10 font-Bomb text-xl px-5 pt-2 pb-1 rounded-2xl bg-[#6E4778] hover:text-gray-100 hover:bg-[#8d549c] shadow-inner duration-300 w-[135px]">
                              <p className=" py-1 px-2">UnBlock</p>
                            </button>
                          )}
                        </>
                      )}
                      { currentUsername !== User && isFriend ? (
                        <div className=" mt-20 mb-5 flex space-x-5">
                          <button onClick={handleUnfriend} className="text-white font-Bomb text-xl px-5 pt-2 pb-1 rounded-2xl bg-[#6E4778] hover:text-gray-100 hover:bg-[#8d549c] shadow-inner duration-300 w-[135px]">
                            <p className=" py-1 px-2">UnFriend</p>
                          </button>
                          {/* <SetButtonText styles="text-white font-Bomb text-xl px-5 pt-2 pb-1 rounded-2xl bg-[#6E4778] hover:text-gray-100 hover:bg-[#8d549c] shadow-inner duration-300 w-[135px]" initialText="Friends" newText="Add Friend" /> */}
                          <Link href={"/chat"} className=" text-white text-center font-Bomb text-xl px-5 pt-3 pb-2 rounded-2xl bg-[#AF0D63] hover:text-gray-100 hover:bg-[#cd237e] shadow-inner duration-300 w-[135px]">
                            Message
                          </Link>
                        </div>
                      ) : ("")}
                    </div>
                  </div>
                </div>
              </div>
              {/* <UserCard /> */}
            </div>
          </div>

        ) : (
          <div className=" w-full h-screen flex items-center place-content-center">
            <p className=" text-7xl text-white font-Bomb">{User} <span className=" text-primary-pink-300">Blocked You</span> </p>
          </div>    
        )}
      </>
    ) : (
      <div className=" w-full h-screen flex items-center place-content-center">
        <p className=" text-7xl text-white font-Bomb">{User} Does <span className=" text-primary-pink-300">Not Exist</span> </p>
      </div>
    )}
    </>
  );
}
