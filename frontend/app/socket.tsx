"use client"
import { getCookie } from 'cookies-next';
import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

// Create a context for the Socket
const socketContext = createContext<any | undefined>(undefined);

// Define the hook to consume the Socket context
export function useSocketContext(): any | undefined {
  return useContext(socketContext);
}

// Define the SocketProvider component
interface SocketProviderProps {
  children: React.ReactNode;
}

export function SocketProvider({ children }: SocketProviderProps) {
  const [socket, setSocket] = useState<any | undefined>(undefined); // Initialize socket with undefined
  const updateSocket = (newSocket:any) => {
    setSocket(newSocket);
  };
  useEffect(() => {
    // const token = getCookie("accessToken");
    // Only create a new socket if it hasn't been created yet
    if (!socket) {
      const newSocket = io("http://localhost:3000", {
        transports: ["websocket"],
        autoConnect: false,
      });

      newSocket.connect(); 
      setSocket(newSocket);
      // socket?.emit('getSocketId', {token:token});
      // console.log("token = ", token)
      // console.log("socket = ", newSocket)
      // newSocket.emit("getSocketId", {query: token,client: socket})
    }
    // Clean up when the component unmounts
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [socket]);
  // console.log("newSocket.id = ", socket)

  return (
    <socketContext.Provider value={{socket}}>
      {children}
    </socketContext.Provider>
  );
}
