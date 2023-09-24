"use client"

import { useSocketContext } from "@/app/socket";
import { getCookie } from "cookies-next";
import jwt,{ JwtPayload } from "jsonwebtoken";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


const RandomQueue = () => {

    const [currentUser, setCurrentUser] = useState<any>({})
    const token = getCookie("accessToken");
    const {socket} = useSocketContext();
    const [currentUserId , setCurrentUserId] = useState(0)
    const [queue, setQueue] = useState<any>({})
  
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
  
    const router = useRouter()
    useEffect(() => {
      if (socket) {
        socket.emit('AddtoQueue', {userid: currentUserId})
        socket.on('queue', (data: any) => {
          if (data?.receiver) {
            router.push('/game/OneVsOne/Random');
          }
          setQueue(data)
        });
      }
      return () => {
        socket?.emit("RemoveQueue", {userid: currentUserId})
      }
    }, [socket, currentUserId])
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
              <h1 className=' font-Bomb text-lg sm:text-2xl md:text-4xl text-white text-center'>waiting for opponent...</h1>
              <div>
                  <div className='  w-[100px] lg:w-[200px] h-[100px] lg:h-[200px]  rounded-ful'>
                    <img src="/Spectate.png" className=' w-full h-full rounded-full' alt="" />
                    <p className=' text-white text-lg sm:text-2xl md:text-4xl text-center py-5 font-black'>opponent</p>
                  </div>
              </div>
          </div>
  
      </div>
    </div>
    )
  }

  export default RandomQueue
  