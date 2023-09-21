"use client"
import React, { use, useEffect, useState } from 'react'
import { useUserDataContext } from '../userDataProvider'
import jwt,{ JwtPayload } from 'jsonwebtoken'
import { getCookie } from 'cookies-next'
import { useSocketContext } from '../socket'
import { useRouter } from 'next/navigation'
import io, {Socket} from 'socket.io-client';
import { create } from 'zustand'

type Store = {
  gameSocket: any;
  setGamesocket: (gameSocket: any) => void;
};

export const useGameSocketStore = create<Store>((set) => ({
  gameSocket: undefined,
  setGamesocket: (gameSocket) => set({ gameSocket }),
}));

// export const gameSocket = () => {
  
//   const newSocket = io('http://10.14.3.9:3000');
//   // console.log("user = ", currentUser?.username, "socket = ", newSocket);
//  setGameSocket(newSocket);
// //   newSocket.emit('setSocket', {token: token});
// //   newSocket.emit("Ready", {token: token});
// }
const page = () => {
  const {gameSocket, setGamesocket} = useGameSocketStore()
  const [currentUser, setCurrentUser] = useState<any>({})
  const token = getCookie("accessToken");
  const {socket} = useSocketContext();
  const [currentUserId , setCurrentUserId] = useState(0)
  const [queue, setQueue] = useState<any>({})
  // const [gameSocket, setGameSocket] = useState<Socket>();
  
  // useEffect(() => {
  //   // Create a socket connection when the component mounts
  //   const newSocket = io("http://10.14.3.9:3000");

  //   // Emit an event to set any necessary data on the server, like a token
  //   newSocket.emit('setSocket', { token: token });

  //   // Set the socket in the component's state
  //   setGamesocket(newSocket);

  //   // Clean up the socket connection when the component unmounts
  //   return () => {
  //     newSocket.disconnect();
  //   };
  // }, []);

  useEffect(() => {
    try {
      const user = jwt.decode(token as string) as JwtPayload
      if (user) {
        setCurrentUser(user)
        setCurrentUserId(user.id)
      }
    } catch (error) {
      console.error('Error decoding token:');
    }
  }, [])


  console.log(currentUser)
  const router = useRouter()
  // useEffect(() => {
  //   // if (queue) {
  //     if (queue.receiver) {
  //       console.log("receiver = ", queue.receiver.username);
  //       console.log("sender = ", queue.sender.username);
  //       router.push('/game/OneVsOne/Random');
  //       socket.emit("connectPlayers", {p1: queue.sender.username, p2: queue.receiver.username });
  //     }
  //   // }
  // }, [queue, socket, currentUserId])
  useEffect(() => {
    if (socket) {
      console.log("hhhhhhhhhhhhhhhhhhhhh", currentUserId);
      socket.emit('AddtoQueue', {userid: currentUserId})
      socket.on('queue', (data: any) => {
        if (data.receiver) {
          console.log("receiver = ", data.receiver);
          console.log("sender = ", data.sender);
          // socket.emit("connectPlayers", {p1: data.sender.username, p2: data.receiver.username})
          router.push('/game/OneVsOne/Random');
        }
        setQueue(data)
      })
    }
  }, [socket, currentUserId])
  
  console.log("queue = ",  queue);
  return (
  <div className=" flex place-content-center items-center w-full pt-0 lg:pt-[200px] h-screen max-w-[1300px] min-w-[350px] ">
      <div className=" flex pb-10 items-center place-content-center w-full mx-1 h-[480px]  xl:h-[700px] glass rounded-xl ">
          <div className=' grid grid-cols-3 mx-10 items-center place-items-center gap-5'>
              <div>
                  <div className=' w-[100px] lg:w-[200px] h-[100px] lg:h-[200px] rounded-full'>
                      <img src={currentUser?.avatar_url} className='w-full h-full rounded-full' alt="" />
                      <p className=' text-white text-lg sm:text-2xl md:text-4xl text-center py-5 font-black'>{currentUser?.username}</p>
                  </div>
              </div>
              <h1 className=' font-Bomb text-lg sm:text-2xl md:text-4xl text-white text-center'>waiting for opponent...</h1>
              <div>
                  <div className='  w-[100px] lg:w-[200px] h-[100px] lg:h-[200px]  rounded-ful'>
                    <img src="Spectate.png" className=' w-full h-full rounded-full' alt="" />
                    <p className=' text-white text-lg sm:text-2xl md:text-4xl text-center py-5 font-black'>Kolibaly</p>
                  </div>
              </div>
          </div>

      </div>
    </div>
  )
}

export default page