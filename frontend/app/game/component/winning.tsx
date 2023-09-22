"use client"
import React, { MouseEvent } from "react";
import { Result } from "../OneVsBot/GameComponents/gameInterfaces";
import { useRouter } from 'next/navigation';
import useWindowSize from 'react-use/lib/useWindowSize';
import Confetti from 'react-confetti';



const Winning = (props: Result) => {
    const { width, height } = useWindowSize()
    const router = useRouter();
    const handelExit = (e: MouseEvent<HTMLButtonElement>) => {
        router.push("/home");
    }
    return (
        <div className=' text-3xl text-white pt-[150px]  max-w-[1400px]  rounded-[20px]   w-full h-screen '>
            <Confetti width={width} height={height}/>
            <div className=' glass mx-3 pt-[10%] w-auto rounded-[20px] grid place-content-center border-[2px] border-[#FF1382] p-3 min-w-[350px]' >
                <div className='mb-[10px] grid grid-cols-3 justify-between place-content-center'>
                    <div className='flex justify-center items-center space-x-3'>
                        <div className={` w-[100px] lg:w-[200px] h-[100px] lg:h-[200px] rounded-full`} >
                            <img src={props?.user.avatar_url} alt="" className=' w-full h-full rounded-full ' />
                        </div>
                        <span className='font-Bomb text-xl sm:text-3xl'>You</span>
                    </div>
                    <div className=' flex justify-center space-x-2 sm:space-x-5 font-Bomb items-center text-2xl sm:text-4xl'>
                        <span className='font-size '>{props.playerScore}</span>
                        <p>-</p>
                        <span className=''>{props.bootScore}</span>
                    </div>
                    <div className=' flex justify-center items-center space-x-3'>
                        <span className=' font-Bomb text-xl sm:text-3xl'>{props.bot.username}</span>
                        <div className="w-[100px] lg:w-[200px] h-[100px] lg:h-[200px] rounded-full">
                            <img src={props?.bot.avatar_url} alt="" className=' w-full h-full rounded-full ' />
                        </div>
                    </div>
                    <div className="flex justify-center col-span-3 mt-[100px]">
                        <h5 className="font-Bomb text-xl sm:text-4xl">You Are The Winner</h5>
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

export default Winning;