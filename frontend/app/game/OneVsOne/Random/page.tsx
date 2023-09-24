"use client"
import React, {useEffect, useState, MouseEvent } from 'react'
import { ReactP5Wrapper } from '@p5-wrapper/react'
import io, {Socket} from 'socket.io-client';
import { getCookie } from 'cookies-next';
import jwt, { JwtPayload } from 'jsonwebtoken';
import sketch from '../GameComponents/Game';
import { BallCoordinates, User } from "../GameComponents/gameInterfaces";
import { useRouter } from 'next/navigation';
import Losing from '../../component/losing';
import Winning from '../../component/winning';
import GameOponent from '../../component/choseGame';
const url = `http://${process.env.NEXT_PUBLIC_HOST}:${process.env.NEXT_PUBLIC_PORT}`;
const page = () => {
    const [user, setUser] = useState<JwtPayload>();
    const [socket, setSocket] = useState<Socket>();
    const [p1Score, setP1Score] = useState<number>(0);
    const [p2Score, setP2Score] = useState<number>(0);
    const [opponent, setOpponent] = useState<User>();
    const [gameId, setGameId] = useState<string>();
    const [opponentPos, setOpponentPos] = useState<number> ();
    const [ballCoordinates, setBallCoordinates] = useState<BallCoordinates> ();
    const [gameOver, setGameOver] = useState <boolean> (false);
    const [celebrate, setCelebrate] = useState <boolean> (false);

    const router = useRouter();

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
        socket?.on('getGameData', (op: User, gameId: string) => {
            setGameId(gameId);
            setOpponent(op);

        });
        socket?.on('getBallOpponentPostion', (pos: number, ball: BallCoordinates) => {
            setOpponentPos(pos);
            setBallCoordinates(ball)
        });
        socket?.on('updateScoore', (me: number, opp: number) => {
            setP1Score(me);
            setP2Score(opp);
        });
        socket?.on('gameOver', () => {
            setGameOver(true);
        });
        socket?.on('celebrate', () => {
            setCelebrate(true);
        });
        socket?.on('disconnect', () => {
        });
        return () => {
            socket?.emit("Disconnect");
        }
    }, [socket]);

    useEffect(() => { 
        const newsocket = io(url);
        setSocket(newsocket);
        newsocket.emit("setSocket", {token: token});
        return () => {
            // console.log("client id == ",socket?.id);
            socket?.disconnect();
        }
    }, []);

    return (
        gameOver ? celebrate ? <Winning user={{username: "YOU", avatar_url:user?.avatar_url}} bot={{username:opponent?.username!, avatar_url: opponent?.avatar_url!}} playerScore={p1Score} bootScore={p2Score}></Winning>
                 :             <Losing user={{username: "YOU", avatar_url:user?.avatar_url}} bot={{username:opponent?.username!, avatar_url:opponent?.avatar_url!}} playerScore={p1Score} bootScore={p2Score}></Losing>
        :<div className=' text-3xl text-white pt-[150px]  max-w-[1400px]  rounded-[20px]   w-full h-screen '>
            <div className=' glass mx-3 w-auto rounded-[20px] grid place-content-center border-[2px] border-[#FF1382] p-3 min-w-[350px]' >
                <div className='mb-[10px] grid grid-cols-3 justify-between place-content-center'>
                    <div className='flex justify-center items-center space-x-3'>
                        <div className={`h-[40px] sm:h-[60px] sx:h[40px] sx:w-[30] w-[40px] sm:w-[60px] bg-cover bg-center overflow-hidden rounded-full border-[3px] border-[#6E4778]`} >
                            <img src={user?.avatar_url} alt="" className=' w-full h-full ' />
                        </div>
                        <span className='font-Bomb text-xl sm:text-3xl text-xs'>You</span>
                    </div>
                    <div className=' flex justify-center space-x-2 sm:space-x-5 font-Bomb items-center text-2xl text-xs sm:text-5xl'>
                        <span>{p1Score}</span>
                        <p>-</p>
                        <span>{p2Score}</span>
                    </div>
                    <div className=' flex justify-center items-center space-x-3'>
                        <span className=' font-Bomb text-xl sm:text-3xl text-xs'>{opponent?.username}</span>
                        <div className="h-[40px] sm:h-[60px] w-[40px] sm:w-[60px] sx:h[40px] sx:w-[30] bg-cover bg-center overflow-hidden rounded-full mr-[10px] border-[3px] border-primary-pink-300">
                            <img src={opponent?.avatar_url} alt="" className=' w-full h-full ' />
                        </div>
                    </div>
                </div>
                <div className=' grid place-items-center items-center'>
                    <div className='border-[2px] border-gray w-fit'>
                            <ReactP5Wrapper sketch={sketch} 
                                            socket={socket} 
                                            gameId={gameId}
                                            user={user}
                                            opponentPos={opponentPos}
                                            ballCoordinates={ballCoordinates}
                                            />
                    </div>
                </div>
            </div>
        </div>
    );
}
export default page;