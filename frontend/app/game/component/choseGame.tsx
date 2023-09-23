"use client"
import React, { MouseEvent } from "react";
import { getCookie } from "cookies-next";
import jwt,{ JwtPayload } from "jsonwebtoken";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


const GameOponent = () => {

    const [currentUser, setCurrentUser] = useState<any>({})
    const token = getCookie("accessToken");
    const [countDown, setCountdown] = useState(10);
  
    const router = useRouter()
  
    useEffect(() => {
      try {
        const user = jwt.decode(token as string) as JwtPayload
        if (user) {
          setCurrentUser(user)
        }
      } catch (error) {
      }
    }, [])

    const handleCountDown = () => {
        if(countDown > 0) {
            setCountdown(countDown - 1);
        } else {
            router.push("/home");
        }
    }
    
    useEffect(() => {
        const timerId = setTimeout(handleCountDown, 1000);

        return () => {
          clearTimeout(timerId);
        };
    }, [countDown]);

    const handelExit = (e: MouseEvent<HTMLButtonElement>) => {
      router.push("/home");
  }
    
    return (
      <div className=" flex place-content-center items-center w-full pt-0 lg:pt-[200px] h-screen max-w-[1300px] min-w-[350px] ">
        <div className=" grid grid-row-3 pb-10 items-center place-content-center w-full mx-1 h-[480px]  xl:h-[700px] glass rounded-xl ">
          <div className='mx-10 items-center place-items-center gap-5'>
              <div className="flex-1 justify-center">
                  <h1 className=' font-Bomb text-lg sm:text-2xl md:text-4xl text-white text-center'>There Is No Opponent To Play With</h1>
              </div>
                  <h1 className=" font-Bomb text-white text-center text-3xl mt-[30px]">{countDown} s</h1>
          </div>
          <div className='mt-[50px] flex justify-center font-Heading tracking-wide '>
              <div className='ml-[20px]'>
                  <button className='text-white bg-primary-pink-300 hover:bg-primary-pink-300/[0.7] duration-300 rounded-[10px] px-[20px] py-[10px]' onClick={handelExit}>Back Home</button>
              </div>
            </div>
        </div>
    </div>
    )
  }

  export default GameOponent