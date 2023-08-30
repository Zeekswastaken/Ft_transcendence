"use client"

import { getCookie } from "cookies-next"
import jwt,{ JwtPayload } from "jsonwebtoken"
import Link from "next/link"
import { useEffect, useState } from "react"

type Props = {
  name:string,
  level:string,
  matches:string,
  score:string
  image:string
  styles:string
  tagStyle:string
}

const LeadersCard = ( {name, level, matches, score, image, styles, tagStyle}:Props ) => {
  return (
    <div className={` place-content-center content-start h-[300px]  ${styles} `}>
      <div className=" flex place-content-center">
        <div className=" absolute h-[95px] w-[120px] pb-10 rounded-full bg-white blur-[20px]   "/>
        <div className="z-50">
          <img className={` ${tagStyle} rounded-md p-1 absolute z-50 `} src="/lbtrophy.png" alt="" />
          <img className=" rounded-xl  w-[80px] h-[80px]" src={image} width={80} height={80} alt="" />
        </div>
        {/* <div className={` rounded-xl z-50 w-[80px] h-[80px] ${avatar} bg-cover bg-center`}/> */}
      </div>
      <p className=" text-white text-center font-Heading tracking-wider text-2xl py-2">{name}</p>
      <div className=" bg-[url('/leaderboardCard.png')] bg-cover bg-center ">
        <p className=" font-Bomb text-2xl text-white text-center pt-3 ">level <span className=" text-[#CA96E5]">{level}</span></p>
        {/* <div className=" divider flex content-center"/> */}
        <p className=" font-Bomb text-3xl text-white text-center pt-3 ">{matches} match</p>
        <div className=" grid place-content-center  pt-2">
          <div className=" flex space-x-1 place-content-center">
            <img src="/k.png" alt="" />
            <p className=" font-Bomb text-2xl text-white">{score}</p>
          </div>
          <Link href={`/users/${name}`} className=" my-3 pb-1 pt-2 px-2 rounded-2xl bg-primary-pink-300 hover:bg-primary-pink-300/[0.7] duration-300">
            <p className=" font-Bomb text-white text-xl">view profile</p>
          </Link>
        </div>
      </div>
  </div>
  )
}

type tableProps = {
  place:string,
  username:string,
  matches: string,
  level:string,
  score:string
  styles:string
}

const LeadersTable = ( {place, username, matches, level, score, styles}:tableProps ) => {
  let bgColor = "bg-[#501D4E]/[0.9]"
  let hoverColor = "hover:text-primary-pink-300/[0.8]"
  if (styles) {
    bgColor = styles
    hoverColor = ""
  }
  return (
    <div className={` ${bgColor} rounded-lg gap-x-2 sm:text-xl text-sm lg:text-2xl font-Bomb text-white text-center place-content-center grid grid-cols-5 space-y-3 px-2 py-1 `}>
      <div className=" flex space-x-1 place-content-center items-center p-2">
        <img className=" lg:h-[25px] h-[20] lg:w-[30px] w-[25px] " src="/whiteTrophy.png" alt="" />
        <p className=" lg:text-3xl text-lg">{place}</p>
      </div>
      <Link href={`/users/${username}`} className={` p-2 ${hoverColor} duration-300`}>{username}</Link>
      <p className=" p-2">{matches}</p>
      <p className=" p-2">{level}</p>
      <p className=" p-2">{score}</p>
    </div>
  )
}

const page = () => {

  const token = getCookie("accessToken");
  const [currentUsername ,setCurrentUsername] = useState("");
  useEffect(() => {
    try {
      const user = jwt.decode(token as string) as JwtPayload
      if (user) {
        setCurrentUsername(user.username)
      }
    } catch (error) {
      console.error('Error decoding token:');
    }
  }, [])

  return (
    <div className=" flex place-content-center items-center w-full h-screen max-w-[1300px] min-w-[350px] ">
        <div className=" pt-[150px] pb-10 place-content-center w-full mx-1 h-full  ">
          <div className=" glass h-full mb-5 grid gap-y-14 overflow-y-auto no-scrollbar">
            
            
            <div className=" grid grid-cols-1 lg:grid-cols-3 gap-y-10 lg:gap-2 items-center place-content-center p-2 sm:p-5 lg:p-10 ">
              <LeadersCard tagStyle="bg-[#C0C0C0]" name="Francisco" level="15" matches="401" score="7 000" image="/Spectate.png" styles="lg:pt-20 pt-0 lg:order-1 order-2" />
              <LeadersCard tagStyle="bg-[#FFD700]" name="Theresa" level="15" matches="435" score="10 000" image="/theresa.jpeg" styles="lg:order-2 order-1" />
              <LeadersCard tagStyle="bg-[#B08D57]" name="Bernard" level="14" matches="365" score="4 300" image="/robot.jpg" styles="lg:pt-32 pt-0 lg:order-3 order-3" />
            </div>
              
            <div className="mt-16 lg:mx-20 mx-5">
                <div className=" grid grid-cols-5 place-content-center text-center  lg:text-3xl text-[15px] sm:text-2xl font-Bomb text-primary-pink-300 drop-shadow-[6px_5px_0_rgba(0,0,00.15)] p-2">
                  <p className=" mx-1">place</p>
                  <p className=" mx-1">name</p>
                  <p className=" mx-1">matches</p>
                  <p className=" mx-1">level</p>
                  <p className=" mx-1">score</p>
                </div>
                <div className=" space-y-[2px]">
                  <LeadersTable styles="" place="4" username="soham" matches="311" level="14" score="3934" />
                  <LeadersTable styles="" place="5" username="Hawkins" matches="286" level="13" score="3934" />
                  <LeadersTable styles="" place="6" username="lane" matches="225" level="12" score="3934" />
                  <LeadersTable styles="" place="7" username="Priscilla" matches="201" level="12" score="3934" />
                  <LeadersTable styles="" place="8" username="Esther" matches="185" level="12" score="3934" />
                  <LeadersTable styles="" place="9" username="Aubrey" matches="179" level="11" score="3934" />
                  <LeadersTable styles="bg-primary-pink-300/[0.6]" place="10" username={currentUsername} matches="245" level="13" score="3934" />
                </div>
            </div>
          </div>
        </div>
    </div>
  );
};

export default page;
