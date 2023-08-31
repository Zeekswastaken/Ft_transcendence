"use client"
import React, { use, useContext, useEffect, useState } from "react";
import DiscriptionCard from "../../components/home/DiscriptionCard";
import GameCards from "../../components/home/GameCards";
import MatchHistory from "../../components/home/MatchHistory";
import { useSocketContext } from "../socket";
import { getCookie } from "cookies-next";
import { io } from "socket.io-client";
import { useUserDataContext } from "@/app/userDataProvider";


export default function Home() {

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
  