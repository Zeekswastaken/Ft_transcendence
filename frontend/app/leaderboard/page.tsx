"use client"

import { getCookie } from "cookies-next"
import jwt,{ JwtPayload } from "jsonwebtoken"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useSocketContext } from "../socket"

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
      </div>
      <p className=" text-white text-center font-Heading tracking-wider text-2xl py-2">{name}</p>
      <div className=" bg-[#501D4E] drop-shadow-[6px_5px_0_rgba(0,0,00.15)] rounded-2xl bg-cover bg-center ">
        <p className=" font-Bomb text-2xl text-white text-center pt-3 ">level <span className=" text-[#CA96E5]">{level}</span></p>
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
  const [currentUserid, setCurrentUserid] = useState("");
  const [currentUserPos, setCurrentUserPos] = useState();
  const [topThree, setTopThree] = useState<Array<any>>([]);
  const [rest, setRest] = useState<Array<any>>([]);
  const {socket} = useSocketContext();
  useEffect(() => {
    try {
      const user = jwt.decode(token as string) as JwtPayload
      if (user) {
        setCurrentUsername(user.username)
        setCurrentUserid(user.id)
      }
    } catch (error) {
      console.error('Error decoding token:');
    }
  }, [])
  useEffect(() => {
    if (currentUserid !== undefined) {
      socket?.emit("getLeaderboard", {userID: currentUserid})
      socket?.on("leaderboard", (data:any) => {
        if (data)
          setTopThree(data.Topthree);
          setRest(data?.Rest);
          setCurrentUserPos(data?.Pos)
      })
    }
  },[currentUserid])
  return (
    <div className=" flex place-content-center items-center w-full h-screen max-w-[1300px] min-w-[350px] ">
        <div className=" pt-[150px] pb-10 place-content-center w-full mx-1 h-full  ">
          <div className=" glass h-full mb-5 grid gap-y-14 overflow-y-auto no-scrollbar">
            
            
            <div className=" grid grid-cols-1 lg:grid-cols-3 gap-y-10 lg:space-y-0 lg:mx-0 sm:mx-36 mx-5 space-y-4 lg:gap-8 items-center place-content-center p-2 sm:p-5 lg:p-10 ">
              <LeadersCard tagStyle="bg-[#C0C0C0]" name={topThree[1]?.username} level={Math.floor(topThree[1]?.stats?.level)+""} matches={topThree[1]?.stats?.matches_played} score={topThree[1]?.stats?.score} image={topThree[1]?.avatar_url} styles="lg:pt-20 pt-0 lg:order-1 order-2" />
              <LeadersCard tagStyle="bg-[#FFD700]" name={topThree[0]?.username} level={Math.floor(topThree[0]?.stats?.level)+""} matches={topThree[0]?.stats?.matches_played} score={topThree[0]?.stats?.score} image={topThree[0]?.avatar_url} styles="lg:order-2 order-1" />
              <LeadersCard tagStyle="bg-[#B08D57]" name={topThree[2]?.username} level={Math.floor(topThree[2]?.stats?.level)+""} matches={topThree[2]?.stats?.matches_played} score={topThree[2]?.stats?.score} image={topThree[2]?.avatar_url} styles="lg:pt-32 pt-0 lg:order-3 order-3" />
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
                  {rest?.map((player:any, id) => {
                    let style = ""
                    if (currentUsername === player.username && (id + 4) === currentUserPos) {
                      style = "bg-primary-pink-300/[0.6]"
                    }
                    return <LeadersTable key={id} styles={style} place={"" + (id + 4)} username={player.username} matches={player?.stats?.matches_played} level={Math.floor(player?.stats.level) + ""} score={player.stats.score}/>
                  })

                  }
                  {/* <LeadersTable styles="" place="4" username="soham" matches="311" level="14" score="3934" />
                  <LeadersTable styles="" place="5" username="Hawkins" matches="286" level="13" score="3934" />
                  <LeadersTable styles="" place="6" username="lane" matches="225" level="12" score="3934" />
                  <LeadersTable styles="" place="7" username="Priscilla" matches="201" level="12" score="3934" />
                  <LeadersTable styles="" place="8" username="Esther" matches="185" level="12" score="3934" />
                  <LeadersTable styles="" place="9" username="Aubrey" matches="179" level="11" score="3934" />
                  <LeadersTable styles="bg-primary-pink-300/[0.6]" place="10" username={currentUsername} matches="245" level="13" score="3934" /> */}
                </div>
            </div>
          </div>
        </div>
    </div>
  );
};

export default page;
