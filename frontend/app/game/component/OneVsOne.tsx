"use client"
import React, { useRef, useEffect, useState } from 'react'
import io, {Socket} from 'socket.io-client';
import { getCookie } from 'cookies-next';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Ball, Player, Net, User } from './gameInterfaces';
import { closeSync } from 'fs';

const OneVsOneSender = () => {

    const [startGame, setStartGame] = useState(false);
    const [p1Score, setP1Score] = useState<number>(0);
    const [p2Score, setP2Score] = useState<number>(0);
    const [socket, setSocket] = useState<Socket>();
    const [user, setUser] = useState<JwtPayload>();
    const [opponent, setOpponent] = useState<User>();
    const [userPostion, setUserPosition] = useState<number> ();
    const [opponentPosition, setOpponentPosition] = useState<number>();
    const [canvaWidth, setCanvaWidth] = useState<number>(0);
    const [canvaHeight, setCanvaHeight] = useState<number>(0);
    const [gameId, setGameId] = useState<string>();
    const [windowSize, setWindowSize] = useState({
        width: typeof window !== 'undefined' ? window.innerWidth : 0,
        height: typeof window !== 'undefined' ? window.innerHeight : 0,
    });
    
    const opponentPositionRef = useRef(opponentPosition);
    const canvasRef = useRef(null);

    let player1:  Player;
    let player2:  Player;
    let net:      Net;
    let ball:     Ball;
    let  context: CanvasRenderingContext2D;

    const token = getCookie("accessToken");

    const handelStartGame = () => {
        setStartGame(!startGame);
    }

    useEffect(() => {
        const handleResize = () => {
          setWindowSize({
            width: window.innerWidth,
            height: window.innerHeight,
          });
        };
        window.addEventListener('resize', handleResize);
        return () => {
          window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        if(windowSize.width > 1300)
        {
            setCanvaWidth(1200);
            setCanvaHeight(600);
        }
        else if(windowSize.width > 1024)
        {
            setCanvaWidth(950);
            setCanvaHeight(450);
        }
        else if(windowSize.width > 768)
        {
            setCanvaWidth(600);
            setCanvaHeight(350);
        }
    }, [windowSize]);

    useEffect(() => {
        const CANVA_WIDTH = 1200;
        const CANVA_HEIGHT = 650;
        const PLAYER_HEIGHT = CANVA_HEIGHT / 4;
        const PLAYER_WIDTH = CANVA_WIDTH / 64;
        player1 = {
            x: 10,
            y: CANVA_HEIGHT / 2 - PLAYER_HEIGHT / 2,
            width: PLAYER_WIDTH,
            height: PLAYER_HEIGHT,
            color: "#A0009D",
            score: 0,
        }
        
        player2 = {
            x: CANVA_WIDTH - PLAYER_WIDTH - 10,
            y: CANVA_HEIGHT / 2 - PLAYER_HEIGHT / 2,
            width: PLAYER_WIDTH,
            height: PLAYER_HEIGHT,
            color: "#FF1382",
            score: 0,
        }

        net = {
            x: CANVA_WIDTH / 2 - 1,
            y: 0, 
            width: 6,
            height: 50,
            color: "#FFFFFF",
        }

        ball = {
            x: 0,
            y: context.canvas.height / 2,
            radius: (CANVA_WIDTH * CANVA_HEIGHT) / 40000,
            speed: 0,
            vX: 5,
            vY: 5,
            color: "#FFF",
        }
    },[]);

    useEffect(() => {
        try {
          const user = jwt.decode(token as string) as JwtPayload
          if (user)
          setUser(user)
      } catch (error) {
        console.error('Error decoding token:');
      }
    }, [token])

    useEffect(() => {
        socket?.on('getOpponent', (op: User, id: string) => {
            setOpponent(op);
            setGameId(id);
        });
        socket?.on('getOpponentPostion', (pos: number) => {
            setOpponentPosition(pos);
        });
        if(opponent)
            socket?.emit("setPositon", {opponent: opponent, pos: userPostion});
    }, [socket, userPostion]);

    useEffect(() => { 
        const newSocket = io('http://localhost:3000');
        setSocket(newSocket);
        newSocket.emit('setSocket', {token: token});
        return () => {
            socket?.disconnect();
        }
    }, []);

    useEffect(() => {
        opponentPositionRef.current = opponentPosition;
      }, [opponentPosition]);


    useEffect(() => {
        const canvas = canvasRef.current;
        context = canvas.getContext('2d');
        const intervalId = setInterval(() => {
            render(opponentPositionRef.current!);
        }, 1000 / 60);
        return () => {
            clearInterval(intervalId);
        };
    }, [startGame]);

    /** ---------------------- Draw Game ------------------------- */

    const drawRectangle = (context: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, color: string) => {
        context.fillStyle = color;
        context.fillRect(x, y, w, h);
    }
    
    const drawCircle = (context: CanvasRenderingContext2D, x: number, y: number, r: number, color: string) => {
        context.fillStyle = color;
        context.beginPath();
        context.arc(x, y, r, 0, Math.PI * 2, false);
        context.closePath();
        context.fill();
    }
    
    const drawNet = (context: CanvasRenderingContext2D) =>
    {
        for(let i = 0; i < context.canvas.height; i += 80)
        {
            drawRectangle(context, net.x, net.y + i, net.width, net.height, net.color);
        }
    }

    const updatePlayres = (pos: number) => {
        if(pos !== undefined)
            player2.y = pos;
        context.canvas.addEventListener("mousemove", (e) => {
            let prev = player1.y;
            let rect = context.canvas.getBoundingClientRect();
            player1.y = e.clientY - rect.top - player1.height / 2;
            if(prev !== player1.y)
            {
                setUserPosition(player1.y);
            }
        });
    }

    const render = (pos: number) => {
        updatePlayres(pos);
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        drawRectangle(context, 0, 0, context.canvas.width, context.canvas.height, "#000000");
        drawNet(context);
        drawRectangle(context, player1.x, player1.y, player1.width, player1.height, player1.color);
        drawRectangle(context, player2.x, player2.y, player2.width, player2.height, player2.color);
        drawCircle(context, player1.x + player1.width / 2, player1.y, player1.width / 2, player1.color);
        drawCircle(context, player1.x + player1.width / 2, player1.y + player1.height, player1.width / 2, player1.color);
        drawCircle(context, player2.x + player2.width / 2, player2.y, player2.width / 2, player2.color);
        drawCircle(context, player2.x + player2.width / 2, player2.y + player2.height, player2.width / 2, player2.color);
    }

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
                <canvas ref={canvasRef} width={canvaWidth} height={canvaHeight} >

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

export default OneVsOneSender;