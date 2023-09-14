"use client"
import React from 'react'

import GroupInfos from "./component/GroupInfo";

interface GroupInfoStatesProps {
    Name: string;
    Image: string;
    Members: number;
    Type: string;
    Password: string;
    id: number
}

interface GroupInfosStatesProps
{
    groupsInfos: GroupInfoStatesProps[]
    search: string;
}

const FindGroup = ({groupsInfos, search}: GroupInfosStatesProps) => {
    return (
        <div className=' rounded-xl h-[800px] bg-[#670647] px-1 sm:px-5 pt-[3rem] overflow-auto no-scrollbar sm:mt-10 mt-3'>               
            <div>
                {
                    groupsInfos.filter((group) => {
                        return (
                            search.toLocaleLowerCase() === '' 
                                ? group 
                                : group.Name.toLocaleLowerCase().includes(search.toLocaleLowerCase())
                        );
                    }).map((group) => (
                        <GroupInfos 
                                    key={group.id}
                                    Name={group.Name} 
                                    Password={group.Password}
                                    Image={group.Image} 
                                    Members={group.Members} 
                                    Type={group.Type}
                        />
                    ))
                }
            </div>
        </div>
    );
}

export default FindGroup;