"use client"
import React, { MouseEvent } from "react";
import { Result } from "../OneVsBot/GameComponents/gameInterfaces";
import { useRouter } from 'next/navigation';



const Losing = (props: Result) => {
    const router = useRouter();
    const handelExit = (e: MouseEvent<HTMLButtonElement>) => {
        router.push("/home");
    }
    return (
        <div className=' text-3xl text-white pt-[150px]  max-w-[1400px]  rounded-[20px]   w-full h-screen '>
            <div className=' glass mx-3 w-auto rounded-[20px] grid place-content-center border-[2px] border-[#FF1382] p-3 min-w-[350px]' >
                <div className='mb-[10px] grid grid-cols-3 justify-between place-content-center'>
                    <div className='flex justify-center items-center space-x-3'>
                        <div className={`h-[65%] sm:h-[65%] w-[50%] sm:w-[50%] bg-cover bg-center overflow-hidden rounded-full border-[3px] border-[#6E4778]`} >
                            <img src={props?.user.avatar_url} alt="" className=' w-full h-full ' />
                        </div>
                        <span className='font-Bomb text-xl sm:text-3xl'>You</span>
                    </div>
                    <div className=' flex justify-center space-x-2 sm:space-x-5 font-Bomb items-center text-2xl sm:text-4xl'>
                        <span className='font-size '>{props.playerScore}</span>
                        <p>-</p>
                        <span className=''>{props.bootScore}</span>
                    </div>
                    <div className=' flex justify-center items-center space-x-3'>
                        <span className=' font-Bomb text-xl sm:text-3xl'>Easy Bot</span>
                        <div className="h-[65%] sm:h-[65%] w-[50%] sm:w-[50%] bg-cover bg-center overflow-hidden rounded-full mr-[10px] border-[3px] border-primary-pink-300">
                            <img src={props?.bot.avatar_url} alt="" className=' w-full h-full ' />
                        </div>
                    </div>
                    <div className="flex justify-center col-span-3">
                        <h5 className="font-Bomb text-xl sm:text-4xl">You Lose</h5>
                    </div>
                </div>
                <div className='mt-[50px] flex justify-center font-Heading tracking-wide '>
                    <div className='ml-[20px]'>
                        <button className='bg-primary-pink-300 hover:bg-primary-pink-300/[0.7] duration-300 rounded-[10px] px-[20px] py-[10px]' onClick={handelExit}>Exit</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Losing;