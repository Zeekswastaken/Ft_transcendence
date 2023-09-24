"use client"

import { Fragment, useEffect, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/24/outline'
import { setOpponentAvatar } from "@/redux/features/avatarSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import jwt,{ JwtPayload } from 'jsonwebtoken';
import { getCookie } from 'cookies-next';
import { useSocketContext } from '@/app/socket';
import { create } from 'zustand';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

type Store = {
  username: string
  setUsername: (username: string) => void;
};

export const useSelectFriendStore = create<Store>((set) => ({
  username: "",
  setUsername: (username) => set({username}),
}));

export default function SelectFriend() {
  const {socket} = useSocketContext();
  
  const [people, setPeople] = useState<any[]>([]);
  const [currentUserID, setCurrentUserID] = useState<Number>();
  const [currentUserAvatar, setCurrentUserAvatar] = useState("");
  
  const token = getCookie("accessToken");
  useEffect(() => {
    try {
      const user = jwt.decode(token as string) as JwtPayload
      if (user) {
        setCurrentUserID(user.id)
        setCurrentUserAvatar(user.avatar_url)
      }
    } catch (error) {
      console.error('Error decoding token:');
    }
  }, [])
  
  useEffect(() => {
    socket?.emit('GetOnlineFriends', {id: currentUserID});
    if (socket) {
      socket.on('GetOnlineFriends', (data: any) => {
        setPeople(data);
      });
    }
  }, [currentUserID])
  const [selected, setSelected] = useState(people[1])
  const dispatch = useAppDispatch();
  const {username, setUsername} = useSelectFriendStore()
  useEffect(() => {
    setUsername(selected?.username)
    dispatch(setOpponentAvatar(selected?.avatar_url));
  }, [dispatch, selected?.avatar_url, selected?.username]);
    
    return (
      
      <Listbox value={selected} onChange={setSelected}>
        {({ open }) => (
          <>
            <div className=" relative ">
              <Listbox.Button className="relative w-full bg-[#a34b83] rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-pointer focus:outline-none  sm:text-sm">
                <span className="flex items-center">
                  <img src={selected?.avatar_url} alt="" className="flex-shrink-0 h-8 w-8 rounded-full" />
                  {/* {setSelectedAvatar(selected.avatar)} */}
                  <span className="ml-3 text-lg font-Bomb tracking-wider text-white block truncate">{selected?.username}</span>
                  <img src="/drop.svg" className=" right-2 absolute" width={18} height={18} alt="" />
                </span>
                {/* <span className="ml-3 absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none"> */}
                  {/* <SelectorIcon className="h-5 w-5 text-gray-400" aria-hidden="true" /> */}
                {/* </span> */}
              </Listbox.Button>

              <Transition
                show={open}
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
                >
                <Listbox.Options className="absolute mt-1 w-full bg-gray-300 shadow-lg max-h-56 rounded-md py-1 text-base ring-1 no-scrollbar ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                  {people.map((person) => (
                    <Listbox.Option
                      key={person.id}
                      className={({ active }) =>
                      classNames(
                          active ? 'text-white bg-[#a34b83]' : 'text-gray-900',
                          'cursor-default select-none relative py-2 pl-3 pr-9'
                        )
                      }
                      value={person}
                    >
                      {({ selected:any, active }) => (
                        <>
                          <div className=" flex items-center">
                            <img src={person?.avatar_url} alt="" className="flex-shrink-0 h-6 w-6 rounded-full" />
                            <span
                              className={classNames(selected ? 'font-semibold' : 'font-normal', 'ml-3 block truncate')}
                            >
                              {person?.username}
                            </span>
                          </div>

                          {selected ? (
                            <span
                            className={classNames(
                                active ? 'text-white' : 'text-indigo-600',
                                'absolute inset-y-0 right-0 flex items-center pr-4'
                              )}
                              >
                              <CheckIcon className="h-5 w-5" aria-hidden="true" />
                            </span>
                          ) : ""}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </>
        )}
      </Listbox>
  )
}
