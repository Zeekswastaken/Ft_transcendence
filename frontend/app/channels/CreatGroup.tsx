"use client"
import { useRouter } from 'next/navigation';
import React, { MouseEvent, useEffect, useRef, useState } from 'react'
import { useGroupStore } from './page';
import { useSocketContext } from '../socket';
import { getCookie } from 'cookies-next';
import jwt,{ JwtPayload } from 'jsonwebtoken';
import axios, { HttpStatusCode } from 'axios';
const url = `http://${process.env.NEXT_PUBLIC_HOST}:${process.env.NEXT_PUBLIC_PORT}/channel/createChannel`;
const CreatGroup = () =>
{
    const [path, setPath] = useState("/Spectate.png");
    const avatar = useRef<File | undefined>(undefined);
    const [privacy, setPrivacy] = useState("");
    const [password, setPassword] = useState("");
    const [channelName, setChannelName] = useState("");
    const [currentUserID, setCurrentUserID] = useState<Number>();
    const {socket} = useSocketContext();
    const [ownerName, setOwnerName] = useState("")
    const [ownerAvatar, setOwnerAvatar] = useState("")
    const token = getCookie("accessToken");
    useEffect(() => {
        try {
            const user = jwt.decode(token as string) as JwtPayload
            if (user) {
                setCurrentUserID(user.id)
                setOwnerName(user.username);
                setOwnerAvatar(user.avatar_url);
          }
        } catch (error) {
            console.error('Error decoding token:');
        }
    }, [])

    const [canSubmit, setCanSubmit] = useState(false);
    useEffect(() => {
        if (channelName && privacy) {
            if (privacy == "protected" && !password)
            setCanSubmit(false)
        else    
        setCanSubmit(true)
    }
    else
    setCanSubmit(false)
    }, [channelName, privacy, password])
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
    const router = useRouter();
    const {group, setGroup} = useGroupStore()
    const handleSubmit = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const formData = new FormData();
        // formData.append('avatar', avatar.current as any); // Assuming 'avatar' is the field name expected by FileInterceptor
        formData.append('file', avatar.current as any)
        formData.append('userid', currentUserID as any);
        formData.append('name', channelName);
        formData.append('type', privacy);
        formData.append('password', password);
        
        // formData.forEach((value, key) => {
        //     console.log(`${key}: ${value}`);
        // });
        axios.post(url, formData)
        .then(res => {
            if (res.status == HttpStatusCode.Created)
            setGroup(!group)
        }).catch(err => {console.log(err)})
    }
    const handleCancel = (e: MouseEvent<HTMLButtonElement>) => {
        setGroup(!group);
    }
    
    return (
        <div className='rounded-xl bg-[#670647]/[0.4] items-center place-content-center mt-20 px-5 sm:px-[3rem] py-[3rem] mb-[100px]'>
            <form  encType="multipart/form-data">
                <div className=' grid grid-cols-1 lg:grid-cols-2 gap-5'>
                    <div className=' cursor-not-allowed w-full h-[90px] bg-[#2E0231B2] rounded-xl flex items-center px-5 drop-shadow-lg'>
                        <div className=' w-[70px] h-[70px] rounded-full border-[5px] border-primary-pink-200 '>
                            <img src={ownerAvatar} className=' rounded-full w-full h-full' alt="" />
                        </div>
                        <div className=' flex-col'>
                            <p className=' px-3 font-Heading text-white text-xl tracking-wide'>{ownerName}</p>
                            <p className=' px-3 font-Heading text-lg tracking-wide text-[#b7b7b7]'>Group Owner</p>
                        </div>
                    </div>
                    <input onChange={e => {setChannelName(e.target.value)}} value={channelName} placeholder='Channel Name' className=' font-bold placeholder:font-Heading w-full h-[90px] bg-[#2E0231E5] rounded-xl drop-shadow-[2px_3px_0_rgba(0,0,00.15)] outline-none focus:outline focus:outline-primary-pink-300 px-3 text-gray-300'/>
                    <div className=' order-4 flex items-center font-bold w-full h-[150px] bg-[#2E0231E5] rounded-xl drop-shadow-[2px_3px_0_rgba(0,0,00.15)] outline-none focus:outline focus:outline-primary-pink-300 text-white'>
                        <div className=' px-5 py-4 h-full w-[220px] rounded-xl'>
                            <img src={path} className=' rounded-xl py-1 h-full w-full ' alt="" />
                        </div>
                        <input onChange={handleImageChange} id='file' accept="image/*" type="file" placeholder='Group Cover' className=' pt-12 z-50 w-full h-full' />
                        {/* <p className=' absolute px-20 font-Heading text-lg tracking-wide text-[#ffff]'>Group Owner</p> */}
                    </div>
                    <div className=' w-full h-[90px] bg-[#2E0231E5] rounded-xl drop-shadow-[2px_3px_0_rgba(0,0,00.15)]'>
                        <select onChange={e => setPrivacy(e.target.value)} defaultValue="Privacy"  name="Privacy" autoComplete="off" className="shadow-base font-Heading tracking-widest text-2xl border-transparent focus:ring-0 focus:border-transparent rounded-2xl placeholder:text-[#B1B1B1] placeholder:font-bold placeholder:text-2xl bg-[#2E0231E5] w-full h-full ">
                        <option className=' text-xl' disabled value="Privacy">Privacy</option>
                        <option className=' text-xl' value="public">Public</option>
                        <option className=' text-xl' value="protected">Protected</option>
                        <option className=' text-xl' value="private">Private</option>
                        </select>
                    </div>
                    <input
                        disabled={privacy !== "protected"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={privacy !== "protected" ? 'Channel Password' : 'Set Password'}
                        className={` placeholder:font-Heading font-bold w-full h-[90px] bg-[#2E0231E5] rounded-xl drop-shadow-[2px_3px_0_rgba(0,0,0,0.15)] outline-none focus:outline focus:outline-primary-pink-300 px-3 text-gray-300` + (privacy !== "protected" ? ' cursor-not-allowed' : '')}
                        />
                </div>
            </form>
            <div className='flex space-x-3'>
                <button onClick={handleCancel} className=' mt-10 px-4 text-white font-Bomb pt-1 rounded-lg duration-300 hover:text-primary-pink-300 '>Cancel</button>
                {canSubmit ? (
                    <button onClick={handleSubmit} className=' mt-10 px-4 text-white font-Bomb pt-1 rounded-lg hover:bg-primary-pink-300/[0.8] duration-300 bg-primary-pink-300'>Submit</button>
                ) : (
                    <button className=' mt-10 px-4 text-white font-Bomb pt-1 rounded-lg duration-300 bg-gray-600 cursor-not-allowed'>Submit</button>
                )}
            </div>
        </div>
    );
}

export default CreatGroup;