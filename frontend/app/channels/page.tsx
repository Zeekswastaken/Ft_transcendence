"use client"

import FindGroup from './FindGroup';
import CreatGroup from './CreatGroup';
import GroupButton from './component/Button';
import GroupFrom from './component/GroupForm';
import { useEffect, useState } from 'react';
import { useSocketContext } from '../socket';
import { create } from 'zustand';
import { getCookie } from 'cookies-next';
import jwt,{ JwtPayload } from 'jsonwebtoken';


type Store = {
  group: boolean;
  setGroup: (group: boolean) => void;
};

export const useGroupStore = create<Store>((set) => ({
  group: true,
  setGroup: (group) => set({ group }),
}));

const page = () => {

  const {group, setGroup} = useGroupStore()


  const [search, setSearch] = useState('');

  const handleOnChangeSearch = (entredSearch :any) => {
      setSearch(entredSearch.target.value);
  }

  const handleOnClickSearch = (e: any) => {
    e.preventDefault();
    setSearch('');
}
const [currentUserID, setCurrentUserID] = useState<Number>();
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
  const handleClick = () => {
    setGroup(!group);
  };
  const {socket} = useSocketContext();
  const [groupsInfo, setGroupsInfo] = useState<GroupInfoStatesProps[]>([]);
  
  useEffect(() => {
    if (currentUserID)
      socket?.emit('getChannels', { userid: currentUserID });
    if (socket) {
      socket.on('channels', (data: any) => {
        setGroupsInfo(data);
      });
    }
  }, [currentUserID, socket, group]); 
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
                {currentUserID && <FindGroup groupsInfos={groupsInfo} search={search}/>}
              </div>
            ): (
              <CreatGroup />
            )}
        </div>
    </div>
  )
}

export default page