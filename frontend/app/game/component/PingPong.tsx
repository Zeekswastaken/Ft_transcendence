"use client"
import React, { useRef, useEffect, useState } from 'react'
import { render, initVars } from './render';
import io, {Socket} from 'socket.io-client';
import { getCookie } from 'cookies-next';
import jwt, { JwtPayload } from 'jsonwebtoken';


const PingPong = () => {

    const canvasRef = useRef(null);
    const [startGame, setStartGame] = useState(false);
    const [initVarsStatus, setInitVars] = useState(false);
    const [p1Score, setP1Score] = useState<number>(0);
    const [p2Score, setP2Score] = useState<number>(0);
    const [socket, setSocket] = useState<Socket>();
    const [user, setUser] = useState<JwtPayload>();
    const [opponent, setOpponent] = useState();
    const [userPosition, setUserPosition] = useState<number>();
    const [opponentPosition, setOpponentPosition] = useState<number>();

    //get cookies token
    const token = getCookie("accessToken");
    
    const handelScore = (p: number) => {
        p === 1 ? setP1Score((p1Score) => p1Score + 1) : setP2Score(p2Score => p2Score + 1);
    }

    const handelStartGame = () => {
        setStartGame(!startGame);
    }

    const changeUserPostion = (position: number) => {
        setUserPosition((position) => position);
        socket?.emit("setPositon", {opponent: opponent, pos: position})
    }

    //get User Information by token
    useEffect(() => {
        try {
          const user = jwt.decode(token as string) as JwtPayload
          if (user)
          setUser(user)
          
        // setCurrentUsername(jwt.decode(token).username);
      } catch (error) {
        console.error('Error decoding token:');
      }
    }, [token])

    useEffect(() => {
        socket?.on('getOpponent', (opponent) => {
            setOpponent(opponent);
        });
        socket?.on('getOpponentPostion', (pos: number) => {
            setOpponentPosition(pos);
        })
    }, [socket]) 

    useEffect(() => {
        const newSocket = io('http://localhost:3000');
        setSocket(newSocket);
        if(user?.username === "Hamza")
        {
            newSocket.emit('getSocketPlayer', {token: token, username: "Oussama"});
        }
        else if(user?.username === "Oussama")
        {
            newSocket.emit('getSocketPlayer', {token: token, username: "Hamza"});
        }
        return () => {
            socket?.disconnect();
        }
    }, [user]);

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
            const intervalId = setInterval(() => render(context, startGame, handelScore, opponentPosition, changeUserPostion), 1000/ 60);
            return () => {
                clearInterval(intervalId);
            };
        }
    }, [startGame, opponentPosition]);
    return (
        <div>
            <div className='mb-[10px] grid grid-cols-3 justify-between place-content-center'>
                <div className='flex justify-start space-x-3 items-center'>
                    <div className={`h-[60px] w-[60px] bg-cover bg-center overflow-hidden rounded-full border-[3px] border-[#6E4778]`} >
                        <img src={user?.avatar_url} alt="" className=' relative ' />
                    </div>
                    <span className='font-Bomb'>You</span>
                </div>
                <div className=' flex space-x-5 font-Bomb items-center text-5xl'>
                    <span className=' '>{p1Score}</span>
                    <p>-</p>
                    <span className=''>{p2Score}</span>
                </div>
                <div className=' flex justify-start items-center space-x-3'>
                    <span className=' font-Bomb'>{opponent?.username}</span>
                    <div className="h-[60px] w-[60px] bg-cover bg-center overflow-hidden rounded-full mr-[10px] border-[3px] border-primary-pink-300">
                    <img src={opponent?.avatar_url} alt="" className=' relative ' />
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