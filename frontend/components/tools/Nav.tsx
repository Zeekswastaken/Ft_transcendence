"use client"

import Link from "next/link";
import Image from "next/image";
import { usePathname} from "next/navigation";
import { useEffect } from "react";

type LinkData = {
	link: string
	imageSrc : string
	imageAlt : string
}

const Icon = ({ link, imageSrc, imageAlt} : LinkData) => {
	const pathname = usePathname();
	useEffect(() => {
	  }, [pathname])
	return (
		<div className="">
			<Link href={link} >
				<div className=" relative">
					
					{pathname === link ? (
					<div>
						<div className=" absolute h-[32px] w-[32px] rounded-full bg-primary-pink-300 blur-[10px] "></div>
						<div className=" absolute mt-[45px] rounded-t h-[5px] items-center w-[32px] bg-primary-pink-300 "></div>
					</div>) : (
						// <div></div>
						<div className=' absolute h-[32px] w-[32px] rounded-full hover:bg-primary-pink-300 hover:blur-[10px] transition-all duration-300 '></div>
						)
					}
					<Image 
						src={imageSrc}
						alt={imageAlt}
						height={30}
						width={30}
						className=" w-[30px] h-[30px] "
					/>
				</div>
			</Link>
		</div>
	)
}


const Nav = () => {

  return (
	<div className=" justify-between px-6 py-5 flex">
		<Icon link="/home" imageSrc="/home-2.svg" imageAlt="Home Page" />
		<Icon link="/chat" imageSrc="/messages-2.svg" imageAlt="Chat Page" />
		<Icon link="/leaderboard" imageSrc="/ranking.svg" imageAlt="Leaderboard Page" />
		{/* <Icon link="/game" imageSrc="/gameboy.svg" imageAlt="Game Page" /> */}
		<Icon link="/channels" imageSrc="/people.svg" imageAlt="Groups Page" />
	</div>    
  )
}

export default Nav

