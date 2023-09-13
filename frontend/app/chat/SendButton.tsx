'use client';

import React, { useState } from 'react'
import Image from "next/image";


const SendButton = () => {
  return (
  <div>
    <button type="submit" className="inline-flex justify-center p-2 rounded-full cursor-pointer">
      <Image src="/avatars/avatar3.png" width={40} height={40} alt="icon" className=" mx-2 rotate-12" />
    </button>
  </div>
  );
};

export default SendButton;