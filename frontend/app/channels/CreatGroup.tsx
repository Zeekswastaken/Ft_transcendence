"use client"
import React from 'react'

const CreatGroup = () =>
{
    return (
        <div className='rounded-xl h-[700px] bg-[#A1216C] px-[3rem] py-[3rem] mb-[100px]'>
            <form action="">
                <div className='my-[3rem] h-[500px] max-w-[1200px] m-auto grid grid-cols-2 gap-10'>
                    <div className='bg-[#411742] rounded-[30px] drop-shadow-[0_10px_10px_rgba(0,0,0,1)] flex py-[.5rem] px-[2rem]  items-center'>
                        <div className='w-[80px] h-[80px] rounded-full overflow-hidden border-2 border-[#FF1382] mr-[1rem]'>
                            <img src="https://placekitten.com/g/200/200" className="w-full h-full object-cover"/>
                        </div>
                        <div>
                            <h3 className='font-Heading text-[1.8rem]'>Hazaouya</h3>
                            <h6 className='font-Heading text-[1.2rem] text-gray-400 tracking-[1px]'>Group Owner</h6>
                        </div>
                    </div>
                    <div className='bg-[#411742] rounded-[30px] drop-shadow-[0_10px_10px_rgba(0,0,0,1)] py-[1rem] px-[2rem]'>
                        <input
                            className="hidden"
                            id="uploadImage"
                            accept="image/*"
                            type="file"
                            name="avatar"
                        /> 
                    </div>
                    <div className='bg-[#411742] rounded-[30px] drop-shadow-[0_10px_10px_rgba(0,0,0,1)] py-[1rem] px-[2rem]'>
                        <input className='h-[60px] w-full bg-transparent p-[0]' placeholder='Group Name'/>
                    </div>
                    <div className='bg-[#411742] rounded-[30px] drop-shadow-[0_10px_10px_rgba(0,0,0,1)] py-[1rem] px-[2rem]'>
                        <input className='h-[60px] w-full bg-transparent p-[0]' placeholder='Invite Friends'/>
                    </div>
                    <div className='bg-[#411742] rounded-[30px] drop-shadow-[0_10px_10px_rgba(0,0,0,1)] py-[1rem] px-[2rem]'>
                        <input className='h-[60px] w-full bg-transparent p-[0]' placeholder='Choose Privacy'/>
                    </div>
                    <div className='bg-[#411742] rounded-[30px] drop-shadow-[0_10px_10px_rgba(0,0,0,1)] row-span-2 py-[1rem] px-[2rem]' >
                        <textarea className='h-full w-full bg-transparent resize-none ' placeholder='Bio'>

                        </textarea>
                    </div>
                    <div className='bg-[#411742] rounded-[30px] drop-shadow-[0_10px_10px_rgba(0,0,0,1)] py-[1rem] px-[2rem]'>
                        <input className='h-[60px] w-full bg-transparent p-[0]' placeholder='Set Admin'/>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default CreatGroup;