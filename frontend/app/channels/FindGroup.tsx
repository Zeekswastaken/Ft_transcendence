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
    return (
        <div className=' rounded-xl h-auto bg-[#670647]/[0.4] px-1 sm:px-5 pt-[3rem] overflow-auto no-scrollbar sm:mt-10 mt-3'>               
            <div>
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