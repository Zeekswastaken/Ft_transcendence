"use client"
import React, { use, useContext, useEffect, useState } from "react";
import DiscriptionCard from "../../components/home/DiscriptionCard";
import GameCards from "../../components/home/GameCards";
import MatchHistory from "../../components/home/MatchHistory";
import { useSocketContext } from "../socket";
import { getCookie } from "cookies-next";
import { io } from "socket.io-client";


export default function Home() {

  // const socket = useSocketContext()
  // const _socket = useSocketContext()
  // const [socket, setSocket] = useState<any | undefined>(undefined); // Initialize socket with undefined

  // const token = getCookie("accessToken");
  // const {socket, updateSocket} = useSocketContext()
  // useEffect(() => {
  //   if (!socket) {
  //     const Socket = io("http://localhost:3000", {
  //       transports: ["websocket"],
  //       autoConnect: false,
  //     });

  //     Socket.connect(); 
  //     updateSocket(Socket);
  //     console.log("token = ", token)
  //     // socket?.emit('getSocketId', {token: token, client: Socket});
  //     console.log("socket = ", Socket)
  //   }

  // }, [socket])
  
  // useEffect(() => {
  // // if (socket) {
  //   socket?.emit("getSocketId", {query: token, client: socket})
  //   console.log("token = ", token)
  // // }  
  //   }, [])
  return (
    <main className="overflow-auto ">
      <div className=" animate-fade-up">
        <DiscriptionCard />
        <GameCards />
      </div>
      <MatchHistory />
    </main>
  );
}
  