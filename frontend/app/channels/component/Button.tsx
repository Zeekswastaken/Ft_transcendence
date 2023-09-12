
import React from 'react'

interface ButtonStateProps {
    name: string;
    bt_state: boolean;
    onClick: () => void
}

const GroupButton = ({name, bt_state, onClick}: ButtonStateProps) => {
    return (
        <div>
            {bt_state
                    ? <button className='bg-[#FF1382] border-1 text-white py-2 px-4 rounded-xl text-[24px] font-bold font-Bomb tracking-[2px]'>{name}</button>
                    : <button onClick={onClick} className=' bg-[#A1216C] text-white py-2 px-4  rounded-xl text-[24px] font-bold font-Bomb tracking-[2px]'>{name}</button> }
        </div>
    );
}

export default GroupButton;