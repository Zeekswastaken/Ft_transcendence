"use client"
import React from 'react'

import FindGroup from './FindGroup';
import CreatGroup from './CreatGroup';
import GroupButton from './component/Button';
import GroupFrom from './component/GroupForm';


const page = () => {

  const [group, setGroup] = React.useState(true);
  const [search, setSearch] = React.useState('');

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
      type: "Protected"
    },
    {
      name : "Inceptos",
      image: "https://placekitten.com/g/200/200",
      members: 12,
      type: "Public"
    },
    {
      name : "Vestibulum",
      image: "https://placekitten.com/g/200/200",
      members: 3,
      type: "Protected"
    },
    {
      name : "Fringilla Fusce Elit",
      image: "https://placekitten.com/g/200/200",
      members: 20,
      type: "Protected"
    },
    {
      name : "Alkawakkib",
      image: "https://placekitten.com/g/200/200",
      members: 12,
      type: "Public"
    },
    {
      name : "Argontina",
      image: "https://placekitten.com/g/200/200",
      members: 3,
      type: "Protected"
    },
    {
      name : "Vamos",
      image: "https://placekitten.com/g/200/200",
      members: 20,
      type: "Protected"
    },
    {
      name : "Mostagraciass",
      image: "https://placekitten.com/g/200/200",
      members: 12,
      type: "Public"
    },
    {
      name : "Suuuu",
      image: "https://placekitten.com/g/200/200",
      members: 3,
      type: "Protected"
    },
  ];

  interface GroupInfoStatesProps {
    name: string;
    image: string;
    members: number;
    type: string;
  }

  const addGroupsInfo = (groupInfo: GroupInfoStatesProps) =>
  {
    groupsInfo.push(groupInfo);
  }

  return (
    <div className=' text-3xl text-white pt-[200px] w-full mx-10 h-screen max-w-[1400px]'>
        <div className=' mb-[30px] w-full'>
          <div className='flex justify-between'> 
              <div className='flex'>
                <div className='mr-5'>
                  <GroupButton name='Find Group' bt_state={group} onClick={handleClick}></GroupButton>
                </div>
                  <GroupButton name='Creact Group' bt_state={!group} onClick={handleClick}></GroupButton>
              </div>
              <div>
                {group ? <GroupFrom handleOnChangeSearch={handleOnChangeSearch} 
                                    handleOnClickSearch={handleOnClickSearch} 
                                    search={search}/> 
                        : <div></div>}
              </div>
          </div>
        </div>

        {group ? <FindGroup groupsInfos={groupsInfo} search={search}/> : <CreatGroup />}
    </div>
  )
}

export default page