"use client"

import Link from "next/link";
import Row from "../tools/Row";
import { useUserDataContext } from "@/app/userDataProvider";
import { useSocketContext } from "@/app/socket";
import { useEffect, useState } from "react";
import { getCookie } from "cookies-next";
import jwt,{ JwtPayload } from "jsonwebtoken";
import axios from "axios";

type TableDataFreind = {
	avatar: string
	name: string
	status: string
	styles?: string
}


const Friend = ( { avatar, name, status, styles} : TableDataFreind ) => {
	const onOrOffColor = status === "Online" ? "text-[#22C55E]" : "text-[#FF4747]";
	return (
		<Link href={`/users/${name}`}>
		<ul className={` ${styles} hover:bg-primary-pink-200/[0.6] transition-all duration-500 hover:rounded-3xl hover:drop-shadow-2xl pt-4 lg:pt-6  divide-y divide-gray-200 dark:divide-gray-700 tracking-widest text-[24px] text-white font-Headinglight`}>
			<li className="pb-3 sm:pb-4 mx-10 ">
				<div className="flex items-center space-x-6">
					{/* <div className="flex"> */}
					{/* </div> */}
					<img className="w-14 h-14 rounded-full" src={avatar} alt="avatar"/>
					<div className=" flex-1 min-w-0">
						<p className="  duration-300 cursor-pointer truncat ">{name}</p>
					</div>
					<div className= {`inline-flex items-center tracking-wider text-lg ${onOrOffColor}`}>
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
	
	useEffect(() => {
		  const token = getCookie("accessToken");
		  try {
			const user = jwt.decode(token as string) as JwtPayload
			if (user)
			  setUser(user?.username)
			// setCurrentUsername(jwt.decode(token).username);
		  } catch (error) {
			console.error('Error decoding token:');
		  }
		axios.get(`http://localhost:3000/profile/${User}`).then((res) =>{
			if(res.data.message === "not-found"){
			  setUser(undefined)
			  return;
			}
			else{
				console.log(res.data);
				setUserFriends(res.data.friends);
			}
		  }).catch((err) => {
			console.log(err);
		  })
	  }, [User])
	// const Data = useUserDataContext()
	// const userFriends = Data?.friends;
	// console.log("userFriends = ", userFriends)
	// const [userFriends, setUserFriends] = useState<any>(undefined)
	// const {socket} = useSocketContext()

	// useEffect(() => {
	// 	socket?.io("GetUserStatus", (data:any) => {
	// 		setUserFriends(data);
	// 	})
	// 	socket?.emit("UserStatus");
	// }, [socket])


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
					<tbody className=" font-bold text-xl ">
						<Row opponent="Hawkins" score="2-5" date="May 30, 2023" result="lost" avatar="/avatars/avatar1.png "style="animate-fade-up animate-delay-[0ms]" />
						<Row opponent="Gloria" score="5-2" date="May 30, 2023" result="win" avatar="/avatars/avatar2.png "style="animate-fade-up animate-delay-[200ms]" />
						<Row opponent="Colleen" score="6-3" date="May 30, 2023" result="win" avatar="/avatars/avatar3.png "style="animate-fade-up animate-delay-[400ms]" />
						<Row opponent="Karim" score="2-5" date="May 30, 2023" result="lost" avatar="/avatars/avatar4.png "style="animate-fade-up animate-delay-[600ms]" />
						<Row opponent="Samir" score="6-3" date="May 30, 2023" result="win" avatar="/avatars/avatar5.png "style="animate-fade-up animate-delay-[800ms]" />
					</tbody>
				</table>
			</div>
			<div className=" animate-fade-up glass no-scrollbar mt-10 lg:mt-0 lg:ml-[100px] overflow-auto max-h-[522px] ">
				{userFriends?.map((friend:any) => {
					return <Friend key={friend.id} avatar={friend.avatar_url} name={friend.username} status={friend.status} styles=""/>
				})}

				{/* < Friend avatar="/avatars/avatar1.png" name="Hawkins" state="online" styles="animate-fade-up animate-delay-[100ms]"/>
				< Friend avatar="/avatars/avatar2.png" name="Sofia" state="offline" styles="animate-fade-up animate-delay-[200ms]"/>
				< Friend avatar="/avatars/avatar3.png" name="Samia" state="online" styles="animate-fade-up danimate-elay-[300ms]"/>
				< Friend avatar="/avatars/avatar4.png" name="Khalid" state="offline" styles="animate-fade-up animate-delay-[400ms]"/>
				< Friend avatar="/avatars/avatar5.png" name="Mounir" state="online" styles="animate-fade-up animate-delay-[500ms]"/>
				< Friend avatar="/avatars/avatar1.png" name="Barak" state="offline" styles="animate-fade-up animate-delay-[600ms]"/>
				< Friend avatar="/avatars/avatar2.png" name="Wasafi" state="offline" styles="animate-fade-up animate-delay-[700ms]"/>
				< Friend avatar="/avatars/avatar3.png" name="Criminal" state="offline" styles="animate-fade-up animate-delay-[800ms]"/> */}
			</div>
		</div>
		)
}

export default MatchHistory


