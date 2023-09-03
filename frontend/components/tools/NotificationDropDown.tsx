"use client"
import { use, useEffect, useState } from 'react'
import { Tab, Menu } from '@headlessui/react'
import { idText } from 'typescript'
import Link from 'next/link'
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useSocketContext } from '@/app/socket'
import jwt,{ JwtPayload } from 'jsonwebtoken'
import { getCookie } from 'cookies-next'

function classNames(...classes : any) {
  return classes.filter(Boolean).join(' ')
}

const  NotificationDropDown = () => {
  let [categories] = useState({
    "Friend Request": [
      // {
      //     id: 1,
      //     title: 'Zeeks Sends you a friend Request',
      //     date: 'Jan 7',
      //     isInvite: 0,
      // },
      // {
      //     id: 2,
      //     title: 'Oussama Sends you a friend Request',
      //     date: 'Mar 19',
      //     isInvite: 0,
      //   },
      ],
    Invites: [
    //   {
    //     id: 1,
    //     title: 'Mark Invites you to game',
    //     date: '5h ago',
    //     isInvite: 1,
    // },
    // {
    //     id: 2,
    //     title: "Fouad Invites you to game",
    //     date: '2h ago',
    //     isInvite: 1,
    // },
  ]
  })

  // [
  //   [
  //       {
  //           "id": 1,
  //           "type": "Friend Request",
  //           "isRead": false,
  //           "message": "You have received a friend request from: test",
  //           "createdAt": "2023-09-03T09:26:38.346Z"
  //       }
  //   ]
  // ]
  


  const [friendNotifs, setFriendNotifs] = useState<any[]>([])
  const [currentUserID, setCurrentUserID] = useState<number>(0)
  const {socket} = useSocketContext();

  useEffect(() => {
    const token = getCookie("accessToken");
    try {
      const user = jwt.decode(token as string) as JwtPayload
      if (user) {
        setCurrentUserID(user.id)
      }
      // setCurrentUsername(jwt.decode(token).username);
    } catch (error) {
      console.error('Error decoding token:');
    }
  }, [])

  useEffect(() => {
    socket?.on('friend notif', (data:any) => {
      setFriendNotifs(prev => [...prev, data])
    })
  }, [])

  useEffect(() => {
    socket?.emit('getFriendNotifs', {userID: currentUserID})
  }, [currentUserID])
  console.log(friendNotifs)
  return (
	<Menu as="div" className=" mt-3">
        <div>
          <Menu.Button>
		        <img src="/notification.svg" alt="notification" width={32} height={32}/>
          </Menu.Button>
        </div>
          <Menu.Items className=" absolute right-20 mt-2 mr-2 xl:mr-0 w-30  divide-y-1 tracking-wide divide-gray-300 rounded-md  shadow-3xl  ">
              <Tab.Group>
                  <Tab.List className="flex space-x-1 rounded-xl bg-primary-purple-800 p-1">
                  {Object.keys(categories).map((category) => (
                    <Tab
                    key={category}
                    className={({ selected }) =>
                      classNames(
                      'w-full rounded-lg py-2.5 text-sm font-Bomb tracking-widest leading-5 ',
                      selected
                        ? 'bg-[#411742] text-white shadow'
                        : 'text-white hover:bg-white/[0.12] hover:text-white duration-300'
                      )
                    }
                    >
                    {category}
                    </Tab>
                  ))}
                  </Tab.List>
                  <Tab.Panels className="mt-2">
                  {friendNotifs.map((notif, idx) => (
                    <Tab.Panel
                    key={idx}
                    className={classNames(
                      'rounded-xl bg-[#411742] drop-shadow-[6px_5px_0_rgba(0,0,00.25)] p-3',
                      ' font-bold'
                    )}
                    >
                    <ul className=' max-h-96 overflow-auto text-[#EFEFEF]'>
                      {friendNotifs.map((notif) => (
                      <li
                        key={notif?.id}
                        className="relative rounded-md grid items-center p-3 hover:bg-primary-purple-800/[0.8] duration-300"
                      >
                            <div className=' space-x-4 flex justify-between'>
                              {notif?.type === "Game Invite" ? (
                                <Link href="/game">
                                <h3 className="text-sm  leading-5">
                                  {notif?.message}
                                </h3>
                                </Link>
                              ) : (
                                <div className=' flex justify-between space-x-4 w-full'>
                                  <h3 className="text-sm  leading-5">
                                    {notif?.message}
                                  </h3>
                                  <div className=' flex space-x-1 items-center'>
                                    <button className=' bg-primary-purple-800/[0.2] hover:bg-[#411742] rounded-md'><XMarkIcon className=" h-7 w-7 text-red-600"/></button>
                                    <button className=' bg-primary-purple-800/[0.2] hover:bg-[#411742] rounded-md'><CheckIcon className=' h-7 w-7 text-green-400'/></button>
                                  </div>
                                </div>
                              )}
                                {/* {post.isInvite === 0 ? ( */}
                                 {/* "" // <div className=' flex space-x-1'>
                                  //   <button className=' bg-primary-purple-800/[0.2] hover:bg-[#411742] rounded-md'><XMarkIcon className=" h-7 w-7 text-red-600"/></button>
                                  //   <button className=' bg-primary-purple-800/[0.2] hover:bg-[#411742] rounded-md'><CheckIcon className=' h-7 w-7 text-green-400'/></button>
                                  // </div>
                                // ) : ("")} */}
                            </div>
                          <ul className="mt-1 flex space-x-1 text-xs font-normal leading-4 text-gray-200">
                          <li>{notif?.createdAt}</li>
                          </ul>

                      </li>
                      ))}
                    </ul>
                    </Tab.Panel>
                  ))}
                  </Tab.Panels>
                </Tab.Group>
          </Menu.Items>
      </Menu>
  )
}

export default NotificationDropDown


