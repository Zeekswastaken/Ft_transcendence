import React, { Children, useEffect, useState } from 'react'
import SelectFriend, { useSelectFriendStore } from './SelectFriend'
import { useAppSelector } from "@/redux/hooks";
import { useRouter } from 'next/navigation';
// import ionicon from 'ionicons';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';
import 'swiper/css/effect-cards';

import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import jwt,{ JwtPayload } from 'jsonwebtoken';
import { getCookie } from 'cookies-next';
import { useSocketContext } from '@/app/socket';
import { create } from 'zustand';
// import { Navigation, Pagination, EffectCoverflow } from 'swiper';

interface Props {
  title: string

}

type Store = {
  inviteFriendData: any;
  buttonType: string
  setButtonType: (buttonType:string) => void;
  setInviteFriendData: (inviteFriendData: any) => void;
};

export const useInviteFriendData = create<Store>((set) => ({
  inviteFriendData: undefined,
  buttonType: "",
  setButtonType: (buttonType) => set({ buttonType }),
  setInviteFriendData: (inviteFriendData) => set({ inviteFriendData }),
}));

const OneVsOne:React.FC<Props> = ({ title }) => {
  const router = useRouter();
  const {socket} = useSocketContext();
  const [clicked, setClicked] = useState(false);
  const token = getCookie("accessToken");
  const {inviteFriendData, setInviteFriendData, buttonType, setButtonType} = useInviteFriendData();
  const [currentUserAvatar, setCurrentUserAvatar] = useState("");
  const [currentUserID, setCurrentUserID] = useState<Number>();
  const avatar = useAppSelector((state) => state.avatarReducer.value);
  const {username} = useSelectFriendStore()
  
// const token = getCookie("accessToken");
  useEffect(() => {
    try {
      const user = jwt.decode(token as string) as JwtPayload
      if (user) {
        setCurrentUserID(user.id)
        setCurrentUserAvatar(user.avatar_url)
      }
    } catch (error) {
      console.error('Error decoding token:');
    }
  }, [])
    
  const handleRandomlyOpponent= (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    // setButtonType("random");
    router.push("/queue/randomqueue");
  }
  const handleFriendOpponent = (e: React.MouseEvent<HTMLElement>) => {
    setButtonType("friend");
    setClicked(true);
  }
  const changeState = (state:boolean) => {
    setClicked(state);
  }

  const handleFriendInvite = (e : React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    socket.emit("AddtoInviteQueue", {userid: currentUserID, receiver: username});
    socket.on("pendingqueue", (data:any) => {
      setInviteFriendData(data);
      router.push("/queue/friendqueue")
    })
  }
  return (
    <div className=" w-o place-content-center backdrop-blur-sm">
      {clicked && (
        <svg onClick={e => changeState(false)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="white" className=" cursor-pointer absolute sm:right-[350px] right-[290px] w-8 h-8 ">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
        </svg>
      )}
      <h3 className="text-[40px] mt-2 font-Bomb leading-6 text-white tracking-wide"> {title} </h3>
      {clicked ? (
        <div className="">
            <div className=' flex items-center justify-between my-10 space-x-6'>
              <div className=' w-[120px] h-[120px] rounded-xl'>
                <img className=' rounded-xl w-full h-full' src={currentUserAvatar}alt="" />
              </div>
              <p className=' text-white text-[50px] font-Bomb'>VS</p>
              <div className=' w-[120px] h-[120px] rounded-xl'>
                <img className=' rounded-xl w-full h-full' src={avatar} alt="avatar" />
              </div>
            </div>
            <SelectFriend />
          <div className="mt-4 space-x-4">
            <button
              type="button"
              className="inline-flex text-white rounded-lg tracking-wide font-Bomb justify-center text-2xl p-2 bg-primary-pink-300 capitalize shadow duration-300 hover:shadow-black/60"
              onClick={handleFriendInvite}
            >
              Invite Friend!
            </button>
          </div>
        </div>
        ) : (
          <div className=" flex justify-between items-center space-x-[25px] sm:space-x-[50px] my-10 ">

            <button onClick={handleFriendOpponent} className=" animate-fade-right animate-delay-100 duration-300 hover:drop-shadow-[6px_5px_0_rgba(0,0,00.15)] hover:brightness-100 brightness-90 w-[120px] h-[120px] sm:w-[200px] sm:h-[200px] bg-[url('/playWithFriend.jpg')]  bg-cover bg-center rounded-2xl">
              <p className=' text-white text-xl sm:text-3xl font-Bomb'> Choose Friend </p>
            </button>
            <p className=" font-Bomb text-[25px] sm:text-[50px] text-primary-pink-400 ">OR</p>
            <button onClick={handleRandomlyOpponent} className=" animate-fade-right animate-delay-1000 duration-300 hover:drop-shadow-[6px_5px_0_rgba(0,0,00.15)] hover:brightness-100 brightness-90 w-[120px] h-[120px] sm:w-[200px] sm:h-[200px] hover:from-50% bg-[url('/playwithRandom.jpg')] bg-cover bg-center rounded-2xl  ">
              <p className=' text-white text-xl sm:text-3xl font-Bomb'> Choose Randomly </p>
            </button>
          </div>
        )}
    </div>
  )
};

const OneVsBot:React.FC<Props> = ({ title }) => {

  const router = useRouter();
  const handelEasyBot = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    router.push("/game/OneVsBot/Easy");
  }
  const handelMediumBot = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    router.push("/game/OneVsBot/Medium");
  }
  const handelHardBot = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    router.push("/game/OneVsBot/Hard");
  }


  return (
    <div className=" w-auto place-content-center backdrop-blur-sm">
      <h3 className="text-[40px] mt-2 font-Bomb leading-6 text-gray-100 tracking-wide"> {title} </h3>
      <div className='font-Bomb text-3xl tracking-wide text-white  my-10 flex space-x-6 '>
            <button onClick={handelEasyBot} className=" animate-fade-up animate-delay-100 shadow-xl hover:shadow-green-300 hover:text-green-100 duration-300 brightness-100 bg-[url('/easy.jpeg')]  bg-cover bg-center  h-[180px] w-[100px] md:h-[250px] sm:w-[180px] rounded-3xl">
              <p className=" mt-[200px]">EASY</p>
            </button>
            <button onClick={handelMediumBot} className=" animate-fade-up animate-delay-500 shadow-xl hover:shadow-yellow-300 hover:text-yellow-100 duration-300 brightness-100 bg-[url('/meduim.jpeg')] bg-cover bg-center h-[180px] w-[100px] md:h-[250px] sm:w-[180px] rounded-3xl ">
              <p className="mt-[200px]" >Medium</p>
            </button>
            <button onClick={handelHardBot} className=" animate-fade-up animate-delay-[900ms] shadow-xl hover:shadow-red-400 hover:text-red-100 duration-300 brightness-100 bg-[url('/hard.jpeg')] bg-cover bg-center h-[180px] w-[100px] md:h-[250px] sm:w-[180px] rounded-3xl">
              <p className="mt-[200px]">Hard</p>
            </button>
          <div className="slider-container">
          </div>
      </div>
    </div>
    )
}

