"use client"
import React, { FormEvent, useEffect, useState } from 'react'
import axios from 'axios'
import { deleteCookie, getCookie, setCookie } from "cookies-next";
import jwt, { JwtPayload } from "jsonwebtoken";
import { useRouter } from "next/navigation";
const url = `http://${process.env.NEXT_PUBLIC_HOST}:${process.env.NEXT_PUBLIC_PORT}/auth/verify`;
const url2 = `http://${process.env.NEXT_PUBLIC_HOST}:${process.env.NEXT_PUBLIC_PORT}/auth/qr-code`;


const page = () => {

  // qr-code
  const [currentUserID, setCurrentUserID] = useState<Number>();
  const [QRcodeUrl, setQRcodeUrl] = useState("");
  const [QRCode, setQRCode] = useState("");
  const token = getCookie("accessToken");
  const [unValidCode, setUnvalidCode] = useState(false)
  const router = useRouter();

  const handleSubmit =  (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
     if (currentUserID != 0) {
      axios.post(url, {
         QRCode,
         currentUserID
       }).then(res => {
         if (res.data.isValid) {
           setCookie("accessToken", res.data.token)
           router.push(`/home`);
          }
          else
          setUnvalidCode(true);
        
      }).catch(err => console.log(err));
    }
  }
  useEffect(() => {
    try {
      const user = jwt.decode(token as string) as JwtPayload
      if (user) {
        setCurrentUserID(user.id)
        deleteCookie("accessToken");
      }
    } catch (error) {
      console.error('Error decoding token:');
    }
  }, [])
  useEffect(() => {
    if (currentUserID != 0) {
      axios.post(url2, {
        currentUserID,
      }).then(res => {
        // if (res.data.qrCodeUri)
        // console.log("res = ", res.data); 
        setQRcodeUrl(res.data.qrCodeUri)
      }).catch(err => console.log(err))
    }
  },[currentUserID])
  return (
    <div className=" grid place-items-center h-screen ">
      <div className=" bg-[#1B071C]/[0.8] min-w-[300px] overflow-auto h-[600px] w-[500px] rounded-2xl border-[#D16ACE] border">
      {/* <form className=" text-center grid items-center place-content-center  font-semibold"> */}
        <div className=" text-white text-center grid place-content-center  ">
          <p className="font-Glitch text-[30px] pt-10">account verification</p>
          <div className=' flex place-content-center items-center'>
            {/* <div className='  h-[200px] w-[200px] my-10 bg-slate-300'/> */}
            <img src={QRcodeUrl} height={150} width={150} className=' h-[200px] w-[200px] my-10 ' alt="" />
          </div>
          <div className=' grid items-center'>
            <form className=' grid' onSubmit={handleSubmit}>
              <input onChange={e => setQRCode(e.target.value)} value={QRCode} type="text" placeholder="Enter Code" className="bg-[#1C0D16] border-transparent focus:border-transparent focus:ring-0 focus:outline-primary-pink-300  placeholder:text-[#837F7F] p-4 mt-4 sm:mx-0 mx-5 rounded-xl "/>
              {unValidCode && <p className="text-red-500 text-xs pt-1 text-left">Invalid Code</p>}
              <button type="submit" className= " text-center text-xl bg-primary-pink-300 hover:bg-primary-pink-3000./[8] transition duration-300 hover:border font-Bomb mx-20 mt-10 p-2 rounded-2xl tracking-wider">Submit</button>
            </form>
          </div>
        </div>
      {/* </form> */}
      </div>
    </div>  )
}

export default page