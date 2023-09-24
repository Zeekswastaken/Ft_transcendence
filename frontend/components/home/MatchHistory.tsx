"use client"

import Link from "next/link";
import Row from "../tools/Row";
import { useUserDataContext } from "@/app/userDataProvider";
import { useSocketContext } from "@/app/socket";
import { useEffect, useState } from "react";
import { getCookie } from "cookies-next";
import jwt,{ JwtPayload } from "jsonwebtoken";
import axios from "axios";
const url = `http://${process.env.NEXT_PUBLIC_HOST}:${process.env.NEXT_PUBLIC_PORT}/profile/`;

type TableDataFreind = {
	avatar: string
	name: string
	status: string
	styles?: string
}


const Friend = ( { avatar, name, status, styles} : TableDataFreind ) => {
	// const onOrOffColor = status === "Online" ? "text-[#22C55E]" : "text-[#FF4747]";
	let StatusColor;
	if (status === "Online")
		StatusColor =  "text-[#22C55E]";
	else if (status === "Offline")
		StatusColor = "text-[#FF4747]";
	else
		StatusColor = "text-[#63B3ED]";


	return (
		<Link href={`/users/${name}`}>
		<ul className={` ${styles} hover:bg-primary-pink-200/[0.6] transition-all duration-500 hover:rounded-3xl hover:drop-shadow-2xl pt-4 lg:pt-6  divide-y divide-gray-200 dark:divide-gray-700 tracking-wider text-[24px] text-white font-bold`}>
			<li className="pb-3 sm:pb-4 mx-10 ">
				<div className="flex items-center space-x-6">
					{/* <div className="flex"> */}
					{/* </div> */}
					<img className="w-14 h-14 rounded-full" src={avatar} alt="avatar"/>
					<div className=" flex-1 min-w-0">
						<p className="  duration-300 cursor-pointer truncat ">{name}</p>
					</div>
					<div className= {`inline-flex items-center font-Heading tracking-wider text-lg ${StatusColor}`}>
						{status}
					</div>
				</div>
			</li>
		</ul>
		</Link>	
	)
}

const MatchHistory = () => {

	const [User, setUser] = useState<any>()
	const [userFriends, setUserFriends] = useState<Array<any>>()
	const [matchHistory, setMatchHistory] = useState<Array<any>>();
	const [userData, setUserData] = useState();
	
	const token = getCookie("accessToken");
	useEffect(() => {
		if(!User) {
			try {
			  const user = jwt.decode(token as string) as JwtPayload
			  if (user)
				setUser(user?.username)
			  // setCurrentUsername(jwt.decode(token).username);
			} catch (error) {
			  console.error('Error decoding token:', error);
			}
		}
	},[])
	useEffect(() => {
		if (User) {
			axios.get(`${url}${User}`).then((res) =>{
				if(res.data.message === "not-found"){
				  setUser(undefined)
				  return;
				}
				else{
					setUserFriends(res.data.friends);
					setMatchHistory(res.data.matches);
					setUserData(res.data.user)
				}
			  }).catch((err) => {
				console.log(err);
			  })
		}
	  }, [User])
	// const userData = useUserDataContext()?.user;
	return (
		
		<div className=" min-w-[350px]  my-16 mx-2 sm:mx-20 grid grid-cols-1 lg:grid-cols-2 lg:max-w-[1400px] ">
			<div className=" glass animate-fade-up no-scrollbar relative text-white px-8 pb-6 pt-3 w-full overflow-auto max-h-[522px]">
				<table className="table w-full text-sm text-left border-separate space-y-10">
					<thead className="  text-2xl uppercase font-Bomb">
						<tr className=" text-white/90">
							<th className="p-3">opponent</th>
							<th className="p-3">score</th>
							<th className="p-3">date</th>
						</tr>
					</thead>
					<tbody className=" font-bold text-xl  ">
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
					</tbody>
				</table>
			</div>
			<div className="  animate-fade-up glass no-scrollbar mt-10 lg:mt-0 lg:ml-[100px] overflow-auto h-[522px] ">
				{userFriends?.length !== 0 ? userFriends?.map((friend:any) => {
					return <Friend key={friend?.id as number} avatar={friend?.avatar_url} name={friend?.username} status={friend?.status} styles=""/>
				}): (
					<div className=" flex place-content-center items-center w-full h-full">
						<p className=" font-Bomb text-3xl text-white/[0.8] py-10">No Friends available</p>
					</div>
				)}
			</div>
		</div>
		)
}

export default MatchHistory


