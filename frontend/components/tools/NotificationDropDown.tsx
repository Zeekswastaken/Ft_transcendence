"use client"
import { useEffect, useState } from 'react'
import { Tab, Menu } from '@headlessui/react'
import { idText } from 'typescript'
import Link from 'next/link'
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useSocketContext } from '@/app/socket'
import { getCookie } from 'cookies-next'
import jwt,{ JwtPayload } from 'jsonwebtoken'
import { useRouter } from 'next/navigation'

function classNames(...classes : any) {
  return classes.filter(Boolean).join(' ')
}

const  NotificationDropDown = () => {
  let [categories] = useState({"Friend Request": [],Invites: []})
  
  const [notification, setNotification] = useState<{}>({})
  const [currentUserID, setCurrentUserID] = useState<number>(0)
  const {socket} = useSocketContext();
  const [decline, setDecline] = useState<boolean>(false)
  const [decIdx, setDecIdx] = useState<number>(-1)
  const [isClicked , setIsClicked] = useState(false);
  const [newNotif, setNewNotif] = useState<boolean | undefined> (undefined);
  const [recipientID, setRecipientId] = useState(0);
  const [senderID, setSenderId] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const token = getCookie("accessToken");
    try {
      const user = jwt.decode(token as string) as JwtPayload
      if (user) {
        setCurrentUserID(user.id)
      }
    } catch (error) {
      console.error('Error decoding token:');
    }
  }, [])

  useEffect(() => {
      socket?.on('friend notif', (data:any) => {
        if (data) {
          setRecipientId(data?.friendRequest[0]?.recipient.id)
          setSenderId(data?.friendRequest[0]?.sender.id)
        }
        if (!data)
          setNewNotif(false)
        else {
          setNewNotif(true)
        }
        setNotification(data)
      })
    return () => {
      socket?.off("friend notif");
    };
  }, [socket])

  useEffect(() => {
    socket?.emit('getFriendNotifs', {userID: currentUserID})
    if (isClicked)
      setNewNotif(false)
  }, [newNotif, socket, currentUserID, isClicked])

  const handleDecline = (sender:number) => {
    setDecline(true)
    setDecIdx(sender)
    setNewNotif(false)
    socket?.emit("denyFriendRequest", {userID: currentUserID, recipientID: sender});
    router.refresh()
    
  }
  const handleAccept = (sender:number) => {
    setDecline(false)
    setNewNotif(false)
    router.refresh();
    socket?.emit("acceptFriendRequest", {userID: currentUserID, recipientID: sender});
  }
  const handleNotifClick = (e: React.MouseEvent<HTMLElement>) => {
    // if (!isClicked)
      setNewNotif(false)
      setIsClicked(true)
  }

  const handleInvite = (sender:string) => {
    socket.emit("AcceptInvite", {userid:currentUserID, receiver:sender})
    socket.on("acceptedqueue", (data:any) => {
      if (data.status === "accepted")
        router.push("/game/OneVsOne/Random")
    })
  }

  return (
	<Menu as="div" className=" mt-3">
        <div>
          <Menu.Button onClick={handleNotifClick}>
		        <img src="/notification.svg" alt="notification" width={32} height={32}/>
            {newNotif && currentUserID === recipientID && <div onClick={e => {setNewNotif(false)}} className=' w-4 h-4 blur-[2px] ml-4 top-5 absolute rounded-full bg-primary-pink-300 '/>}
          </Menu.Button>
        </div>
          <Menu.Items className=" absolute right-20 mt-2 mr-2 xl:mr-0 sm:w-[400px]  divide-y-1 tracking-wide divide-gray-300 rounded-md  shadow-3xl ">
              <Tab.Group>
                  <Tab.List className="flex space-x-1 rounded-xl bg-primary-purple-800 p-1">
                  {notification && Object.keys(categories).map((category) => (
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
                  {notification && Object.values(notification).map((posts:any, idx) => (
                    <Tab.Panel
                    key={idx}
                    className={classNames(
                      'rounded-xl bg-[#411742] drop-shadow-[6px_5px_0_rgba(0,0,00.25)] p-3',
                      ' font-bold'
                    )}
                    >
                    <ul className=' max-h-96 overflow-auto text-[#EFEFEF] no-scrollbar'>
                      {Array.isArray(posts) && posts?.map((post:any) => (
                      <li
                        key={post?.id}
                        className="relative rounded-md grid items-center p-3 hover:bg-primary-purple-800/[0.8] duration-300"
                      >
                            <div className=' space-x-4 flex justify-between'>
                              {post.type !== "Friend Request" ? (
                                // <Link href="/game">
                                <h3 onClick={e => handleInvite(post.sender.username)} className="text-sm cursor-pointer w-full h-full leading-5">
                                  {post?.message}
                                </h3>
                                // </Link>
                              ) : (
                                <div className=' flex justify-between space-x-4 w-full'>
                                      <h3 className="text-sm  leading-5">
                                        {post.message}
                                      </h3>
                                      <div className=' flex space-x-1 items-center'>
                                        <button onClick={e => handleDecline(post.sender.id)} className=' bg-primary-purple-800/[0.2] hover:bg-[#411742] rounded-md'><XMarkIcon className=" h-7 w-7 text-red-600"/></button>
                                        <button onClick={e => handleAccept(post.sender.id)} className=' bg-primary-purple-800/[0.2] hover:bg-[#411742] rounded-md'><CheckIcon className=' h-7 w-7 text-green-400'/></button>
                                      </div>
                                </div>
                              )}
                            </div>
                          <ul className="mt-1 flex space-x-1 text-xs font-normal leading-4 text-gray-200">
                          <li>{post.createdAt}</li>
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


