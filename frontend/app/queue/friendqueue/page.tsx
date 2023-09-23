"use client"

import { useSocketContext } from "@/app/socket";
import { useInviteFriendData } from "@/components/tools/Modal";
import { count } from "console";
import { getCookie } from "cookies-next";
import jwt,{ JwtPayload } from "jsonwebtoken";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


const FriendQueue = () => {

    const [currentUser, setCurrentUser] = useState<any>({})
    const token = getCookie("accessToken");
    const {socket} = useSocketContext();
    const [currentUserId , setCurrentUserId] = useState(0)
    const [queue, setQueue] = useState<any>({})
    const {inviteFriendData} = useInviteFriendData();
    const [countDown, setCountdown] = useState(30);
  
    const router = useRouter()
  
    useEffect(() => {
      try {
        const user = jwt.decode(token as string) as JwtPayload
        if (user) {
          setCurrentUser(user)
          setCurrentUserId(user.id)
        }
      } catch (error) {
        console.error('Error decoding token:');
      }
    }, [])
    useEffect(() => {
      socket?.on("acceptedqueue", (data:any) => {
        if (data.status === "accepted")
          router.push("/game/OneVsOne/Random")
      })
      return () => {
        socket?.emit("RemoveQueue", {userid: currentUserId});
      }
    }, [socket, currentUserId]);

    const handleCountDown = () => {
        if(countDown > 0) {
            setCountdown(countDown - 1);
        } else {
            socket?.emit("RemoveQueue", {userid: currentUserId});
            router.push("/home");
        }
    }
    
    useEffect(() => {
        const timerId = setTimeout(handleCountDown, 1000);

        return () => {
          clearTimeout(timerId);
        };
    }, [countDown]);
    
    return (
      <div className=" flex place-content-center items-center w-full pt-0 lg:pt-[200px] h-screen max-w-[1300px] min-w-[350px] ">
      <div className=" flex pb-10 items-center place-content-center w-full mx-1 h-[480px]  xl:h-[700px] glass rounded-xl ">
        <div className=' grid grid-cols-3 mx-10 items-center place-items-center gap-5'>
            <div>
                <div className=' w-[100px] lg:w-[200px] h-[100px] lg:h-[200px] rounded-full'>
                    <img src={currentUser?.avatar_url} className='w-full h-full rounded-full' alt="" />
                    <p className=' text-white text-lg sm:text-2xl md:text-4xl text-center py-5 font-black'>{currentUser?.username}</p>
                </div>
            </div>
            <div className="flex-1 justify-center">
                <h1 className=' font-Bomb text-lg sm:text-2xl md:text-4xl text-white text-center'>waiting for opponent...</h1>
                <h1 className=" font-Bomb text-white text-center text-3xl mt-[30px]">{countDown} s</h1>
            </div>
            <div>
                <div className='  w-[100px] lg:w-[200px] h-[100px] lg:h-[200px]  rounded-ful'>
                <img src={inviteFriendData?.receiver.avatar_url} className=' w-full h-full rounded-full' alt="" />
                <p className=' text-white text-lg sm:text-2xl md:text-4xl text-center py-5 font-black'>{inviteFriendData?.receiver.username}</p>
                </div>
            </div>
        </div>
  
      </div>
    </div>
    )
  }

  export default FriendQueue