"use client"
import axios from "axios";
import { setCookie } from "cookies-next";
import { redirect } from 'next/navigation'
import { useRouter } from "next/navigation";
import React, { useState } from "react"
import { FormEvent } from "react";
const url1 = `http://${process.env.NEXT_PUBLIC_HOST}:${process.env.NEXT_PUBLIC_PORT}/auth/login`;
const url2 = `http://${process.env.NEXT_PUBLIC_HOST}:${process.env.NEXT_PUBLIC_PORT}/auth/42`;
const url3 = `http://${process.env.NEXT_PUBLIC_HOST}:${process.env.NEXT_PUBLIC_PORT}/auth/google`;
const login = ({response}:any) => {
  
  const router = useRouter();
  const [invalidUsername, setInvalidUsername] = useState("")
  // const [empty, setEmpty] = useState("");
  
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent the default form submission behavior
    // console.log("====-======-===--->", url1);
    await axios.post(url1, {
      password,
      username,
    }).then(res => {
      if (res.data.message === "empty") {
        // setEmpty("Enter Username!");
        setInvalidUsername("Enter Username!");
        return;
      }
      else if (res.data.message === "notExists") {
        setInvalidUsername("Invalid Username or Password!");
        // setEmpty("");
        return;
      }
      setCookie("accessToken", res.data.token);
      if (res.data.user.twofactorenabled) {
        setCookie("accessToken", res.data.token);
        router.push("/login/2fa");
        return;
      }
      router.push("/home")
      return
    })
  };
  
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const link_42 = url2;
  const link_google = url3

  return (
    <div className=" grid place-items-center h-screen ">
      <div className=" bg-[#1B071C]/[0.8] min-w-[300px] overflow-auto h-[600px] w-[500px] rounded-2xl border-[#D16ACE] border">
      <form onSubmit={handleSubmit}  className=" text-center grid  place-content-center  font-semibold">
        <div className=" text-white text-center grid place-content-center  ">
          <div className="font-Glitch">
            <p className=" text-[45px] pt-10">Welcome Back</p>
          </div> 
            <div className="space-x-11 flex place-content-center mt-8">
              <a href={link_42} className=" shadow-2xl bg-[#472B4E] hover:bg-[#472B4E]/[0.8] transition-all duration-300 p-2 flex space-x-2 rounded-2xl hover:text-gray-100">
                <img className="" src="/42.svg" alt="42" width={20} height={20} />
                <p>Network</p>
              </a>
              <a href={link_google}  className=" shadow-2xl bg-[#A1216C] hover:bg-[#A1216C]/[0.8] transition-all duration-300 p-2 flex space-x-2 rounded-2xl hover:text-gray-100">
                <img src="/google.svg" alt="google" width={20} height={20} />
                <p>Google</p>
              </a>
            </div>
            <div className=" pt-10 divider">or</div>

            
            
            <input onChange={e => setUsername(e.target.value)} value={username} type="text" placeholder="Username" className="bg-[#1C0D16] border-transparent focus:border-transparent focus:ring-0 focus:outline-primary-pink-300  placeholder:text-[#837F7F] p-4 mt-10 sm:mx-0 mx-5 rounded-xl"/>
            {invalidUsername && <p className="text-red-500 text-xs pt-1 text-left">{invalidUsername}</p>}
            <input onChange={e => setPassword(e.target.value)} value={password} type="password" placeholder="Password" className="bg-[#1C0D16] border-transparent focus:border-transparent focus:ring-0 focus:outline-primary-pink-300  placeholder:text-[#837F7F] p-4 mt-4 sm:mx-0 mx-5 rounded-xl "/>
            
            
            {/* <a href="#" className=" hover:underline pt-2 text-[#EBA3EA] text-end font-normal text-sm">Forgot  Password?</a>Sing */}
            <button type="submit" className= " text-center text-xl bg-primary-pink-300 hover:bg-primary-pink-3000./[8] transition duration-300 hover:border font-Bomb mx-20 mt-10 p-2 rounded-2xl">log in</button>
            <p className=" font-normal text-xs mt-3">Don’t have an account? <a className=" hover:underline text-[#EBA3EA]" href="/signup">Sign up</a></p>
        </div>
      </form>
      </div>
    </div>
  )
}
export default login
