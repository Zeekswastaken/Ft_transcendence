"use client"
import React, { useRef, useEffect, useState } from 'react'
import { ReactP5Wrapper } from '@p5-wrapper/react'
import io, {Socket} from 'socket.io-client';
import { getCookie } from 'cookies-next';
import jwt, { JwtPayload } from 'jsonwebtoken';
import sketch from './Game';
import { User } from './gameInterfaces';

const OneVsOne = () => {
    const [user, setUser] = useState<JwtPayload>();
    const [socket, setSocket] = useState<Socket>();
    const [p1Score, setP1Score] = useState<number>(0);
    const [p2Score, setP2Score] = useState<number>(0);
    const [opponent, setOpponent] = useState<User>();
    const [gameId, setGameId] = useState<string>();
    const [opponentPosition, setOpponentPosition] = useState<number>();




    const token = getCookie("accessToken");

    const sendPosition = (pos: number) =>
    {
        socket?.emit("setPositon", {id: gameId, user: user, pos: pos});
    }

    const getP2AndBallPositons = () => {
        socket?.emit("getBallAndP2Positions", {id: gameId, opponent: opponent});
        if(opponentPosition)
            return (opponentPosition);

    }

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
        socket?.on('getGameData', (op: User, gameId: string) => {
            setOpponent(op);
            setGameId(gameId);
        });
        socket?.on('getOpponentPostion', (pos: number) => {
            setOpponentPosition(pos);
        });
    }, [socket]);

    useEffect(() => { 
        const newSocket = io('http://10.14.2.9:3000');
        setSocket(newSocket);
        newSocket.emit('setSocket', {token: token});
        return () => {
            socket?.disconnect();
        }
    }, []);

    return (
        <div>
            <div className='mb-[10px] grid grid-cols-3 justify-between place-content-center'>
                <div className='flex justify-center space-x-3'>
                    <div className={`h-[60px] w-[60px] bg-cover bg-center overflow-hidden rounded-full border-[3px] border-[#6E4778]`} >
                        <img src={user?.avatar_url} alt="" className=' relative ' />
                    </div>
                    <span className='font-Bomb'>You</span>
                </div>
                <div className=' flex justify-center space-x-5 font-Bomb items-center text-5xl'>
                    <span className=' '>{p1Score}</span>
                    <p>-</p>
                    <span className=''>{p2Score}</span>
                </div>
                <div className=' flex justify-center items-center space-x-3'>
                    <span className=' font-Bomb'>{opponent?.username}</span>
                    <div className="h-[60px] w-[60px] bg-cover bg-center overflow-hidden rounded-full mr-[10px] border-[3px] border-primary-pink-300">
                    <img src={opponent?.avatar_url} alt="" className=' relative ' />
                    </div>
                </div>
            </div>
            <div className='border-[2px] border-gray w-fit'>
                <ReactP5Wrapper sketch={sketch} sendPosition={sendPosition} getBallAndP2={getP2AndBallPositons}/>
            </div>
            {/* <div className='mt-[20px] flex justify-center font-Heading tracking-wide '>
                <div>
                    trigger ? <button className='bg-[#6E4778] hover:bg-[#6E4778]/[0.7] duration-300 rounded-[10px] px-3 py-2' onClick={handeltrigger}>Pause</button>
                    : <button className='bg-[#6E4778] hover:bg-[#6E4778]/[0.7] duration-300 rounded-[10px] px-3 py-2' onClick={handeltrigger}>Start Game</button>
                </div>
                <div className='ml-[20px]'>
                <button className='bg-primary-pink-300 hover:bg-primary-pink-300/[0.7] duration-300 rounded-[10px] px-[20px] py-[10px]'>Exit</button>
                </div>
            </div> */}
        </div>
    );
}

export default OneVsOne