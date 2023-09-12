"use client"
import React from 'react'

import GroupInfos from "./component/GroupInfo";

interface GroupInfoStatesProps {
    name: string;
    image: string;
    members: number;
    type: string;
}

interface GroupInfosStatesProps
{
    groupsInfos: GroupInfoStatesProps[]
    search: string;
}

const FindGroup = ({groupsInfos, search}: GroupInfosStatesProps) => {
    return (
        <div className=' rounded-xl h-[800px] bg-[#A1216C] px-[3rem] pt-[3rem] mb-[100px] overflow-auto no-scrollbar'>               
            <div>
                {
                    groupsInfos.filter((group) => {
                        return (
                            search.toLocaleLowerCase() === '' 
                                ? group 
                                : group.name.toLocaleLowerCase().includes(search.toLocaleLowerCase())
                        );
                    }).map((group) => (
                        <GroupInfos name={group.name} 
                                    image={group.image} 
                                    members={group.members} 
                                    type={group.type}
                        />
                    ))
                }
            </div>
        </div>
    );
}

export default FindGroup;