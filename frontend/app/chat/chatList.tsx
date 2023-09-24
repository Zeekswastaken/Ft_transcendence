"use client";
import React, { useState } from "react"
import FriendBar from './friendBar';
import GroupBar from './groupBar';
import EmptyChatList from './emptyChatList';
import EmptyGroupList from './emptyGroupList';
import { useMyStore } from "./state";
import { Tab } from '@headlessui/react'

function classNames(...classes:any) {
  return classes.filter(Boolean).join(' ')
}
function chatList({userFriends, userGroups}:any)
{
  const {setMyBoolean , myBoolean} = useMyStore();
  return (
    <div className={` w-[500px] h-[90%]  max-w-md px-2  p-1 m-4 glass ${myBoolean ? "max-lg:hidden" : "max-lg:w-full"}`}>
      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-primary-purple-400 p-1">
            <Tab
              key={Math.random()}
              className={({ selected }) =>
                classNames(
                  'w-full rounded-lg py-2.5 text-sm font-Bomb font-medium leading-5 text-white',
                  
                  selected
                    ? 'bg-primary-purple-200 shadow'
                    : ' hover:text-white'
                )
              }
            >
              Friends
            </Tab>
            <Tab
              key={Math.random()}
              className={({ selected }) =>
                classNames(
                  'w-full rounded-lg py-2.5 text-sm font-Bomb font-medium leading-5 text-white',
                  ' focus:outline-none',
                  selected
                    ? 'bg-primary-purple-200 shadow'
                    : ' hover:text-white'
                )
              }
            >
              Groups
            </Tab>
        </Tab.List>
        <Tab.Panels className="mt-2 h-[93%] overflow-y-scroll no-scrollbar rounded-2xl">
          <Tab.Panel
              key={Math.random()}
              className={classNames(
                'rounded-xl p-1 h-full'
              )}
            >
              {userFriends.length ? (<ul className=" flex flex-col  whitespace-no-wrap space-y-2">
                {userFriends?.map((friend:any) => {
                  return <FriendBar key={friend.user.id} friend={friend} />
                })}
              </ul>)
              : <EmptyChatList/>}
            </Tab.Panel>
            <Tab.Panel
              key={Math.random()}
              className={classNames(
                'rounded-xl p-1 h-full'
              )}
            >
              {userGroups.length ? (<ul className=" flex flex-col  whitespace-no-wrap space-y-2">
                {userGroups?.map((friend:any) => {
                  return <GroupBar key={friend.id} friend={friend} />
                })}
              </ul>)
              : <EmptyGroupList/>}
            </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  )
}

export default chatList;