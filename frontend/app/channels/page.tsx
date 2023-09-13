"use client"

// import React from 'react'

// const page = () => {
//   return (
//     <div className=' h-screen pt-[250px] mx-5 w-full max-w-[1150px]'>
//       <div className=' w-full h-[700px] bg-green-400'>
//         <div className=' w-full flex justify-between h-[15%] bg-red-400 px-5'>
//           <div className=' flex items-center place-content-center space-x-3'>
//             <button className=' px-5 tracking-wide pt-3 pb-2 text-xl text-white font-Bomb bg-primary-pink-300 rounded-lg'>Find Group</button>
//             <button className=' px-5 tracking-wide pt-3 pb-2 text-xl text-white font-Bomb bg-primary-pink-300 rounded-lg'>Creat Group</button>
//           </div>
//           <div className=' flex items-center place-content-center'>
//             <p>Search</p>
//           </div>
//         </div>
//         <div className=' w-full h-full bg-blue-300'>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default page



import FindGroup from './FindGroup';
import CreatGroup from './CreatGroup';
import GroupButton from './component/Button';
import GroupFrom from './component/GroupForm';
import { useState } from 'react';


const page = () => {

  const [group, setGroup] = useState(true);
  const [search, setSearch] = useState('');

  const handleOnChangeSearch = (entredSearch :any) => {
      setSearch(entredSearch.target.value);
  }

  const handleOnClickSearch = (e: any) => {
    e.preventDefault();
    setSearch('');
}

  const handleClick = () => {
    setGroup(!group);
  };


  const groupsInfo = [
    {
      name : "Fringilla Fusce Elit",
      image: "https://placekitten.com/g/200/200",
      members: 20,
      type: "Protected",
      id:1
    },
    {
      name : "Inceptos",
      image: "https://placekitten.com/g/200/200",
      members: 12,
      type: "Public",
      id:2
    },
    {
      name : "Vestibulum",
      image: "https://placekitten.com/g/200/200",
      members: 3,
      type: "Protected",
      id:3
    },
    {
      name : "Fringilla Fusce Elit",
      image: "https://placekitten.com/g/200/200",
      members: 20,
      type: "Protected",
      id:4
    },
    {
      name : "Alkawakkib",
      image: "https://placekitten.com/g/200/200",
      members: 12,
      type: "Public",
      id:5
    },
    {
      name : "Argontina",
      image: "https://placekitten.com/g/200/200",
      members: 3,
      type: "Protected",
      id:6
    },
    {
      name : "Vamos",
      image: "https://placekitten.com/g/200/200",
      members: 20,
      type: "Protected",
      id:7
    },
    {
      name : "Mostagraciass",
      image: "https://placekitten.com/g/200/200",
      members: 12,
      type: "Public",
      id:8
    },
    {
      name : "Suuuu",
      image: "https://placekitten.com/g/200/200",
      members: 3,
      type: "Protected",
      id:9
    },
  ];

  interface GroupInfoStatesProps {
    name: string;
    image: string;
    members: number;
    type: string;
    id: number;
  }

  const addGroupsInfo = (groupInfo: GroupInfoStatesProps) =>
  {
    groupsInfo.push(groupInfo);
  }

  return (
    <div className=' text-sm sm:text-2xl text-white pt-[250px] w-full mx-1 sm:mx-5 h-screen max-w-[1150px] '>
        <div className=' glass p-5  overflow-auto min-w-[350px] items-center'>
          <div className=' mb-[25px]
           w-full'>
            <div className='flex justify-between space-x-1'> 
                <div className='flex space-x-1 sm:space-x-4'>
                    <GroupButton name='Find Group' bt_state={group} onClick={handleClick}></GroupButton>
                    <GroupButton name='Create Group' bt_state={!group} onClick={handleClick}></GroupButton>
                </div>
                <div>
                  {group ? <GroupFrom handleOnChangeSearch={handleOnChangeSearch} 
                                      handleOnClickSearch={handleOnClickSearch} 
                                      search={search}/> 
                          : <div></div>}
                </div>
            </div>
          </div>

          {group ? 
            (
              <div className='  w-full'>
                <FindGroup groupsInfos={groupsInfo} search={search}/>
              </div>
            ): (
              <CreatGroup />
            )}
        </div>
    </div>
  )
}

export default page