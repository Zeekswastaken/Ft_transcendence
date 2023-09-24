"use client"
import React, { use, useEffect, useState } from 'react'
import { useUserDataContext } from '../userDataProvider'
import jwt,{ JwtPayload } from 'jsonwebtoken'
import { getCookie } from 'cookies-next'
import { useSocketContext } from '../socket'
import { useRouter } from 'next/navigation'
import io, {Socket} from 'socket.io-client';
import { create } from 'zustand'
import { useInviteFriendData } from '@/components/tools/Modal'

type Store = {
  gameSocket: any;
  setGamesocket: (gameSocket: any) => void;
};

export const useGameSocketStore = create<Store>((set) => ({
  gameSocket: undefined,
  setGamesocket: (gameSocket) => set({ gameSocket }),
}));

// const RandomQueue = () => {

//   const [currentUser, setCurrentUser] = useState<any>({})
//   const token = getCookie("accessToken");
//   const {socket} = useSocketContext();
//   const [currentUserId , setCurrentUserId] = useState(0)
//   const [queue, setQueue] = useState<any>({})

//   useEffect(() => {
//     try {
//       const user = jwt.decode(token as string) as JwtPayload
//       if (user) {
//         setCurrentUser(user)
//         setCurrentUserId(user.id)
//       }
//     } catch (error) {
//       console.error('Error decoding token:');
//     }
//   }, [])

//   const router = useRouter()
//   useEffect(() => {
//     console.log("===============>>>>>>><<<<<<<++++++++++++++++")
//     if (socket) {
//       socket.emit('AddtoQueue', {userid: currentUserId})
//       socket.on('queue', (data: any) => {
//         if (data.receiver) {
//           router.push('/game/OneVsOne/Random');
//         }
//         setQueue(data)
//       });
//     }
//     return () => {
//       console.log("Hello ====================> ");
//       socket.emit("RemoveQueue", {userid: currentUserId})
//     }
//   }, [socket, currentUserId])
//   return (
//     <div className=" flex place-content-center items-center w-full pt-0 lg:pt-[200px] h-screen max-w-[1300px] min-w-[350px] ">
//     <div className=" flex pb-10 items-center place-content-center w-full mx-1 h-[480px]  xl:h-[700px] glass rounded-xl ">
//         <div className=' grid grid-cols-3 mx-10 items-center place-items-center gap-5'>
//             <div>
//                 <div className=' w-[100px] lg:w-[200px] h-[100px] lg:h-[200px] rounded-full'>
//                     <img src={currentUser?.avatar_url} className='w-full h-full rounded-full' alt="" />
//                     <p className=' text-white text-lg sm:text-2xl md:text-4xl text-center py-5 font-black'>{currentUser?.username}</p>
//                 </div>
//             </div>
//             <h1 className=' font-Bomb text-lg sm:text-2xl md:text-4xl text-white text-center'>waiting for opponent...</h1>
//             <div>
//                 <div className='  w-[100px] lg:w-[200px] h-[100px] lg:h-[200px]  rounded-ful'>
//                   <img src="Spectate.png" className=' w-full h-full rounded-full' alt="" />
//                   <p className=' text-white text-lg sm:text-2xl md:text-4xl text-center py-5 font-black'>opponent</p>
//                 </div>
//             </div>
//         </div>

//     </div>
//   </div>
//   )
// }

// const FriendQueue = () => {

//   const [currentUser, setCurrentUser] = useState<any>({})
//   const token = getCookie("accessToken");
//   const {socket} = useSocketContext();
//   const [currentUserId , setCurrentUserId] = useState(0)
//   const [queue, setQueue] = useState<any>({})
//   const {inviteFriendData} = useInviteFriendData()

//   console.log("vvvvv= ", inviteFriendData)
//   const router = useRouter()

//   useEffect(() => {
//     try {
//       const user = jwt.decode(token as string) as JwtPayload
//       if (user) {
//         setCurrentUser(user)
//         setCurrentUserId(user.id)
//       }
//     } catch (error) {
//       console.error('Error decoding token:');
//     }
//   }, [])
//   useEffect(() => {
//     socket?.on("acceptedqueue", (data:any) => {
//       if (data.status === "accepted")
//         router.push("/game/OneVsOne/Random")
//     })
//   }, [socket])


//   return (
//     <div className=" flex place-content-center items-center w-full pt-0 lg:pt-[200px] h-screen max-w-[1300px] min-w-[350px] ">
//     <div className=" flex pb-10 items-center place-content-center w-full mx-1 h-[480px]  xl:h-[700px] glass rounded-xl ">
//         <div className=' grid grid-cols-3 mx-10 items-center place-items-center gap-5'>
//             <div>
//                 <div className=' w-[100px] lg:w-[200px] h-[100px] lg:h-[200px] rounded-full'>
//                     <img src={currentUser?.avatar_url} className='w-full h-full rounded-full' alt="" />
//                     <p className=' text-white text-lg sm:text-2xl md:text-4xl text-center py-5 font-black'>{currentUser?.username}</p>
//                 </div>
//             </div>
//             <h1 className=' font-Bomb text-lg sm:text-2xl md:text-4xl text-white text-center'>waiting for opponent...</h1>
//             <div>
//                 <div className='  w-[100px] lg:w-[200px] h-[100px] lg:h-[200px]  rounded-ful'>
//                   <img src={inviteFriendData?.receiver.avatar_url} className=' w-full h-full rounded-full' alt="" />
//                   <p className=' text-white text-lg sm:text-2xl md:text-4xl text-center py-5 font-black'>{inviteFriendData?.receiver.username}</p>
//                 </div>
//             </div>
//         </div>

//     </div>
//   </div>
//   )
// }

const page = () => {
  const {buttonType} = useInviteFriendData()
  return (
    <>
      {/* { buttonType === "friend" ? (<FriendQueue/>) : (<RandomQueue/>)} */}
    </>
  )
}

export default page