"use client"

import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
// import ionicon from 'ionicons';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';
import 'swiper/css/effect-cards';

// import { EffectCards } from 'swiper/modules';
import { EffectCoverflow, Pagination, EffectCards } from 'swiper/modules';

const page = () => {
  return (
<div className="py-2" x-data="{ show: true }">
                <span className="px-1 text-sm text-gray-600">Password</span>
                <div className="relative">
                  <input placeholder="" : type="show ? 'password' : 'text'" className="text-md block px-3 py-2 rounded-lg w-full 
                bg-white border-2 border-gray-300 placeholder-gray-600 shadow-md
                focus:placeholder-gray-500
                focus:bg-white 
                focus:border-gray-600  
                focus:outline-none">
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">

                    <svg className="h-6 text-gray-700" fill="none" @click="show = !show"
                      : className="{'hidden' : !show, 'block':show }" xmlns="http://www.w3.org/2000/svg"
                      viewbox="0 0 576 512">
                      <path fill="currentColor"
                        d="M572.52 241.4C518.29 135.59 410.93 64 288 64S57.68 135.64 3.48 241.41a32.35 32.35 0 0 0 0 29.19C57.71 376.41 165.07 448 288 448s230.32-71.64 284.52-177.41a32.35 32.35 0 0 0 0-29.19zM288 400a144 144 0 1 1 144-144 143.93 143.93 0 0 1-144 144zm0-240a95.31 95.31 0 0 0-25.31 3.79 47.85 47.85 0 0 1-66.9 66.9A95.78 95.78 0 1 0 288 160z">
                      </path>
                    </svg>

                    <svg className="h-6 text-gray-700" fill="none" @click="show = !show"
                      :className="{'block': !show, 'hidden':show }" xmlns="http://www.w3.org/2000/svg"
                      viewbox="0 0 640 512">
                      <path fill="currentColor"
                        d="M320 400c-75.85 0-137.25-58.71-142.9-133.11L72.2 185.82c-13.79 17.3-26.48 35.59-36.72 55.59a32.35 32.35 0 0 0 0 29.19C89.71 376.41 197.07 448 320 448c26.91 0 52.87-4 77.89-10.46L346 397.39a144.13 144.13 0 0 1-26 2.61zm313.82 58.1l-110.55-85.44a331.25 331.25 0 0 0 81.25-102.07 32.35 32.35 0 0 0 0-29.19C550.29 135.59 442.93 64 320 64a308.15 308.15 0 0 0-147.32 37.7L45.46 3.37A16 16 0 0 0 23 6.18L3.37 31.45A16 16 0 0 0 6.18 53.9l588.36 454.73a16 16 0 0 0 22.46-2.81l19.64-25.27a16 16 0 0 0-2.82-22.45zm-183.72-142l-39.3-30.38A94.75 94.75 0 0 0 416 256a94.76 94.76 0 0 0-121.31-92.21A47.65 47.65 0 0 1 304 192a46.64 46.64 0 0 1-1.54 10l-73.61-56.89A142.31 142.31 0 0 1 320 112a143.92 143.92 0 0 1 144 144c0 21.63-5.29 41.79-13.9 60.11z">
                      </path>
                    </svg>

                  </div>
                </div>
              </div>
  )
}
export default page

{/* <script defer src="https://unpkg.com/alpinejs@3.2.4/dist/cdn.min.js"></script>    
    
<main class="grid w-full min-h-screen text-gray-100 bg-gray-900 place-content-center">

    <section x-data="skillDisplay"
        class="p-6 space-y-6 bg-gray-800 rounded-xl md:grid md:grid-cols-2 md:gap-4 sm:space-y-0">
        <div class="grid grid-cols-2 gap-6">
            <template x-for="skill in skills">
                <button x-text="skill.title"
                    class="px-4 py-2 text-xl text-gray-100 transition bg-blue-600 rounded-md h-14 w-44 hover:bg-blue-700"
                    :class="(currentSkill.title == skill.title) && 'font-bold ring-2 ring-gray-100'"
                    @click="currentSkill = skill"></button>
            </template>
        </div>

        <div class="flex items-center justify-center" x-data="{ circumference: 2 * 22 / 7 * 120 }">
            <svg class="transform -rotate-90 w-72 h-72">
                <circle cx="145" cy="145" r="120" stroke="currentColor" stroke-width="30" fill="transparent"
                    class="text-gray-700" />

                <circle cx="145" cy="145" r="120" stroke="currentColor" stroke-width="30" fill="transparent"
                    :stroke-dasharray="circumference"
                    :stroke-dashoffset="circumference - currentSkill.percent / 100 * circumference"
                    class="text-blue-500 " />
            </svg>
            <span class="absolute text-5xl" x-text="`${currentSkill.percent}%`"></span>
    </section>
</main>

<script>
    document.addEventListener('alpine:init', () => {
        Alpine.data('skillDisplay', () => ({
            skills: [{
                    'title': 'HTML',
                    'percent': '95',
                },
                {
                    'title': 'CSS',
                    'percent': '70',
                },
                {
                    'title': 'Tailwind CSS',
                    'percent': '90',
                },
                {
                    'title': 'JavaScript',
                    'percent': '70',
                },
                {
                    'title': 'Alpine JS',
                    'percent': '80',
                }, {
                    'title': 'PHP',
                    'percent': '65',
                }, {
                    'title': 'Laravel',
                    'percent': '75',
                }
            ],
            currentSkill: {
                'title': 'HTML',
                'percent': '95',
            }
        }));
    });
</script>


 */}
