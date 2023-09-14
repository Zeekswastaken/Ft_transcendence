 import React from 'react'


interface GroupsStateprops {
    Name: string;
    Image: string;
    Members: number;
    Type: string;
    Password: string;
}

const GroupInfos = ({Name, Image, Members, Type}: GroupsStateprops) => {
    const openModal = () => {
        const modal = document.getElementById('my_modal_2') as HTMLDialogElement | null;
        if (modal) {
          modal.showModal();
        }
      };
    
      const closeModal = () => {
        const modal = document.getElementById('my_modal_2') as HTMLDialogElement | null;
        if (modal) {
          modal.close();
        }
      };
    
    return (
        <div className='rounded-xl h-[100px] sm:h-[110px] bg-[#2F033180] px-[3%] sm:mx-10 flex justify-between items-center mb-[20px] min-w-[350px]'>
           <div className='flex space-x-2'>
                <div className="w-[80px] h-[80px] rounded-xl overflow-hidden border-2 border-[#FF1382]">
                    <img
                        src={Image}
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className='flex flex-col justify-center'>
                    <h3 className=' text-[1rem] sm:text-[1.5rem] font-Heading tracking-wide w-24 sm:w-36 truncate'>{Name}</h3>
                    <div>
                        <span className='text-[1rem] text-[#837F7F] place-content-start font-bold'>{Members} </span>
                        <span className='text-[1.1rem] text-[#837F7F] place-content-start font-bold font-Heading mt-2'>Members</span>
                    </div>
                </div>
           </div>
           <div className='flex space-x-2 items-center'>
                <div className=' cursor-none text-[14px] w-20 mt-1 bg-[#810851] px-1 rounded-[25px] font-Heading flex justify-center tracking-[1px]'>
                    <h6>{Type}</h6>
                </div>
                <div>
                    { Type === "protected" ? (
                        <>
                            <button onClick={openModal} className=' text-[1rem] text-white bg-[#532051] px-2 opacity-75 hover:opacity-100 duration-300 rounded-[25px] font-Heading drop-shadow-[0_5px_5px_rgba(0,0,0,1)] tracking-[1px]'>
                                Join Group
                            </button>
                            <dialog id="my_modal_2" className="modal">
                                <div className="modal-box bg-[#810851] space-y-5 grid place-items-center">
                                    <h3 className="font-Bomb text-2xl text-center">Enter Channel Password!</h3>
                                    <input type="text" className=" outline-none focus:outline bg-[#532051] placeholder:text-center text-center h-14 px-10  w-full placeholder:text-white" placeholder="Password" />
                                    <button className="bg-[#FF1382] hover:bg-[#FF1382]/[0.8] duration-300 text-white font-Bomb text-xl tracking-wide px-14 h-10 rounded-xl">Join</button>
                                    {/* <p className="py-4">Press ESC key or click outside to close</p> */}
                                </div>
                                <form method="dialog" className="modal-backdrop">
                                    <button onClick={closeModal}>Close</button>
                                </form>
                            </dialog>
                        </>
                    ): (
                        <button className=' text-[1rem] text-white bg-[#532051] px-2 opacity-75 hover:opacity-100 duration-300 rounded-[25px] font-Heading drop-shadow-[0_5px_5px_rgba(0,0,0,1)] tracking-[1px]'>
                                Join Group
                        </button>
                    )}
                </div>
           </div>
        </div>
    );
}

export default GroupInfos