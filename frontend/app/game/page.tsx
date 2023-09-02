'use client'
import React, { useRef } from 'react'

import OneVsOneSender from './component/OneVsOneSender'

const page = () => {
  return (
    <div className=' text-3xl text-white mt-[160px]  max-w-[1400px]  rounded-[20px] border-[2px] border-[#FF1382] w-full'>
        <div className='h-auto glass w-auto bf-glass  rounded-[20px] p-5 grid place-content-center' >
          <OneVsOneSender />
        </div>
    </div>
  )
}

export default page