const game1 = {
  player1:"mp1", player2:"mp2", p1Avatar:"/30.png", p2Avatar:"/artwork.jpeg"
}

const game2 = {
  player1:"mpdd1", player2:"mp2", p1Avatar:"/artwork.jpeg", p2Avatar:"/30.png"
}

const slides:any = [
  game1,
  game2
]


const Spectate:React.FC<Props> = ( {title} ) => {
  const [curr, setCurr] = useState(0)
  let player1Avatar = "bg-[url('" + slides[curr].p1Avatar + "')]";
  let player2Avatar = "bg-[url('" + slides[curr].p2Avatar + "')]";
  const prev = () =>
    setCurr((curr) => (curr === 0 ? slides.length - 1 : curr - 1))
  const next = () =>
    setCurr((curr) => (curr === slides.length - 1 ? 0 : curr + 1))
  return (
    <div className='  place-content-center'>
      <h3 className="text-[40px] mt-2 font-Bomb leading-6 text-gray-200 tracking-wide"> {title} </h3>
      <div  className=' space-x-2 my-5 px-10 flex justify-between items-center'>
          <div onClick={prev} className="text-white text-4xl font-Bomb">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-[50px] h-[50px]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </div>
        <div className={` flex justify-between w-full px-16 py-5 rounded-2xl items-center text-4xl `}>
          {/* <div className=' flex items-center text-gray-200 justify-between my-10 space-x-6'>
            <div>
              <p className=' font-Bomb  text-2xl'>{slides[curr].player1}</p>
              <Link href={`/users/${slides[curr].player1}`}>
                <button className={` rounded-[30px] ${player1Avatar} bg-cover bg-center min-w-[120px] h-[120px] hover:shadow hover:shadow-green-400 duration-300`} />
              </Link>
            </div>  
            <p className='  text-[50px] font-Bomb text-primary-pink-300 shadow-xl '>VS</p>
            <div>
             <p className=' font-Bomb  text-2xl'>{slides[curr].player2}</p>
             <Link href={`/users/${slides[curr].player2}`}>
              <button className={` rounded-xl ${player2Avatar} bg-cover bg-center min-w-[120px] h-[120px] hover:shadow hover:shadow-green-400 duration-300`} />
             </Link>
            </div>
          </div> */}
        </div>
          <div onClick={next} className=' text-white text-4xl font-Bomb'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-[50px] h-[50px]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </div>
      </div>
      <Link href="https://www.youtube.com/watch?v=Kw1DLZsNMzo&ab_channel=ttrio2016" className=" bg-primary-pink-300/[0.7] hover:bg-primary-pink-300 p-2 rounded-xl text-3xl text-white font-Bomb">
        Watch Now
      </Link>
    </div>
  )
}

const ModalContent:React.FC<Props> = ({title}) => {
    let content: React.ReactNode ;
    switch (title) {
        case "One Vs One" :
          content = <OneVsOne title={title}/>
          break;
        case "One Vs Bot":
          content = <OneVsBot title={title}/>
          break;
        case "Spectate" :
          content = <Spectate title={title} />
      }
  return (
    <>
        {content}
    </>
  )
}

export default ModalContent
