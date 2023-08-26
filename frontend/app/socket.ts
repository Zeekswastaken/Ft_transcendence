import { useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000", {
  transports: ["websocket"],
  autoConnect: false,
});

// Connect the socket when the app initializes
socket.connect();

export default socket;
