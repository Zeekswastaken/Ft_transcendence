
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
                    ? <button className='bg-[#FF1382] border-1 text-white px-1 sm:px-4 rounded-xl pt-3 pb-2 border font-bold font-Bomb tracking-[1px]'>{name}</button>
                    : <button onClick={onClick} className=' bg-[#A1216C] hover:bg-[#A1216C]/[0.8] duration-300 text-white px-1 sm:px-4 pt-3 pb-2 rounded-xl font-bold font-Bomb tracking-[2px]'>{name}</button> }
        </div>
    );
}

export default GroupButton;