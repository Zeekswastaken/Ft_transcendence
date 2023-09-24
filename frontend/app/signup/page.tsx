"use client"
import React, { useEffect, useState, FormEvent } from "react"
import { useRouter } from "next/navigation";
// import { FormEvent } from "react";
import axios from "axios";
import Cookies from 'js-cookie'
import { setCookie } from 'cookies-next';
const url = `http://${process.env.NEXT_PUBLIC_HOST}:${process.env.NEXT_PUBLIC_PORT}/auth/signup`;
const url2 = `http://${process.env.NEXT_PUBLIC_HOST}:${process.env.NEXT_PUBLIC_PORT}/auth/42`;
const url3 = `http://${process.env.NEXT_PUBLIC_HOST}:${process.env.NEXT_PUBLIC_PORT}/auth/google`;

const signup = () => {
  
  
  const router = useRouter();
  
  const [passwordError, setPasswordError] = useState('');
  const [passNotMatch, setPassNotMatch] = useState('');
  const [userNotFound, setUserNotFound] = useState('');
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const usernameRegex = /^[A-Za-z0-9_-]+$/;
    const isValidUsername = usernameRegex.test(username);
    if (!isValidUsername || username.length > 10) {
      setUserNotFound("Invalid Username, please try again!");
    }
    else {
      await axios.post(url, {
          username,
          password,
          repassword
        })
        .then((res) => {
          if (res.data.message === "empty" || res.data.message === "exists") {
            setUserNotFound("Invalid Username, please try again!");
            setPassNotMatch("");
            setPasswordError("");
            return ;
          }
          else if (res.data.message === "weak") {
            setPasswordError("Your Password not Strong enough, Please try again.");
            setUserNotFound("");
            setPassNotMatch("");
            return ;
          }
          else if (res.data.message === 'notMatch') {
            setPassNotMatch("Passwords do not match.");
            setPasswordError("");
            setUserNotFound("");
            return;
          }
          setCookie("accessToken", res.data);
          router.push("/signup/complete-profile")
        }).catch(err => {console.log(err)})
    }
  }
  
  const link_42 = url2;
  const link_google = url3
  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setRePassword] = useState("");
  return (
    <div className="grid place-items-center h-screen ">
      <div className=" bg-[#1B071C]/[0.8] min-w-[300px] overflow-auto h-[600px] w-[500px] rounded-2xl border-[#D16ACE] border">
      <form onSubmit={handleSubmit} className=" text-center grid  place-content-center  font-semibold">
        <div className=" text-white text-center grid place-content-center  ">
          <div className="font-Glitch">
            <p className=" text-[45px] pt-6">Get in the Game</p>
          </div> 
            <div className="space-x-11 flex place-content-center mt-4">
              <a href={link_42} className=" shadow-2xl bg-[#472B4E] hover:bg-[#472B4E]/[0.8] transition-all duration-300 p-2 flex space-x-2 rounded-2xl hover:text-gray-100">
                <img className="" src="/42.svg" alt="42" width={20} height={20} />
                <p>Network</p>
              </a>
              <a href={link_google} className=" shadow-2xl bg-[#A1216C] hover:bg-[#A1216C]/[0.8] transition-all duration-300 p-2 flex space-x-2 rounded-2xl hover:text-gray-100">
                <img src="/google.svg" alt="google" width={20} height={20} />
                <p>Google</p>
              </a>
            </div>
            <div className=" pt-6 divider">or</div>
            
            <input onChange={e => setUsername(e.target.value)} value={username} type="text" placeholder="Username" className="bg-[#1C0D16] px-6 border-transparent focus:border-transparent focus:ring-0 focus:outline-primary-pink-300  placeholder:text-[#837F7F] p-4 mt-7 sm:mx-0 mx-5 rounded-xl "/>
            {userNotFound && <p className="text-red-500 text-xs pt-1 text-left">{userNotFound}</p>}

            <input onChange={e => setPassword(e.target.value)} id="password" value={password} type="password" placeholder="Password" className="bg-[#1C0D16] px-6 border-transparent focus:border-transparent focus:ring-0 focus:outline-primary-pink-300  placeholder:text-[#837F7F] p-4 mt-3 sm:mx-0 mx-20 rounded-xl peer ... "/>
            {passwordError && <p className="text-red-500 text-xs pt-1 text-left">{passwordError}</p>}

            <input onChange={e => setRePassword(e.target.value)} value={repassword} type="password" placeholder="Re-Password" className="bg-[#1C0D16] px-6 border-transparent focus:border-transparent focus:ring-0 focus:outline-primary-pink-300  placeholder:text-[#837F7F] p-4 mt-3 sm:mx-0 mx-20 rounded-xl"/>
            {passNotMatch && <p className="text-red-500 text-xs pt-1 text-left">{passNotMatch}</p>}
            
            {/* <a href="#" className=" hover:underline pt-2 text-[#EBA3EA] text-end font-normal text-sm">Forgot  Password?</a> */}
            <button type="submit" className= " bg-primary-pink-300 hover:bg-primary-pink-300/[0.8] transition duration-300 hover:border font-Bomb mx-20 mt-6 p-2 rounded-2xl text-center text-xl">
              sign up
            </button>
            <p className=" font-normal text-xs mt-2">Already have an account? <a className=" hover:underline text-[#EBA3EA]" href="/login">Log In</a></p>
        </div>
      </form>
      </div>

    </div>
)
}
export default signup