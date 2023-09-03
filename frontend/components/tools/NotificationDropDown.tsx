"use client"
import { useEffect, useState } from 'react'
import { Tab, Menu } from '@headlessui/react'
import { idText } from 'typescript'
import Link from 'next/link'
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useSocketContext } from '@/app/socket'
import { getCookie } from 'cookies-next'
import jwt,{ JwtPayload } from 'jsonwebtoken'

function classNames(...classes : any) {
  return classes.filter(Boolean).join(' ')
}

const  NotificationDropDown = () => {
  let [categories] = useState({
    Invites: [
      {
        id: 1,
        title: 'Mark Invites you to game',
        date: '5h ago',
        isInvite: 1,
    },
    {
        id: 2,
        title: "Fouad Invites you to game",
        date: '2h ago',
        isInvite: 1,
    },
],
"Friend Request": [
    {
        id: 1,
        title: 'Zeeks Sends you a friend Request',
        date: 'Jan 7',
        isInvite: 0,
    },
    {
        id: 2,
        title: 'Oussama Sends you a friend Request',
        date: 'Mar 19',
        isInvite: 0,
      },


    ],
  })
  
  const [notification, setNotification] = useState<any>({})
  const [currentUserID, setCurrentUserID] = useState<number>(0)
  const {socket} = useSocketContext();
  const [decline, setDecline] = useState<boolean>(false)
  const [decIdx, setDecIdx] = useState<number>(-1)

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
  }, [currentUserID])

  useEffect(() => {
    socket?.on('friend notif', (data:any) => {
      setNotification(data)
      console.log("here")
    })
  }, [])

  useEffect(() => {
    socket?.emit('getFriendNotifs', {userID: currentUserID})
    console.log("here2")
  }, [currentUserID])
  console.log(notification)
  const handleDecline = (idx:number) => {
    setDecline(true)
    setDecIdx(idx)
  }
  const handleAccept = () => {
    setDecline(false)
    socket?.emit("denyFriendRequest", {userID: currentUserID, recipientID: notification.friendRequest[decIdx].senderID});
    // router.push(`/users/${Data?.user.username}/`)
  }
  return (
	<Menu as="div" className=" mt-3">
        <div>
          <Menu.Button>
		        <img src="/notification.svg" alt="notification" width={32} height={32}/>
          </Menu.Button>
        </div>
          <Menu.Items className=" absolute right-20 mt-2 mr-2 xl:mr-0 sm:w-[400px]  divide-y-1 tracking-wide divide-gray-300 rounded-md  shadow-3xl ">
              <Tab.Group>
                  <Tab.List className="flex space-x-1 rounded-xl bg-primary-purple-800 p-1">
                  {Object?.keys(notification).map((category) => (
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
                  {/* {Object.values(notification).map((posts:any, idx) => (
                    <Tab.Panel
                    key={idx}
                    className={classNames(
                      'rounded-xl bg-[#411742] drop-shadow-[6px_5px_0_rgba(0,0,00.25)] p-3',
                      ' font-bold'
                    )}
                    >
                    <ul className=' max-h-96 overflow-auto text-[#EFEFEF] no-scrollbar'>
                      {posts?.map((post:any) => (
                      <li
                        key={post?.id}
                        className="relative rounded-md grid items-center p-3 hover:bg-primary-purple-800/[0.8] duration-300"
                      >
                            <div className=' space-x-4 flex justify-between'>
                              {post.isInvite ? (
                                <Link href="/game">
                                <h3 className="text-sm  leading-5">
                                  {post?.message}
                                </h3>
                                </Link>
                              ) : (
                                <div className=' flex justify-between space-x-4 w-full'>
                                      <h3 className="text-sm  leading-5">
                                        {post.message}
                                      </h3>
                                      <div className=' flex space-x-1 items-center'>
                                        <button onClick={e => handleDecline(idx)} className=' bg-primary-purple-800/[0.2] hover:bg-[#411742] rounded-md'><XMarkIcon className=" h-7 w-7 text-red-600"/></button>
                                        <button onClick={e => handleAccept()} className=' bg-primary-purple-800/[0.2] hover:bg-[#411742] rounded-md'><CheckIcon className=' h-7 w-7 text-green-400'/></button>
                                      </div>
                                </div>
                              )}
                            </div>
                          <ul className="mt-1 flex space-x-1 text-xs font-normal leading-4 text-gray-200">
                          <li>{post.createdAt}</li>
                          </ul>

                      </li>
                      ))} */}
                    {/* </ul> */}
                    {/* </Tab.Panel> */}
                  {/* ))} */}
                  </Tab.Panels>
                </Tab.Group>
          </Menu.Items>
      </Menu>
  )
}

export default NotificationDropDown


