"use client"
import React, { MouseEvent, useEffect, useState } from 'react'

import GroupInfos from "./component/GroupInfo";
import { useSocketContext } from '../socket';
import { getCookie } from 'cookies-next';
import jwt,{ JwtPayload } from 'jsonwebtoken';
import { useRouter } from 'next/navigation';

interface GroupInfoStatesProps {
    channel: {
        Name: string;
        avatar: string;
        Members: number;
        Type: string;
        Password:string;
        id: number;
      }
      joined: boolean;
}

interface GroupInfosStatesProps
{
    groupsInfos: GroupInfoStatesProps[]
    search: string;
}

const FindGroup = ({groupsInfos, search}: GroupInfosStatesProps) => {
    // console.log("kkkkk = ", groupsInfos)
    const [link, setLink] = useState("");
    const {socket} = useSocketContext();
    const [currentUserID, setCurrentUserID] = useState<number>()
    const [invalidLink, setInvalidLink] = useState("");
    const router = useRouter();
    const token = getCookie("accessToken");
    useEffect(() => {
        try {
            const user = jwt.decode(token as string) as JwtPayload
            if (user) {
                setCurrentUserID(user.id)
          }
        } catch (error) {
            console.error('Error decoding token:');
        }
    }, [])
    const handleSubmit = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        socket?.emit("validateLink", {invite:link});
        socket?.on("validatelink", (data:any) => {
            if (data.isvalid) {
                if (data.channelid !== undefined)
                    socket.emit("JoinChannel", {channelID: data.channelid, userID: currentUserID, Pass: ""})
                socket.on("isjoined", (data:any) => {
                    if (data) {
                        router.push("/chat")
                    }
                })
            }
            else {
                setInvalidLink("Invalid Link");
            }
        })
        // console.log("link = ", link)
    }
    return (
        <div className=' rounded-xl max-h-[700px] bg-[#670647]/[0.4] px-1 sm:px-5 pt-[3rem] overflow-auto no-scrollbar sm:mt-10 mt-3'>               
            <div>
                    <form>
                        <div className=' rounded-xl h-[80px] flex px-1 justify-between place-content-center items-center mb-[1rem] bg-[#670647]/[0.8]'>
                            <h1 className=' pt-1 font-Bomb text-white'>private channel Link</h1>
                            <div className=' flex space-x-5'>
                                <div>
                                    <input onChange={e => {setLink(e.target.value)}} value={link} placeholder='Enter Channel Link' type="text" className=' w-[160px] md:w-[400px] rounded-lg outline-none focus:outline bg-[#532051]  text-center placeholder:font-Heading font-bold text-white h-14 px-10  placeholder:text-gray-400' name="" id="" />
                                    {invalidLink && <p className="text-red-500 text-xs pt-1 text-left">{invalidLink}</p>}
                                </div>
                                <button onClick={handleSubmit} className='  text-base text-white bg-[#532051] px-3  opacity-75 hover:opacity-100 duration-300 rounded-[25px] font-Bomb drop-shadow-[0_5px_5px_rgba(0,0,0,1)] tracking-[2px]'>submit</button>
                            </div>
                        </div>
                    </form>
                {
                    groupsInfos.filter((group) => {
                        return (
                            search.toLocaleLowerCase() === '' 
                                ? group 
                                : group.channel.Name.toLocaleLowerCase().includes(search.toLocaleLowerCase())
                        );
                    }).map((group) => (
                        <GroupInfos 
                                    key={group?.channel.id}
                                    Id={group.channel.id}
                                    Name={group.channel.Name} 
                                    Password={group.channel.Password}
                                    Image={group.channel.avatar} 
                                    Members={group.channel.Members} 
                                    Type={group.channel.Type}
                                    Joined={group.joined}
                        />
                    ))
                }
            </div>
        </div>
    );
}

export default FindGroup;
