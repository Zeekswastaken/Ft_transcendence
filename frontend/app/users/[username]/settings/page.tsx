"use client"
import axios from "axios";
import { getCookie, setCookie } from "cookies-next";
import React, { FormEvent, MouseEvent, MouseEventHandler, use, useEffect, useState } from "react";
import jwt, { JwtPayload } from "jsonwebtoken";
import { useRouter } from "next/navigation";
import { useUserDataContext } from "@/app/userDataProvider";
import Link from "next/link";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";


interface Props {
  label: string;
  exContent: string;
  type: string;
}


const Settings = () => {
  
  
  const [user, setUser] = useState<JwtPayload>()
  const router = useRouter();
  const token = getCookie("accessToken");
  const [invalidUsername, setInvalidUsername] = useState("");
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    try {
      const user = jwt.decode(token as string) as JwtPayload
      if (user)
      setUser(user)
      setIsEnable(user?.twofactorenabled)
    // setCurrentUsername(jwt.decode(token).username);
  } catch (error) {
    console.error('Error decoding token:');
  }
}, [])

  // const handleCancel = (e: MouseEvent<HTMLButtonElement>) => {
  //   e.preventDefault()
  //   router.push(`/users/${user?.username}`)
  // }

  // const userNameTmp = use

  const handleApply = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // useEffect(() => {
      let pr:boolean | null
      if (privacy === "Private")
        pr = false
      else if (privacy === "Public")
        pr = true
      else
        pr = null
      await axios.put(`http://10.14.2.7:3000/profile/update/${user?.id}`, {
        privacy: pr,
        username: username,
        password: password,
        Bio: bio,
        twofactorenabled: isEnable
      }).then(res => {
        if (res.data.message === "error") {
          return ;
        }
        else if (res.data.message === "weak"){
          setPasswordError("Your Password not Strong enough, Please try again.");
          setInvalidUsername("");
          return;
        }
        else if (res.data.message === "exists") {
          setInvalidUsername("Invalid Username, please try again!");
          setPasswordError("");
          return
        }
        else if (res.data.message === "success") {
          setCookie("accessToken", res.data.token);
          
          if (username) {
            router.push(`/users/${username}`);
          }
          else
            router.push(`/users/${user?.username}`)
        }
    }).catch(res => {console.log(res)});
  }
  const [canSee, setCanSee] = useState<boolean>(false)
  const [inputType, setInputType] = useState("password");
  const handleEyeclicked = (e: MouseEvent<HTMLButtonElement>) => {
    setCanSee(!canSee)
    if(!canSee)
      setInputType("text");
    else
      setInputType("password");

  }

  const [privacy, setPrivacy] = useState("");
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [isEnable, setIsEnable] = useState<boolean | undefined>(undefined)
  const userData = useUserDataContext()?.user;

  console.log("2fa = ", isEnable)
  const handle2fa = (e: MouseEvent<HTMLInputElement>) => {
    setIsEnable(!isEnable)
  }

  return (
    <div className=" border-2 mt-10 border-primary-pink-300 rounded-[20px]">
      <div className="   glass w-full h-auto ">
        <div className=" flex place-content-center">
          <div className="  w-[78%] h-auto pb-20">
            <div className=" overflow-hidden whitespace-wrap">
              <h1 className=" pt-12 text-white font-Bomb text-4xl">
                Account Settings
              </h1>
            </div>
            <div className="bg-[#2F0331] w-full grid grid-cols-1  2xl:grid-cols-3 mt-3 rounded-2xl opacity-90 border border-primary-pink-300">
              <div className=" 2xl:pt-16 pt-5 px-10 w-full">
                <div className=" animate-fade-left animate-delay-100 flex place-content-center mt-0">
                  <label
                    htmlFor="uploadImage"
                    className="cursor-pointer flex relative place-content-center"
                  >
                    <img
                      src="/profileEx.png"
                      alt="profile"
                      width={130}
                      height={130}
                    />
                    <img
                      className=" absolute mt-[58px]"
                      src="/camera.svg"
                      alt="icon"
                      width={25}
                      height={20}
                    />
                  </label>
                  <input
                    className="hidden"
                    id="uploadImage"
                    accept="image/*"
                    type="file"
                    name="avatar"
                  />
                </div>
                <div className=" animate-fade-left animate-delay-300 mt-5 w-full">
                  <div className="mt-4">
                    <label
                        htmlFor="Bio"
                        className=" text-xl tracking-wide font-Heading text-[#D4D4D4] "
                      >
                        Bio
                    </label>
                    <textarea
                      onChange={e => setBio(e.target.value)}
                      rows={3}
                      name="comment"
                      id="comment"
                      className="shadow-sm no-scrollbar border-transparent focus:ring-0 focus:border-transparent font-bold resize-none text-[#D4D4D4] block w-full sm:text-sm bg-[#562257] rounded-md"
                      defaultValue={""}
                    />
                  </div>
                </div>
              </div>
              <div className="  p-12 grid col-span-2 space-y-4">
                {/* <Inputs label="Username" exContent="Fouamep" type="text" /> */}
                <div className=" animate-fade-left animate-delay-200">
                  <label
                      htmlFor="Username"
                      className=" text-xl tracking-wide font-Heading text-[#D4D4D4] "
                    >
                      Username
                  </label>
                  <div className=" mt-1">
                    <input onChange={e => setUserName(e.target.value)} value={username} type="text" name="text" autoComplete="off" className=" font-Heading tracking-widest bg-[#562257] w-full h-[50px] sm:text-sm border-transparent focus:ring-0 focus:border-transparent rounded-2xl placeholder:text-[#B1B1B1] placeholder:font-bold placeholder:text-base" placeholder={userData?.username} />
                    {invalidUsername && <p className="text-red-500 text-xs pt-1 text-left">{invalidUsername}</p>}
                  </div>
                </div>

                <div className="animate-fade-left animate-delay-[300ms]">
                  <label
                      htmlFor="Privacy"
                      className=" text-xl tracking-wide font-Heading text-[#D4D4D4] "
                    >
                      Privacy
                  </label>
                  <div className=" mt-1">
                    <select onChange={e => setPrivacy(e.target.value)}  defaultValue="Privacy"  name="Privacy" autoComplete="off" className="shadow-base font-Heading tracking-widest bg-[#562257] sm:text-sm border-transparent focus:ring-0 focus:border-transparent rounded-2xl placeholder:text-[#B1B1B1] placeholder:font-bold placeholder:text-base w-full h-[50px] ">
                      <option className=" text-[#562257]" disabled value="Privacy">Privacy</option>
                      <option value="Public">Public</option>
                      <option value="Private">Private</option>
                    </select>
                  </div>
                </div>
                <div className=" animate-fade-left animate-delay-[400ms]">
                  <label
                    htmlFor="Password"
                    className=" text-xl tracking-wide font-Heading text-[#D4D4D4] "
                    >
                      Password
                  </label>
                  <div className=" mt-1">
                    <div className=" flex place-content-end items-center">
                      <button onClick={handleEyeclicked} className=" absolute px-4">
                        {canSee ? (
                          <EyeSlashIcon className=" w-6 h-6"/>
                        ) : (
                          <EyeIcon className=" w-6 h-6 "/>
                        )}
                      </button>
                      <input onChange={e => setPassword(e.target.value)} value={password} type={inputType} name="password" autoComplete="off" className=" font-Heading tracking-wider border-transparent focus:ring-0 focus:border-transparent bg-[#562257] w-full h-[50px] sm:text-sm  rounded-2xl placeholder:text-[#B1B1B1] placeholder:font-bold placeholder:text-base" />
                    </div>
                    {passwordError && <p className="text-red-500 text-xs pt-1 text-left">{passwordError}</p>}
                  </div>
                </div>
                <label
                    htmlFor=""
                    className=" text-lg tracking-wide font-Heading text-[#D4D4D4] "
                    >
                      <span className=" font-Bomb text-xl">2</span>FA
                  </label>
                <div className=" items-center flex ">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input onClick={handle2fa} type="checkbox" value="" className="sr-only peer" checked={isEnable}/>
                    <div className="w-14 h-7 bg-gray-200  rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-green-400"></div>
                    <span className="ml-3 text-base text-white font-Bomb pt-1 dark:text-gray-300">{isEnable ? ("Disable 2FA") : ("Enable 2FA")}</span>
                  </label>
                </div>
              </div>
              <div className="animate-fade-left animate-delay-[500ms] flex space-x-5 my-5 place-content-center items-center">
                  {/* <button onClick={handleCancel} className=" text-white font-Heading text-xl tracking-wide hover:text-primary-pink-300 duration-300">Cancel</button> */}
                  <Link href={`/users/${user?.username}`} className=" text-white font-Heading text-xl tracking-wide hover:text-primary-pink-300 duration-300">Cancel</Link>
                  <div className=" border-2 rounded-xl hover:bg-primary-pink-300 duration-300  border-primary-pink-300 ">
                    <button onClick={handleApply} className=" py-1 px-2 text-white font-Heading text-xl tracking-wide duration-300">Apply</button>
                  </div>
              </div>
                {/* <div className=" place-content-center items-center flex">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input onClick={handle2fa} type="checkbox" value="" className="sr-only peer" checked={user?.twofactorenabled || isEnable}/>
                    <div className="w-14 h-7 bg-gray-200  rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-green-400"></div>
                    <span className="ml-3 text-base text-white font-Bomb pt-1 dark:text-gray-300">Enable 2FA</span>
                  </label>
                </div> */}
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
