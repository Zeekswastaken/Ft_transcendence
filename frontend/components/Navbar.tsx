"use client"

import Nav from "./tools/Nav";
import ProfileDropDown from "./tools/ProfileDropDown";
import NotificationDropDown from "./tools/NotificationDropDown";
import { usePathname, useRouter } from "next/navigation";
import useMediaQuery from "@/hooks/useMediaQuery"
import { Bars3Icon, MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { deleteCookie, getCookie } from "cookies-next";
import jwt, { JwtPayload } from "jsonwebtoken";
import { useSocketContext } from "@/app/socket";
const url = `http://${process.env.NEXT_PUBLIC_HOST}:${process.env.NEXT_PUBLIC_PORT}/profile/`;
const url2 = `http://${process.env.NEXT_PUBLIC_HOST}:${process.env.NEXT_PUBLIC_PORT}`;
const MobileLinks = ( {pathname, toGo, value}:any) => {
	return (
		<div>
			{pathname === toGo ? (
				<p className="text-primary-pink-300">{value}</p>
			) : (
				<p className=" text-white hover:text-primary-pink-300 duration-300">{value}</p>
			)}
		</div>
	)
}


const Navbar = () => {
	const pathName = usePathname();
	const [user, setUser] = useState<JwtPayload>()
	const {socket} = useSocketContext();
	const currentUsername = user?.username;
	const isAboveMediumScreens = useMediaQuery("(min-width: 1024px)");
	const [isMenuToggled, setIsMenuToggled] = useState<boolean>(false);
	const [mobileSearchtoggle, setMobileSearchtoggle] = useState<boolean>(false);
	const [searchForUser, setSearchForUser] = useState("");
	const [userNotFound, setUserNotFound] = useState("");
	const router = useRouter()
	const [isInputFocused, setIsInputFocused] = useState(false);

	let check = false
	if (pathName === "/authCompleteProfile" || pathName === "/login" || pathName === "/login/2fa" || pathName === "/signup" || pathName === "/signup/complete-profile" || pathName === "/not-found")
		check = true;	
	// return (
		// 		<></>
		// 	)
	// else {
		// const token = getCookie("accessToken");
		// const [isUserValid, setIsUserValid] = useState<boolean>(false);
		// const router = useRouter();
	  
		// const user = useUserDataContext()
		const token = getCookie("accessToken");
		if (!check) {
			axios.post(url2, {
				token: token
			}).then(res => {
				if (res.data.status === "unauthorized")
				router.push("/login");
			}).catch(res => (console.log(res)))
		}
	useEffect(() => {
		try {
			const user = jwt.decode(token as string) as JwtPayload
			if (user)
			setUser(user)
		// setCurrentUsername(jwt.decode(token).username);
	  } catch (error) {
		console.error('Error decoding token:');
	}
	}, [token])
	
	useEffect(() => {
		socket?.emit("getSocketId&JoinRoom", {token: token})
	}, [socket])
	// useEffect(() => {u
		//   }, [socket])
		

	
		const handleSearchSubmit = (e: FormEvent<HTMLFormElement>) => {
			e.preventDefault()
			axios.get(`${url}${searchForUser}`).then(res => {
				if (res.data.message === "not-found") {
					setUserNotFound("User Not Found")
					return ;
				}
				else {
					router.push(`/users/${searchForUser}`)
					setUserNotFound('')
					setSearchForUser('')
					setIsInputFocused(false)
				}
			}).catch(res => {console.log(res)})
		}
		const handleSignOut = (e: React.MouseEvent<HTMLElement>) => {
			e.preventDefault()  
			deleteCookie("accessToken");
			router.push("/login")
		  }
		const handleInputFocus = () => {
    		setIsInputFocused(true);
  		};

		const handleInputBlur = () => {
			setIsInputFocused(false);
		};
	// }
		return (
			<>
				{check ? (<></>) : (

				<nav className="  absolute place-content-center  items-center mt-[30px] mb-[55px] h-auto flex w-full sm:w-[80%] justify-between space-x-5 z-20  p-3 rounded-xl glass">
					
					<div className=" flex justify-between">
						<Link href="/home" className="flex">
							<p className=" font-Glitch text-pink-200 text-4xl text-justify pr-5 pt-1">Pong</p>
						</Link>
						<form onSubmit={handleSearchSubmit} className=" pt-[7px]">
							{isAboveMediumScreens || mobileSearchtoggle ? (
								<div className="relative ">
									<span className="absolute inset-y-0 left-2 flex items-center ">
										{/* <button onClick={() => setMobileSearchtoggle(!mobileSearchtoggle)} className="p-1 focus:outline-none focus:shadow-outline"> */}
										{/* <button className="p-1 focus:outline-none focus:shadow-outline"> */}
											<img src="/searchIcon.svg" width={20} height={20} alt="search" className=""/>
										{/* </button> */}
									</span>
									<input 	onFocus={handleInputFocus}
											onBlur={handleInputBlur}
											onChange={e => setSearchForUser(e.target.value)}
											value={searchForUser}
											type="search" name="q"
											className="  border-transparent focus:border-transparent focus:ring-0 w-[170px] py-2 text-sm text-[#6E4778] placeholder-[#6E4778] bg-[#411742] rounded-xl pl-10 focus:outline-none focus:bg-primary-dark-500 focus:text-primary-white-200" placeholder="Search..." />
									{userNotFound && searchForUser && <p className="text-red-500 absolute text-xs pt-1 text-left">{userNotFound}</p>}
								</div> 
								) : (
									<button onClick={() => setMobileSearchtoggle(!mobileSearchtoggle)} className="px-1 mt-1 bg-[#411742] rounded-xl focus:outline-none focus:shadow-outline">
									{/* <img src="/searchIcon.svg" width={30} height={30} alt="search" className=""/> */}
										<MagnifyingGlassIcon className=" h-7 w-10 text-[#6d4678]" />
									</button>
							)}
						</form>

					</div>
					{isAboveMediumScreens ? (
						<>
							<div className="  bg-primary-dark-300 drop-shadow-[6px_5px_0_rgba(0,0,00.25)] opacity-80 rounded-3xl w-[340px]">
								<Nav />
							</div>
							<div className=" flex justify-between space-x-7">
								<div className=" z-50">
									<NotificationDropDown />
								</div>
								<div className=" z-50">
									<ProfileDropDown />
								</div>
							</div>  
						</>
					) : (
						<div className="  flex space-x-2">
							<div className=" z-50">
								<NotificationDropDown />
							</div>
							<button
							className=" items-end rounded-full bg-secondary-500 p-2"
							onClick={() => setIsMenuToggled(!isMenuToggled)}
							>
								{!isMenuToggled ? (
									<Bars3Icon className="h-10 w-10 text-white" />

								) : (<XMarkIcon className=" h-10 w-10 text-white"/>)}
							</button>
						</div>
					)}
							{!isAboveMediumScreens && isMenuToggled && (
							<>
							<div className="absolute right-0  z-40 h-full w-full bg-primary-100 drop-shadow-xl ease-in duration-300 top-20">
							{/* CLOSE ICON */}
								<div className=" w-full rounded-2xl bg-black flex flex-col text-2xl  ">
									<div className=" grid grid-cols-1 px-10 pt-6  font-Heading tracking-wide duration-300">
										<Link onClick={() => setIsMenuToggled(!isMenuToggled)} href={`/users/${currentUsername}`} className="hover:text-primary-pink-300/[0.9] duration-300">My Profile</Link>
									</div>
									<div className="divider"></div> 
									<div className=" grid grid-cols-1 px-10   font-Heading tracking-wide duration-300">
										<Link onClick={() => setIsMenuToggled(!isMenuToggled)} href="/home" >
											<MobileLinks pathname={pathName} toGo="/" value="Home" />
										</Link >
										<Link onClick={() => setIsMenuToggled(!isMenuToggled)} href="/chat" >
											<MobileLinks pathname={pathName} toGo="/chat" value="Chat" />
										</Link >
										<Link onClick={() => setIsMenuToggled(!isMenuToggled)} href="/leaderboard" >
											<MobileLinks pathname={pathName} toGo="/leaderboard" value="Leaderboard" />
										</Link >
										<Link onClick={() => setIsMenuToggled(!isMenuToggled)} href="/channels" >
											<MobileLinks pathname={pathName} toGo="/channels" value="Channels" />
										</Link >
									</div>
									<div className="divider"></div>
									<div className="px-10 pb-5 text-2xl text-white font-Heading tracking-wide duration-300">
										<button onClick={handleSignOut} className=" hover:bg-[#FF7171]/[0.9] rounded-lg duration-300 px-2 py-1">Sign out</button>
									</div>
								</div>
								</div>
							</>
						)}
					
					</nav>
				)}
			</>

			// </div>
			// Mobile navigation
		)
	// }
}

export default Navbar