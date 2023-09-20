"use client"
import React, {MouseEvent, useEffect, useState } from 'react'
import { ReactP5Wrapper } from '@p5-wrapper/react'
import { getCookie } from 'cookies-next';
import jwt, { JwtPayload } from 'jsonwebtoken';
import sketch from '../GameComponents/Game';
import io, {Socket} from 'socket.io-client';
import { useRouter } from 'next/navigation';
import useWindowSize from 'react-use/lib/useWindowSize';
import Confetti from 'react-confetti'

const COM_LEVEL = 0.08;

const page = () => {
    const [user, setUser] = useState<JwtPayload>();
    const [playerScore, setPlayerScore] = useState<number>(0);
    const [bootScore, setBootScore] = useState<number>(0);
    const [socket, setSocket] = useState<Socket>();
    const [gameOver, setGameOver] = useState < boolean> (false);
    const [celebration, setCelebration] = useState <boolean> (false);

    const router = useRouter()
    const handelExit = (e: MouseEvent<HTMLButtonElement>) => {
        router.push("/home");
    }

    const { width, height } = useWindowSize()
    const token = getCookie("accessToken");

    useEffect(() => {
        try {
          const user = jwt.decode(token as string) as JwtPayload
          if (user)
          setUser(user)
      } catch (error) {
        console.error('Error decoding token:');
      }
    }, [token]);

    useEffect(() => {
        socket?.on('changeScore', (player: number, bot: number) => {
            setPlayerScore(player);
            setBootScore(bot);
            console.log("ChangeScore", playerScore, bootScore);
        });
        socket?.on('gameOver', (player: number, bot: number) => {
            setGameOver(true);
            if(player > bot) {
                setCelebration(true);
            }
        });
    }, [socket]);

    useEffect(() => { 
        const newSocket = io('http://10.14.2.7:3000');
        setSocket(newSocket);
        return () => {
            socket?.disconnect();
        }
    }, []);

    return (
        <div className=' text-3xl text-white pt-[150px]  max-w-[1400px]  rounded-[20px]   w-full h-screen '>
            {celebration && <Confetti width={width}height={height}/>}
            <div className=' glass mx-3 w-auto rounded-[20px] grid place-content-center border-[2px] border-[#FF1382] p-3 min-w-[350px]' >
                <div className='mb-[10px] grid grid-cols-3 justify-between place-content-center'>
                    <div className='flex justify-center items-center space-x-3'>
                        <div className={`h-[40px] sm:h-[60px] w-[40px] sm:w-[60px] bg-cover bg-center overflow-hidden rounded-full border-[3px] border-[#6E4778]`} >
                            <img src={user?.avatar_url} alt="" className=' w-full h-full ' />
                        </div>
                        <span className='font-Bomb text-xl sm:text-3xl'>You</span>
                    </div>
                    <div className=' flex justify-center space-x-2 sm:space-x-5 font-Bomb items-center text-2xl sm:text-5xl'>
                        <span className=' '>{playerScore}</span>
                        <p>-</p>
                        <span className=''>{bootScore}</span>
                    </div>
                    <div className=' flex justify-center items-center space-x-3'>
                        <span className=' font-Bomb text-xl sm:text-3xl'>Hard Bot</span>
                        <div className="h-[40px] sm:h-[60px] w-[40px] sm:w-[60px] bg-cover bg-center overflow-hidden rounded-full mr-[10px] border-[3px] border-primary-pink-300">
                            <img src='/hard.jpeg' alt="" className=' w-full h-full ' />
                        </div>
                    </div>
                </div>
                <div className=' grid place-items-center items-center'>
                    <div className='border-[2px] border-gray w-fit'>
                        <ReactP5Wrapper sketch={sketch}
                                        COM_LEVEL={COM_LEVEL}
                                        socket={socket}
                                        gameOver={gameOver}
                                        />
                    </div>
                </div>
                <div className='mt-[20px] flex justify-center font-Heading tracking-wide '>
                    <div className='ml-[20px]'>
                        <button className='bg-primary-pink-300 hover:bg-primary-pink-300/[0.7] duration-300 rounded-[10px] px-[20px] py-[10px]' onClick={handelExit}>Exit</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default page;