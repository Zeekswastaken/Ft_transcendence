"use client"
import jwt, { JwtPayload } from "jsonwebtoken";
import { Menu, Transition } from '@headlessui/react'
import { deleteCookie, getCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
import { FormEvent, Fragment, use, useEffect, useState } from 'react'
import axios from "axios";
import { useUserDataContext } from "@/app/userDataProvider";

const ProfileDropDown = () => {

  const router = useRouter();
  const pushProfilePage = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    router.push(profilePage);
  }
  // const user = useAppSelector((state) => state.userDataReducer.value)
  // const user = useUserDataContext()
  const [user, setUser] = useState<JwtPayload>()
  
  const token = getCookie("accessToken");
  useEffect(() => {
    try {
      const user = jwt.decode(token as string) as JwtPayload
      if (user)
      setUser(user)
    // setCurrentUsername(jwt.decode(token).username);
  } catch (error) {
    console.error('Error decoding token:');
  }
}, [token])

  const currentUsername = user?.username;
  const profilePage = `/users/${currentUsername}`;
  const handleSignOut = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()  
    deleteCookie("accessToken");
    router.push("/login")
  }
  return (
    // <div className="">
      <Menu as="div">
        <div>
          <Menu.Button>
            <div className=" w-[60px] h-[60px] rounded-full border-[3px] border-primary-pink-300">
              <img src={user?.avatar_url as string} className=' rounded-full w-full h-full' alt="Profile"/>
            </div>
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className=" text-[#EAEAEA] absolute right-0 mt-1 mr-2 xl:mr-0 w-30 origin-top-right divide-y-1 tracking-wide divide-gray-300 rounded-md bg-[#411742] shadow-3xl  ">
            <div className="px-1 py-2">
            <Menu.Item>
                {({ active }) => (
                <div
                    className={`${
                    active ? '' : ''
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                >
                    <div>
                        <div className='font-Bomb text-center grid'>{user?.username}</div>
                        {/* <div className=' font-Heading tracking-widest'>Fouamep</div> */}
                    </div>
                </div>
                )}
            </Menu.Item>
            </div>
            <div className="px-1 py-1 items-center font-bold">
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={pushProfilePage}
                    className={`${
                      active ? 'bg-[#be67d2] duration-300' : ''
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                  >
                    My Profile
                  </button>
                )}
              </Menu.Item>
            </div>
            <div className="px-1 py-2 font-semibold">
              <Menu.Item>
                {({ active }) => (
                  <button
                  onClick={handleSignOut}
                    className={`${
                      active ? 'bg-[#FF7171]/[0.7]  duration-300 ' : ''
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                  >
                    Sign Out
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    // </div>
  )
}

export default ProfileDropDown;
