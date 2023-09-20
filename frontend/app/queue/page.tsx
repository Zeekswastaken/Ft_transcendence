"use client"
import React, { useEffect, useState } from 'react'
import { useUserDataContext } from '../userDataProvider'
import jwt,{ JwtPayload } from 'jsonwebtoken'
import { getCookie } from 'cookies-next'

const page = () => {
    // const userData = useUserDataContext()?.user
    // console.log(userData)
    const [currentUser, setCurrentUser] = useState<{}>({})
    const token = getCookie("accessToken");
    useEffect(() => {
        try {
          const user = jwt.decode(token as string) as JwtPayload
          if (user) {
            setCurrentUser(user)
          }
        } catch (error) {
          console.error('Error decoding token:');
        }
      }, [])
      console.log(currentUser)
    return (
    <div className=" flex place-content-center items-center w-full pt-0 lg:pt-[200px] h-screen max-w-[1300px] min-w-[350px] ">
        <div className=" pt-[150px] pb-10 place-content-center w-full mx-1 h-[480px]  xl:h-[700px] bg-black rounded-xl ">
            <div className=' grid grid-cols-3 mx-10 items-center place-items-center gap-5'>
                <div>
                    <div className=' w-[100px] lg:w-[200px] h-[100px] lg:h-[200px] rounded-full'>
                        <img src={currentUser?.avatar_url} className='w-full h-full rounded-full' alt="" />
                    </div>
                </div>
                <h1 className=' font-Bomb text-lg sm:text-2xl md:text-4xl text-white text-center '>waiting for opponent...</h1>
                <div>
                    <div className='  w-[100px] lg:w-[200px] h-[100px] lg:h-[200px]  rounded-full bg-blue-500'></div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default page