import React from "react";
import Image from "next/image";

const DiscriptionCard = () => {
  return (
    <header className=" bg-[url('/girl.png')] mt-[200px] min-w-[350px] flex items-center mx-5 md:mx-[100px] bg-cover bg-no-repeat bg-center h-[200px] sm:h-[350px] overflow-hidden whitespace-wrap rounded-[34px]">
      <h1 className=" md:p-12 font-Glitch text-[25px] sm:text-[40px] px-2 sm:px-5 text-left my-2 sm:my-8">
        <span className=" text-white">Welcome to </span>
        <span className=" text-primary-pink-300">PONG</span>
        <p className=" font-bold drop-shadow-[3px_2px_0_rgba(0,0,00.25)] pt-2 sm:pt-6 font-Bomb tracking-[6px] text-primary-white-100 text-[10px] px-2 sm:px-0 sm:text-xl md:text-2xl leading-loose max-w-[720px]">
          Step into the future of
          <span className=" text-primary-pink-300"> PingPong</span>, prepare for
          a<span className=" text-primary-pink-300 pt-4"> thrilling </span>
          experience!
        </p>
      </h1>
    </header>
  );
};

export default DiscriptionCard;
