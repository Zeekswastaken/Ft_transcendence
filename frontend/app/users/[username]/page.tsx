"use client"

import ProfileSvgs from "@/components/tools/ProfileSvgs";
import React from "react";
import CSS from "csstype";
import Row from "@/components/tools/Row";
import { useUserDataContext } from "@/app/userDataProvider";


interface Props {
  styles: string;
  title: string; 
  number?: string | number;
}

const LevelReached: React.FC<Props> = ({ styles, title }) => {
  
  const userData = useUserDataContext()?.user;
  let LevelReached;
  let percentage
  if (userData && userData.stats && userData.stats.level !== undefined) {
    LevelReached = Math.floor(userData.stats.level)
    let check = userData.stats.level - Math.floor(userData.stats.level);
    percentage = check * 100 + "%";
  }
  const level:string = "5";
  
  const progress: CSS.Properties = {
    width: '180px',
    height: '180px',
    borderRadius: '50%',
    // background: `conic-gradient(#FF1382 ${percentage}, #91145D 0)`,
    background: `radial-gradient(closest-side, #474572 79%, transparent 80% 100%), conic-gradient(#FF1382 ${percentage}, #91145D 0)`,
  }
  return (
    <div
      className={` animate-fade-right  glass overflow-auto no-scrollbar h-[350px] ${styles}`}
    >
        <p className=" p-6 font-Bomb text-3xl text-white">{title}</p>
        <div className=" flex place-content-center items-end">
          <div className=" order-2 text-white font-Bomb text-3xl tracking-wider">
            <p>level {(LevelReached)}</p>
          </div>
          <div style={progress} className=" flex place-content-center items-center">
            <p className=" font-Bomb text-4xl text-white ">{percentage}</p>
          </div>
        </div>
    </div>
  );
}

const CardStats:React.FC<Props> = ( {styles, title, number} ) => {
  return (
    <div className="  bg-[#471D49] flex items-center place-content-center drop-shadow-[6px_5px_0_rgba(0,0,00.15)] hover:bg-[#5b315d] hover:opacity-90 duration-300  rounded-3xl">
    <div className=" ">
      <p className=" break-all text-center font-Bomb text-[34px] mt-5 text-white">{title}</p>
      <p className={` break-all text-center font-Bomb mb-2 text-4xl  ${styles} `}>{number}</p>
    </div>  
  </div>
  )
}

const WinRate: React.FC<Props> = ({ styles, title }) => {
  const userData = useUserDataContext()?.user;
  let winrate;
  if (userData && userData.stats && userData.stats.level !== undefined) {
    winrate = Math.floor(userData?.stats?.winrate)
  }
  return (
    <div
      className={` glass animate-fade-right animate-delay-150 ${styles}`}
    >
      <p className="  p-6 font-Bomb text-3xl text-white">{title}</p>
        <div className="  grid auto-cols-min my-10 grid-cols-1 2xl:grid-cols-4 gap-5 2xl:w-full px-6">
          <div className="  flex items-center place-content-center opacity-90 rounded-3xl">
              <div className=" flex items-end justify-center">
                <img className="" src="/trophy.png" alt="trophy" height={70} width={70} />
                <p className=" font-Bomb text-white text-4xl">{winrate + "%"}</p>
              </div>
          </div>
          <CardStats title="Played" styles="text-[#D4D4D4]" number={userData?.stats?.matches_played}/>
          <CardStats title="Won" styles="text-green-500" number={userData?.stats?.wins}/>
          <CardStats title="Lost" styles="text-red-600" number={userData?.stats?.losses}/>
        </div>
    </div>
  );
}

