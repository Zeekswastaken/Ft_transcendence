"use client"
import React from 'react'

import GroupInfos from "./component/GroupInfo";

interface GroupInfoStatesProps {
    name: string;
    image: string;
    members: number;
    type: string;
    id: number
}

interface GroupInfosStatesProps
{
    groupsInfos: GroupInfoStatesProps[]
    search: string;
}

const FindGroup = ({groupsInfos, search}: GroupInfosStatesProps) => {
    return (
        <div className=' rounded-xl h-[800px] bg-[#670647] px-1 sm:px-5 pt-[3rem] overflow-auto no-scrollbar mt-10'>               
            <div>
                {
                    groupsInfos.filter((group) => {
                        return (
                            search.toLocaleLowerCase() === '' 
                                ? group 
                                : group.name.toLocaleLowerCase().includes(search.toLocaleLowerCase())
                        );
                    }).map((group) => (
                        <GroupInfos 
                                    key={group.id}
                                    name={group.name} 
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