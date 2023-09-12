 import React from 'react'


interface GroupsStateprops {
    name: string;
    image: string;
    members: number;
    type: string;
}

const GroupInfos = ({name, image, members, type}: GroupsStateprops) => {
    return (
        <div className='rounded-xl max-w-[1200px] h-[130px] bg-[#670647] m-auto px-[3%] flex justify-between items-center mb-[20px]'>
           <div className='flex flex-start items-center'>
                <div className="w-[100px] h-[100px] rounded-xl overflow-hidden border-2 border-[#FF1382] mr-[1rem]">
                    <img
                        src={image}
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className='flex flex-col justify-center'>
                    <h3 className='text-[1.5rem] mr-0 p-0 font-Heading tracking-[1px]'>{name}</h3>
                    <div>
                        <span className='text-[1rem] text-[#837F7F] place-content-start font-bold'>{members} </span>
                        <span className='text-[1.1rem] text-[#837F7F] place-content-start font-Heading'>Members</span>
                    </div>
                </div>
           </div>
           <div className='flex'>
                <div className='w-[150px] mr-[20px] py-[5px] px-[20px] text-[1.1rem] bg-[#810851] rounded-[25px] font-Heading flex justify-center tracking-[1px]'>
                    <h6>{type}</h6>
                </div>
                <div>
                    <button className='py-[5px] px-[20px] text-[1.1rem] bg-[#532051] opacity-75 hover:opacity-100 rounded-[25px] font-Heading drop-shadow-[0_5px_5px_rgba(0,0,0,1)] tracking-[1px]'>
                        Join Groups
                    </button>
                </div>
           </div>
        </div>
    );
}

export default GroupInfos