const MatchHistory: React.FC<Props> = ({ styles, title }) => {
  const matchHistory = useUserDataContext()?.matches;
  const userData = useUserDataContext()?.user;
  return (
    <div
      className={` glass animate-fade-right animate-delay-150 no-scrollbar h-autoData 2xl:h-[350px] overflow-auto ${styles}`}
    >
      <p className=" p-6 font-Bomb text-3xl text-white">{title}</p>
      <div className=" relative text-white px-8 ">
				<table className="table overflow-auto w-full text-sm text-left border-separate space-y-10">
					<thead className="  text-2xl uppercase font-Bomb">
						<tr className=" text-white/90">
							<th className="p-3">opponent</th>
							<th className="p-3">score</th>
							<th className="p-3">date</th>
						</tr>
					</thead>
					<tbody className=" font-bold overflow-auto text-xl">
            {matchHistory?.map((match:any) => {
              let score = match.player1Score + "-" + match.player2Score
              let result;
              if (match.result === userData?.id){
                result = "win"
              }else{result="lost"}
              let opponent;let avatar; if (match.player1?.id === userData?.id){
                opponent=match.player2?.username;avatar=match.player2?.avatar_url
              }else {opponent=match.player1?.username;avatar=match.player1?.avatar_url}
              return <Row key={match.id} opponent={opponent} score={score} date={match.Date} result={result} avatar={avatar} style="animate-fade-up animate-delay-[400ms]" />
            } )}
						{/* <Row opponent="Hawkins" score="2-5" date="May 30, 2023" result="lost" avatar="/avatars/avatar1.png "style="animate-fade-up animate-delay-[200ms]" />
						<Row opponent="Gloria" score="5-2" date="May 30, 2023" result="win" avatar="/avatars/avatar2.png "style="animate-fade-up animate-delay-[400ms]" />
						<Row opponent="Colleen" score="6-3" date="May 30, 2023" result="win" avatar="/avatars/avatar3.png "style="animate-fade-up animate-delay-[600ms]" />
						<Row opponent="Karim" score="2-5" date="May 30, 2023" result="lost" avatar="/avatars/avatar4.png "style="animate-fade-up animate-delay-[800ms]" />
						<Row opponent="Samir" score="6-3" date="May 30, 2023" result="win" avatar="/avatars/avatar5.png "style="animate-fade-up animate-delay-[1000ms]" /> */}
					</tbody>
				</table>
			</div>
    </div>
  );
}



const Achievments: React.FC<Props> = ({ styles, title }) => {
  return (
    <div
      className={` animate-fade-right overflow-auto no-scrollbar glass h-[350px] ${styles}`}
    >
      <p className=" p-6 font-Bomb text-3xl text-white break-all">{title}</p>

        <p className=" flex w-full font-Heading tracking-wider pt-20 text-2xl place-content-center items-center">Coming Soon</p>
      <div className=" grid gap-x-6 gap-y-2 mx-8 2xl:mx-1 grid-cols-1 sm:grid-cols-2 2xl:grid-cols-1 ">
        {/* <div className="w-full h-20 flex rounded-xl justify-between bg-[#471D49]/[0.7]"> */}
          {/* <div className=" p-4 top-0 z-50 w-[80px] h-full flex justify-center items-center ">
            <img src="/Spectate.png" alt="" className=" rounded-lg" />
          </div>
          <div className="py-4 h-full flex-1 items-start">
            <p className="font-Heading 2xl:tracking-normal tracking-wide text-white text-base"><span className=" font-Bomb">3</span> hard mode Matches</p>
            <p className=" mb-5 font-Heading text-sm">played <span className=" font-Bomb">2</span></p>
          </div>
          <p className=" font-Bomb text-white text-sm p-3 2xl:py-2">2/3</p>
          <div className=" h-20 absolute w-2/3 bg-slate-400/[0.2] rounded-xl animate-fade-right animate-ease-in animate-duration-1000 animate-delay-700"/> */}
        {/* </div> */}
      </div>
    </div>
  );
}

const Profile = () => {
  return (
    <div className=" grid grid-rows-2 gap-y-10 h-auto">
      <div className=" grid grid-cols-1 2xl:grid-cols-3 gap-6 xl:gap-x-6">
        <LevelReached title="Level Reached" styles="" number="" />
        <WinRate title="Win Rate" styles="xl:col-span-2" number="" />
      </div>
      <div className=" grid grid-cols-1 2xl:grid-cols-3 gap-6 xl:gap-x-6">
        <Achievments title="Achievments" styles="" number="" />
        <MatchHistory title="Match History" styles="xl:col-span-2 " number="" />
      </div>
    </div>
  );
};

export default Profile;
