"use client"
import React, { useRef, useState } from 'react'

const CreatGroup = () =>
{
    const [path, setPath] = useState("/Spectate.png");
    const avatar = useRef<File | undefined>(undefined);
    
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        avatar.current = e.target.files[0];
        try {
          const imagePath = URL.createObjectURL(avatar.current);
          setPath(imagePath);
        } catch (error) {
          console.error('Error creating URL:', error);
        }
      }
    }
    return (
        <div className='rounded-xl bg-[#670647] items-center place-content-center mt-20 px-5 sm:px-[3rem] py-[3rem] mb-[100px]'>
            <div className=' grid grid-cols-1 lg:grid-cols-2 gap-5'>
                <div className=' cursor-not-allowed w-full h-[90px] bg-[#2E0231B2] rounded-xl flex items-center px-5 drop-shadow-lg'>
                    <div className=' w-[70px] h-[70px] rounded-full border-[5px] border-primary-pink-200 '>
                        <img src="https://placekitten.com/g/200/200" className=' rounded-full w-full h-full' alt="" />
                    </div>
                    <div className=' flex-col'>
                        <p className=' px-3 font-Heading text-white text-xl tracking-wide'>Fouamep</p>
                        <p className=' px-3 font-Heading text-lg tracking-wide text-[#b7b7b7]'>Group Owner</p>
                    </div>
                </div>
                <input placeholder='Group Name' className=' font-Heading w-full h-[90px] bg-[#2E0231E5] rounded-xl drop-shadow-[2px_3px_0_rgba(0,0,00.15)] outline-none focus:outline focus:outline-primary-pink-300 px-3 text-gray-300'/>
                <div className=' order-4 flex items-center font-bold w-full h-[190px] bg-[#2E0231E5] rounded-xl drop-shadow-[2px_3px_0_rgba(0,0,00.15)] outline-none focus:outline focus:outline-primary-pink-300 text-white'>
                    <div className=' px-5 py-4 h-full w-[260px] rounded-xl'>
                        <img src={path} className=' rounded-xl py-1 h-full w-full ' alt="" />
                    </div>
                    <input onChange={handleImageChange} id='file' accept="image/*" type="file" placeholder='Group Cover' className=' pt-16 z-50 w-full h-full' />
                    {/* <p className=' absolute px-20 font-Heading text-lg tracking-wide text-[#ffff]'>Group Owner</p> */}
                </div>
                <div className=' w-full h-[90px] bg-[#2E0231E5] rounded-xl drop-shadow-[2px_3px_0_rgba(0,0,00.15)]'>
                    <select defaultValue="Privacy"  name="Privacy" autoComplete="off" className="shadow-base font-Heading tracking-widest text-2xl border-transparent focus:ring-0 focus:border-transparent rounded-2xl placeholder:text-[#B1B1B1] placeholder:font-bold placeholder:text-2xl bg-[#2E0231E5] w-full h-full ">
                      <option className=' text-xl' disabled value="Privacy">Privacy</option>
                      <option className=' text-xl' value="Public">Public</option>
                      <option className=' text-xl' value="Protected">Protected</option>
                      <option className=' text-xl' value="Private">Private</option>
                    </select>
                </div>
            </div>
            <div className='flex space-x-3'>
                <button className=' mt-10 px-4 text-white font-Bomb pt-1 rounded-lg duration-300 hover:text-primary-pink-300 '>Cancel</button>
                <button className=' mt-10 px-4 text-white font-Bomb pt-1 rounded-lg hover:bg-primary-pink-300/[0.8] duration-300 bg-primary-pink-300'>Submit</button>
            </div>
        </div>
    );
}

export default CreatGroup;