import React from 'react'

import PingPong from './component/PingPong'

const page = () => {
  return (
    <div className=' text-3xl text-white mt-[300px]  max-w-[1700px] w-full'>
        <div className='h-[1000px] w-full bf-glass border-[2px] border-[#FF1382] rounded-[20px] grid place-content-center' >
          <PingPong />
        </div>
    </div>
  )
}

export default page