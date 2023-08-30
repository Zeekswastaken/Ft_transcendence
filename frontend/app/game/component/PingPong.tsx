"use client"
import React, { useRef, useEffect, useState } from 'react'
import { render, initVars } from './render';
import io, {Socket} from 'socket.io-client';


const PingPong = () => {

    const canvasRef = useRef(null);
    const [startGame, setStartGame] = useState(false);
    const [initVarsStatus, setInitVars] = useState(false);
    const [p1Score, setP1Score] = useState<number>(0);
    const [p2Score, setP2Score] = useState<number>(0);
    const [socket, setSocket] = useState<Socket>();

    const handelScore = (p: number) => {
        p === 1 ? setP1Score((p1Score) => p1Score + 1) : setP2Score(p2Score => p2Score + 1);
    }


    const handelStartGame = () => {
        setStartGame(!startGame);
        socket?.emit("Duo", "Hello From Hamza Client");
        console.log("Start game is Good");
    }

    useEffect(() => {
        socket?.on('send', (message) => {
            console.log('Message from server:', message);
        });
    }, [socket]) 

    useEffect(() => {

        const newSocket = io('http://localhost:3000');
        setSocket(newSocket);
        return () => {
            socket?.disconnect();
        }
    }, [])

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        if(context)
        {
            if(!initVarsStatus)
            {
                initVars(context);
                setInitVars(true);
            }
            const intervalId = setInterval(() => render(context, startGame, handelScore), 1000/ 60);
            return () => {
                clearInterval(intervalId);
            };
        }
    }, [startGame]);
    return (
        <div className=''>
            <div className='mb-[10px] grid grid-cols-3 justify-between place-content-center'>
                <div className='flex justify-start space-x-3 items-center'>
                    <div className="h-[60px] w-[60px] bg-[url('/Spectate.png')] bg-cover bg-center rounded-full border-[3px] border-[#6E4778]"/>
                    <span className='font-Bomb'>You</span>
                </div>
                <div className=' flex space-x-5 font-Bomb items-center text-5xl'>
                    <span className=' '>{p1Score}</span>
                    <p>-</p>
                    <span className=''>{p2Score}</span>
                </div>
                <div className=' flex justify-start items-center space-x-3'>
                    <span className=' font-Bomb'>HAMZA</span>
                    <div className="h-[60px] w-[60px] bg-[url('/Spectate.png')] bg-cover bg-center rounded-full mr-[10px] border-[3px] border-primary-pink-300">
                    </div>
                </div>
            </div>
            <div className='border-[2px] border-gray w-fit'>
                <canvas ref={canvasRef} width={1000} height={600} >

                </canvas>
            </div>
            <div className='mt-[20px] flex justify-center font-Heading tracking-wide '>
                <div>
                    <button className='bg-[#6E4778] hover:bg-[#6E4778]/[0.7] duration-300 rounded-[10px] px-3 py-2' onClick={handelStartGame}>Start Game</button>
                </div>
                <div className='ml-[20px]'>
                <button className='bg-primary-pink-300 hover:bg-primary-pink-300/[0.7] duration-300 rounded-[10px] px-[20px] py-[10px]'>Exit</button>
                </div>
            </div>
        </div>
    );
}

export default PingPong;