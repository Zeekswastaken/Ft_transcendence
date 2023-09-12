 import React from 'react'


interface GroupsStateprops {
    name: string;
    image: string;
    members: number;
    type: string;
}

const GroupInfos = ({name, image, members, type}: GroupsStateprops) => {
    return (
        <div className='rounded-xl h-[100px] sm:h-[110px] bg-[#2F033180] px-[3%] sm:mx-10 flex justify-between items-center mb-[20px] min-w-[350px]'>
           <div className='flex space-x-2'>
                <div className="w-[80px] h-[80px] rounded-xl overflow-hidden border-2 border-[#FF1382]">
                    <img
                        src={image}
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className='flex flex-col justify-center'>
                    <h3 className=' text-[1rem] sm:text-[1.5rem] font-Heading tracking-wide w-24 sm:w-36 truncate'>{name}</h3>
                    <div>
                        <span className='text-[1rem] text-[#837F7F] place-content-start font-bold'>{members} </span>
                        <span className='text-[1.1rem] text-[#837F7F] place-content-start font-bold font-Heading mt-2'>Members</span>
                    </div>
                </div>
           </div>
           <div className='flex space-x-1 items-center'>
                <div className=' cursor-none text-[14px] w-20 mt-1 bg-[#810851] px-1 rounded-[25px] font-Heading flex justify-center tracking-[1px]'>
                    <h6>{type}</h6>
                </div>
                <div>
                    <button className=' text-[1rem] text-white bg-[#532051] px-2 opacity-75 hover:opacity-100 duration-300 rounded-[25px] font-Heading drop-shadow-[0_5px_5px_rgba(0,0,0,1)] tracking-[1px]'>
                        Join Group
                    </button>
                </div>
           </div>
        </div>
    );
}

export default GroupInfos