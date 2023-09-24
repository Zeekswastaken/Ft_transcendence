"use client"
import { useSocketContext } from '@/app/socket';
import { getCookie } from 'cookies-next';
import jwt,{ JwtPayload } from 'jsonwebtoken';
import { useRouter } from 'next/navigation';
import React, { MouseEvent, useEffect, useId, useState } from 'react'
import toast from 'react-hot-toast';
import { BeatLoader } from 'react-spinners';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';


interface GroupsStateprops {
    Name: string;
    Image: string;
    Members: number;
    Type: string;
    Password: string;
    Id: Number;
    Joined: boolean;
}

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '100%',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    // p: 4,
  };

const GroupInfos = ({Name, Image, Members, Type, Id, Joined}: GroupsStateprops) => {
    const [currentUserID, setCurrentUserID] = useState<number>()
    const token = getCookie("accessToken");
    useEffect(() => {
        try {
            const user = jwt.decode(token as string) as JwtPayload
            if (user) {
                setCurrentUserID(user.id)
          }
        } catch (error) {
            console.error('Error decoding token:');
        }
    }, [])
    const openModal = () => {
        // const modal = document.getElementById('my_modal_2') as HTMLDialogElement | null;
        setShowModal(true)
        // if (modal) {
            // modal.showModal();
        // }
    };
    const closeModal = () => {
        // const modal = document.getElementById('my_modal_2') as HTMLDialogElement | null;
        setShowModal(false)
        // if (modal) {
        //     modal.close();
        // }
    };
    const [channelPass, setChannelPass] = useState<string>("")
    const [loading, setLoading] = useState(false);
    const [isclicked, setIsclicked] = useState(false);
    const {socket} = useSocketContext()
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [id , setId ] = useState<Number>(0);
    const [done , setDone] = useState<boolean>(false)
    const [showModal , setShowModal] = useState(false);


    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleJoinChannel = (id:any) => {
        if (currentUserID !== undefined) {
            socket.emit("JoinChannel", {channelID: id, userID: currentUserID, Pass: channelPass})
            // setTimeout(() => {
            //     console.log("kakakakakakaka");
            // }, 500)
            setLoading(true);
            setIsclicked(!isclicked);
            socket.on("isjoined", (data:any) => {
                if (data) {
                    socket.emit("JoinRoom", {token: token});
                    setErrorMessage("")
                    setTimeout(() => {
                        setLoading(false);
                        // toast.success("Joined Succesfully")
                        toast("You Joined this Channel", {
                            style: {
                                borderRadius: '10px',
                                background: '#810851',
                                color: '#fff',
                                fontFamily: 'Heading',
                                fontSize: '1.2rem',
                            },
                            icon: '✅',
                        })
                    }, 1000);
                    // router.refresh()
                }
                else {
                    // setIsclicked(!isclicked)
                    setTimeout(() => {
                        setLoading(false);
                        // toast.success("Joined Succesfully")
                        toast("Wrong Password", {
                            style: {
                                borderRadius: '10px',
                                background: '#810851',
                                color: '#fff',
                                fontFamily: 'Heading',
                                fontSize: '1.2rem',
                            },
                            icon: '❌',
                        })
                    }, 1000);
                    // setLoading(false)
                    setErrorMessage("Wrong Password")
                }
                
            })
            
        }
        
    }
    const handleLeaveChannel = (e: MouseEvent<HTMLButtonElement>) => {
        // setLoading(false);
            if (currentUserID !== undefined)
                socket.emit("LeaveChannel", {channelID: Id, userID: currentUserID})
            
            setIsclicked(!isclicked);
            // toast.success("Left Succesfully");
            toast("You Left this Channel", {
                style: {
                    borderRadius: '10px',
                    background: '#810851',
                    color: '#fff',
                    fontFamily: 'Heading',
                    fontSize: '1.2rem',
                },
                icon: '👏',
            })
        }
        
        return (
        <div className='rounded-xl h-[100px]  sm:h-[110px] bg-[#2F033180] px-[3%] sm:mx-10 flex justify-between items-center mb-[20px] min-w-[350px]'>
           <div className='flex space-x-2'>
                <div className="w-[80px] h-[80px] rounded-xl overflow-hidden border-2 border-[#FF1382]">
                    <img
                        src={Image}
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className='flex flex-col justify-center'>
                    <h3 className=' text-[1rem] sm:text-[1.5rem] font-Bomb font-light tracking-wide w-24 sm:w-36 truncate'>{Name}</h3>
                    <div>
                        <span className='text-[1rem] text-[#837F7F] place-content-start font-bold'>{Members} </span>
                        <span className='text-[1.1rem] text-[#837F7F] place-content-start font-bold font-Heading mt-2'>Members</span>
                    </div>
                </div>
           </div>
           <div className='flex space-x-2 items-center'>
                <div className=' cursor-none text-[16px] w-20 mt-1 bg-[#810851] px-2 rounded-[25px] font-Heading flex justify-center tracking-[1px]'>
                    <h6>{Type}</h6>
                </div>
                <div>
                    { Type === "protected" ? (
                        <>
                            {!Joined ? (
                                !isclicked ? (
                                    <button onClick={handleOpen} className=' text-[1rem] text-white bg-[#532051] px-2 opacity-75 hover:opacity-100 duration-300 rounded-[25px] font-Heading drop-shadow-[0_5px_5px_rgba(0,0,0,1)] tracking-[1px]'>
                                        Join Group
                                    </button>
                                ) : (
                                    <button onClick={handleLeaveChannel} className=' text-[1rem] text-white bg-[#532051] px-2 opacity-75 hover:opacity-100 duration-300 rounded-[25px] font-Heading drop-shadow-[0_5px_5px_rgba(0,0,0,1)] tracking-[1px]'>
                                        {loading ? (<BeatLoader color="#ffff" size={10} />) : "Leave Group"}
                                    </button>
                                )
                            ) : (
                                !isclicked ? (
                                    <button onClick={handleLeaveChannel} className=' text-[1rem] text-white bg-[#532051] px-2 opacity-75 hover:opacity-100 duration-300 rounded-[25px] font-Heading drop-shadow-[0_5px_5px_rgba(0,0,0,1)] tracking-[1px]'>
                                        {loading ? (<BeatLoader color="#ffff" size={10} />) : "Leave Group"}
                                    </button> 

                                ) : (
                                    <button onClick={handleOpen} className=' text-[1rem] text-white bg-[#532051] px-2 opacity-75 hover:opacity-100 duration-300 rounded-[25px] font-Heading drop-shadow-[0_5px_5px_rgba(0,0,0,1)] tracking-[1px]'>
                                            Join Group
                                    </button>
                                )
                            )}
                                  <Modal
                                    open={open}
                                    onClose={handleClose}
                                    aria-labelledby="modal-modal-title"
                                    aria-describedby="modal-modal-description"
                                    className='flex items-center place-content-center'
                                >
                                    {/* <Box sx={style}> */}
                                    {/* <Typography id="modal-modal-title" variant="h6" component="h2">
                                        Text in a modal
                                    </Typography>
                                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                                        Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
                                    </Typography> */}
                                    <div className="modal-box content-center absolute bg-[#810851]/[0.9] space-y-5 grid place-items-center">
                                    <h3 className="font-Bomb text-2xl text-white text-center">Enter Channel Password!</h3>
                                    <input onChange={e => {setChannelPass(e.target.value)}} value={channelPass} type="text" className=" outline-none focus:outline bg-[#532051]  text-center placeholder:font-Bomb font-bold text-white h-14 px-10  w-full placeholder:text-white" placeholder="Password" />
                                    {!isclicked ? (

                                        <>
                                            <button onClick={(e) => handleJoinChannel(Id)} className="bg-[#FF1382] hover:bg-[#FF1382]/[0.8] duration-300 text-white font-Bomb text-xl tracking-wide px-14 h-10 rounded-xl">Join</button>
                                            {errorMessage && <p className="text-red-500 font-Bomb">{errorMessage}</p>}
                                        </>
                                    ) : (
                                        <button onClick={handleLeaveChannel} className="bg-[#FF1382] hover:bg-[#FF1382]/[0.8] duration-300 text-white font-Bomb text-xl tracking-wide px-14 h-10 rounded-xl">
                                            {loading ? (<BeatLoader color="#ffff" size={10} />) : "Leave Group"}
                                        </button>
                                    )}
                                </div>
                                    {/* </Box> */}
                                </Modal>
                            {/* {showModal ? (
                            <div className=' absolute right-[30%] top-[30%]'>
                                <div className="modal-box bg-[#810851]/[0.9] space-y-5 grid place-items-center">
                                    <h3 className="font-Bomb text-2xl text-center">Enter Channel Password! + {Id + ""}</h3>
                                    <input onChange={e => {setChannelPass(e.target.value)}} value={channelPass} type="text" className=" outline-none focus:outline bg-[#532051]  text-center placeholder:font-Bomb font-bold text-white h-14 px-10  w-full placeholder:text-white" placeholder="Password" />
                                    {!isclicked ? (
                                        <>
                                            <button onClick={(e) => handleJoinChannel(Id)} className="bg-[#FF1382] hover:bg-[#FF1382]/[0.8] duration-300 text-white font-Bomb text-xl tracking-wide px-14 h-10 rounded-xl">Join</button>
                                            {errorMessage && <p className="text-red-500 font-Bomb">{errorMessage}</p>}
                                        </>
                                    ) : (
                                        <button onClick={handleLeaveChannel} className="bg-[#FF1382] hover:bg-[#FF1382]/[0.8] duration-300 text-white font-Bomb text-xl tracking-wide px-14 h-10 rounded-xl">
                                            {loading ? (<BeatLoader color="#ffff" size={10} />) : "Leave Group"}
                                        </button>
                                    )}
                                </div>
                                <form method=""  className=" modal-backdrop">
                                    <button className=' w-full h-full' onClick={closeModal}>Close</button>
                                </form>
                            </div>

                            ) : ("")} */}
                        </>
                    ): (
                        !Joined ? (
                            !isclicked ? (
                            <button onClick={e => handleJoinChannel(Id)} className=' text-[1rem] text-white bg-[#532051] px-2 opacity-75 hover:opacity-100 duration-300 rounded-[25px] font-Heading drop-shadow-[0_5px_5px_rgba(0,0,0,1)] tracking-[1px]'>
                                    Join Group
                            </button> ) : 
                            (<button onClick={handleLeaveChannel} className=' text-[1rem] text-white bg-[#532051] px-2 opacity-75 hover:opacity-100 duration-300 rounded-[25px] font-Heading drop-shadow-[0_5px_5px_rgba(0,0,0,1)] tracking-[1px]'>
                                {loading ? (<BeatLoader color="#ffff" size={10} />) : "Leave Group"}
                            </button> )
                        ) : (
                            !isclicked ? (
                                <button onClick={handleLeaveChannel} className=' text-[1rem] text-white bg-[#532051] px-2 opacity-75 hover:opacity-100 duration-300 rounded-[25px] font-Heading drop-shadow-[0_5px_5px_rgba(0,0,0,1)] tracking-[1px]'>
                                    {loading ? (<BeatLoader color="#ffff" size={10} />) : "Leave Group"}
                                </button> 

                            ) : (
                                <button onClick={e => handleJoinChannel(Id)} className=' text-[1rem] text-white bg-[#532051] px-2 opacity-75 hover:opacity-100 duration-300 rounded-[25px] font-Heading drop-shadow-[0_5px_5px_rgba(0,0,0,1)] tracking-[1px]'>
                                        Join Group
                                </button>
                            )
                        )
                    )}
                </div>
           </div>
        </div>
    );
}

export default GroupInfos