"use client"
import React from 'react'

import GroupInfos from "./component/GroupInfo";

interface GroupInfoStatesProps {
    channel: {
        Name: string;
        Image: string;
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
    console.log("kkkkk = ", groupsInfos)
    return (
        <div className=' rounded-xl h-[700px] bg-[#670647]/[0.4] px-1 sm:px-5 pt-[3rem] overflow-auto no-scrollbar sm:mt-10 mt-3'>               
            <div>
                                <div className=' rounded-xl h-[80px] flex px-5 justify-between place-content-center items-center mb-[1rem] bg-[#670647]/[0.8]'>
                    <h1>private channel Link</h1>
                    <div className=' flex space-x-5'>
                        <input type="text" className=' w-[400px] rounded-lg' name="" id="" />
                        <button>submit</button>
                    </div>
                </div>
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
                                    Image={group.channel.Image} 
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
