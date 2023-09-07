"use client"
import React, { useState } from 'react'
import ChatList from './chatList';
import ChatListMobil from './chatListMobil';
import Board from './board';
import ChatContent from './chatContent';
import { getCookie } from 'cookies-next';
import { io } from 'socket.io-client';
import { useSocketContext } from '../socket';
const page = () => {

  const token = getCookie("accessToken");
  const {socket} = useSocketContext();
  socket?.emit("Duo", {token:token,name:'Oussama'});

  return (
    <div className=" w-screen h-screen mx-4 max-sm:mx-0 bg-opacity-80 shadow-md">
    <div className=" mt-[100px] h-[85%] max-xl:h-[75%] max-sm:h-[80%] flex gap-4 justify-center my-8 mx-20 max-xl:mx-4 max-sm:mx-0 bg-opacity-80 shadow-md backdrop-blur-md rounded-3xl place-items-center"> {/* chat and friends */}
      <ChatList/>
      <ChatContent />
    </div>
    {/* <div className="md:mt-[150px] max-sm:w-full max-sm:block hidden h-[90%] gap-2 justify-center mt-[90px] ">  */}
      {/* <ChatListMobil /> */}
      {/* <ChatContent /> */}
    {/* </div> */}
  </div>
  );
  }
  
  export default page
  
  
  //   // <div className=" flex mt-[250px] mx-8 w-full h-screen">
  //   //   <div>
  
  //   //   </div>
  //   // </div>
  //   <div className=' mt-[200px] text-white w-full xl:max-w-[1600px] mx-8'>
  //     <div  className='  h-[80%]  relative'>
  //       <div className='h-[550px] w-[700px] bg-[#321B38] absolute inset-y-0 right-0 '>
  //         <p className=' text-black absolute right-0'>heloo world</p>
  //       </div>
  //       {/* <div className='h-[800px] w-[700px] bg-black absolute inset-y-0 left-0 '>
  
  //       </div> */}
  //     </div>
  //   </div>
  // //   <div className="w-full h-screen  bg-gray-200">
  // //   <div className="bg-[#321B38] mx-8 mt-[200px] h-5/6 w-full">
  // //   </div>
  // // </div>
  {/*<div className="flex w-[1400px]">
     <div className="absolute mt-[200px] max-w-[400px] w-[1112px] h-[1100px] flex-shrink-0 rounded-2xl bg-purple-800 bg-opacity-30 shadow-lg ml-[50px]">

        <span className='absolute mx-50 my-[50]'>friends section</span>
    </div>
    <div className=" bottom-[300px] mt-[200px] max-w-[900px] w-[1112px] h-[1100px]  flex-shrink-0 rounded-2xl bg-[#321B38] shadow-2xl bg-opacity-30 ml-[500px]">
      <div className="w-1112 h-[112px] flex-shrink-0 rounded-tl-xl rounded-tr-xl rounded-br-0 rounded-bl-0 bg-[#2D0130] ">
      <Image src="/vector.svg" width={40} height={40} alt="icon" className="absolute mx-4 ml-[825px] mt-[40px]"/>
      <Image src="/Ellipse.png" width={50} height={50} alt="pic" className="absolute mx-4 ml-[30px] mt-[30px]"/>
        <h1 className=" absolute chat_text_username mt-7 ml-[100px]">Judith</h1>
        <p className=" absolute chat_text_p mt-[60px] ml-[100px]">judith juanita</p>
      </div>
        <p>test</p>
        <span>chat section</span>
    </div>
    </div>*/}
  {/*--------------------------------------------------------------------------------------------------*/}

// import React from 'react'
// import Image from "next/image";

// const page = () => {
//   return (
//   <div className="flex w-[1400px]">
//     <div className="absolute mt-[200px] max-w-[400px] w-[1112px] h-[1100px] flex-shrink-0 rounded-2xl bg-purple-800 bg-opacity-30 shadow-lg ml-[50px]">

//         <span className='absolute mx-50 my-[50]'>friends section</span>
//     </div>
//     <div className="absolute mt-[200px] max-w-[900px] w-[1112px] h-[1100px] flex-shrink-0 rounded-2xl bg-[#321B38] shadow-2xl bg-opacity-30 ml-[500px]">
//       <div className="w-1112 h-[112px] flex-shrink-0 rounded-tl-xl rounded-tr-xl rounded-br-0 rounded-bl-0 bg-[#2D0130] ">
//       <Image src="/vector.svg" width={40} height={40} alt="icon" className="absolute mx-4 ml-[825px] mt-[40px]"/>
//       <Image src="/Ellipse.png" width={50} height={50} alt="pic" className="absolute mx-4 ml-[30px] mt-[30px]"/>
//         <h1 className=" absolute chat_text_username mt-7 ml-[100px]">Judith</h1>
//         <p className=" absolute chat_text_p mt-[60px] ml-[100px]">judith juanita</p>
//       </div>
//         {/* <span>chat section</span> */}
//     </div>
//     </div>
//   )
// }

// export default page