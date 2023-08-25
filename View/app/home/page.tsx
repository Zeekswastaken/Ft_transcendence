
import React from "react";
import DiscriptionCard from "../../components/home/DiscriptionCard";
import GameCards from "../../components/home/GameCards";
import MatchHistory from "../../components/home/MatchHistory";


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
  