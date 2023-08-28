"use client"
import React, { useRef, useEffect, useState } from 'react'
import { render, initVars } from './render';


const PingPong = () => {
    const canvasRef = useRef(null);
    const [startGame, setStartGame] = useState(false);
    const [initVarsStatus, setInitVars] = useState(false);
    const [p1Score, setP1Score] = useState(0);
    const [p2Score, setP2Score] = useState(0);

    const handelScore = (p: number) => {
        console.log("Player " + p);
        if(p === 1)
            setP1Score(p1Score + 1);
        else
            setP2Score(p2Score + 1);
    }

    const handelStartGame = () => {
        setStartGame(!startGame);
    }

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        if(context)
        {
            if(!initVarsStatus)
            {
                setP1Score(0);
                setP2Score(0);
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
            <div className='mb-[10px] flex justify-between'>
                <div>
                    Player 1
                </div>
                <div>
                    <span className='bg-[#F00]'>{p1Score}</span>
                    <span className='bg-[#00F]'>{p2Score}</span>
                </div>
                <div>
                    player2
                </div>
            </div>
            <div className='border-[2px] border-gray w-fit'>
                <canvas ref={canvasRef} width={1200} height={600} >

                </canvas>
            </div>
            <div className='mt-[20px] flex justify-center'>
                <div>
                    <button className='bg-[#670647] rounded-[10px] border-[2px] border-[#FFF] px-[20px] py-[10px]' onClick={handelStartGame}>Start Game</button>
                </div>
                <div className='ml-[20px]'>
                <button className='bg-[#F00] rounded-[10px] border-[2px] border-[#FFF] px-[20px] py-[10px]'>Exit</button>
                </div>
            </div>
        </div>
    );
}

export default PingPong;