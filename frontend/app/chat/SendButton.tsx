'use client';

import React, { useState } from 'react'

const SendButton = () => {
  return (
  <div>
    <button type="submit" className=" w-[50px] max-sm:w-[45px] h-[50px] max-sm:h-[45px] inline-flex justify-center p-1 cursor-pointer">
      <img src="/Send.png"  alt="icon" className="  h-full  mx-2 rotate-12" />
    </button>
  </div>
  );
};

export default SendButton;