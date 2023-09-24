"use client";
import react, { MouseEvent, useEffect, useState } from "react";
import GroupList from "./groupList";
import { useMyStore } from "./state";
import { useSocketContext } from '../socket';
import { useRouter } from "next/navigation";




function chatMembers() {
  const {setMyBoolean, userData, chatMembers, currUserData, setUserGroups} = useMyStore();
  const [mem, setMem] = useState<any[]>([]);
  const [owner, setOwner] = useState<any[]>([]);
  const [password, setPassword] = useState<string>("")
  const [type, setType] = useState(userData.Type);
  const [isclicked, setIsclicked] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("")

  useEffect(() => {
    socket.on("afterleave", (data:any)=> {
      if (data.owner){
        if (data.owner.Channelid === userData.id)
        setMem(data.members);
      }
    })
  })

  useEffect(() => {
    setMem(chatMembers?.members);
    setOwner(chatMembers?.owner);
  }, [chatMembers])

  const router = useRouter();
  const { socket } = useSocketContext();

  function redirectToProfile() {
    router.push("/users/" + owner?.user?.username)
  }
  function Challenge (e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    socket.emit("AddtoInviteQueue", {userid: currUserData.id, receiver: chatMembers?.owner?.username});
    socket.on("pendingqueue", (data:any) => {
      router.push("/queue/friendqueue")
    })
  }

  function leaveGroup() {
    socket.emit("LeaveChannel", { channelID: userData.id, userID: currUserData.id })
    socket?.on("isleft", (data:any) =>{
      if (data.isleft)
        setMyBoolean(false);
      setUserGroups(data);
    })
  }

  const openModal = () => {
    setErrorMessage("");
    const modal = document.getElementById('my_modal_2') as HTMLDialogElement | null;
    if (modal) {
      modal.showModal();
    }
  };
  const closeModal = () => {
    const modal = document.getElementById('my_modal_2') as HTMLDialogElement | null;
    if (modal) {
      modal.close();
    }
  };

  function handleChangePassword() {
    socket.emit("changePass", {channelID:userData.id, userID:chatMembers?.owner?.Userid, Pass:password})
    socket.on("isPass", (type:any) => {
        if (type === true){
          closeModal();
          setErrorMessage("");
        }
        else
          setErrorMessage(type);
  })
}

  function checkPrivacy () {
    if (type === "public"){
      setErrorMessage("");
      document.getElementById('my_modal_1').showModal();
    }
    else {
      socket.emit("switchPrivacy", {channelid:userData.id, Password:null})
      socket.on("privacy", (type:any) => {
        setType(type);
      })
    }
  }

  function switchPrivacy (){
    socket.emit("switchPrivacy", {channelid:userData.id, Password:password})
      socket.on("privacy", (type:any) => {
        if (type === "public" || type === "protected"){
          setType(type);
          document.getElementById('my_modal_1').close();
        }
        else
          setErrorMessage(type);
      })
  }
  const [privateLink, setPrivateLink] = useState<string>("");
  function getLink() {
    document.getElementById('my_modal').showModal();
    socket?.emit("generateLink", {channelid:userData.id, userid:currUserData.id});
    socket?.on("Link", (link:string)=>{
      setPrivateLink(link);
    })
  }

  return (
    <div className="drawer drawer-end absolute w-[60%] max-2xl:w-[70%] h-[60%] max-sm:h-[90%] right-0 max-sm:w-full">
      <input
        id="my-drawer-4"
        type="checkbox"
        className="drawer-toggle bg-pink-600 right-0 "
      />
      <div className="drawer-content">
        <label
          htmlFor="my-drawer-4"
          className="drawer-button absolute mx-4 my-4 right-2 bottom-full pb-2 max-sm:pb-5"
        >
          <img src="/Vector.svg" alt="icon" className="w-[40px] max-sm:w-[30px]" />
        </label>
      </div>
      <div className="drawer-side flex flex-col absolute h-[95%] w-full px-4 z-30">
        <label htmlFor="my-drawer-4" className="drawer-overlay"></label>
        <div className="h-[95%] w-full mx-2 bg-[#4C2556] rounded-2xl">
          <div className="menu h-[30%] flex-row bg-[#321B38] rounded-t-2xl">
            <div className="grid grid-cols-3 grid-rows-3 h-full mx-4 w-full max-sm:mx-0">
            <div className=" row-span-2 h-full place-content-center flex items-center justify-center">
                
                <img
                  src={userData.avatar}
                  alt="icon"
                  className=" h-full max-sm:h-[80%] rounded-full "
                />
              </div>
              <div className=" col-span-2 row-span-2 rounded-2xl flex items-center  w-full h-full">
                <p className=" font-Glitch text-2xl max-sm:text-lg ">
                  {userData.Name}
                </p>
              </div>
              <div className="bg-purple-700 col-span-3 rounded-2xl relative h-[40px]">
                <p className="font-Bomb text-2xl max-sm:text-lg absolute py-1 max-sm:py-2 px-4">
                  {owner?.user?.username}
                </p>
                <div className="float-right">
                  {currUserData.id != chatMembers?.owner?.Userid ? (
                    <div className="dropdown dropdown-left mx-2 my-1">
                      <button
                        tabIndex={0}
                        className=" absolute border-none ring-0 right-4 place-content-center"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="13"
                          height="4"
                          viewBox="0 0 13 4"
                          fill="none"
                          className=" w-5 h-5"
                        >
                          <path
                            d="M0.521915 2C0.513031 1.48762 0.641936 0.990672 0.880796 0.61647C1.11966 0.242269 1.4493 0.0208404 1.79855 0C1.97196 0.00826693 2.14256 0.0665729 2.3006 0.171584C2.45863 0.276594 2.601 0.426251 2.71956 0.611997C2.83813 0.797742 2.93056 1.01593 2.99159 1.2541C3.05261 1.49226 3.08101 1.74573 3.07519 2C3.08101 2.25427 3.05261 2.50774 2.99159 2.7459C2.93056 2.98407 2.83813 3.20226 2.71956 3.388C2.601 3.57375 2.45863 3.72341 2.3006 3.82842C2.14256 3.93343 1.97196 3.99173 1.79855 4C1.4493 3.97916 1.11966 3.75773 0.880796 3.38353C0.641936 3.00933 0.513031 2.51238 0.521915 2ZM9.9712 2C9.9882 1.63625 10.0773 1.28769 10.2275 0.997133C10.3777 0.706574 10.5825 0.48666 10.8167 0.364395C11.051 0.24213 11.3045 0.222836 11.5461 0.308881C11.7878 0.394926 12.007 0.582566 12.1769 0.848759C12.3468 1.11495 12.46 1.44811 12.5026 1.80733C12.5452 2.16655 12.5153 2.53618 12.4167 2.87086C12.318 3.20553 12.1548 3.49066 11.9472 3.69125C11.7396 3.89184 11.4965 3.99915 11.2478 4C11.0744 3.99173 10.9038 3.93343 10.7458 3.82842C10.5878 3.72341 10.4454 3.57375 10.3268 3.388C10.2083 3.20226 10.1158 2.98407 10.0548 2.7459C9.99378 2.50774 9.96537 2.25427 9.9712 2ZM5.24656 2C5.24656 1.50351 5.38106 1.02736 5.62048 0.676296C5.85989 0.325227 6.18461 0.128 6.52319 0.128C6.86178 0.128 7.1865 0.325227 7.42591 0.676296C7.66533 1.02736 7.79983 1.50351 7.79983 2C7.79983 2.49649 7.66533 2.97264 7.42591 3.3237C7.1865 3.67477 6.86178 3.872 6.52319 3.872C6.18461 3.872 5.85989 3.67477 5.62048 3.3237C5.38106 2.97264 5.24656 2.49649 5.24656 2Z"
                            fill="white"
                          />
                        </svg>
                      </button>
                      <ul
                        tabIndex={0}
                        className="dropdown-content menu p-2 shadow rounded-box w-52 bg-pink-900 opacity-20 z-40"
                      >
                        <li className="place-content-center font-Bomb">
                          <button onClick={redirectToProfile}>
                            View profile
                          </button>
                        </li>
                        <li className=" place-content-center font-Bomb">
                          <button onClick={Challenge}>Challenge</button>
                        </li>
                      </ul>
                    </div>
                  ) : (
                    <div className="dropdown dropdown-left mx-2 my-1">
                      <button
                        tabIndex={0}
                        className=" absolute border-none ring-0 right-4 place-content-center"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="13"
                          height="4"
                          viewBox="0 0 13 4"
                          fill="none"
                          className=" w-5 h-5"
                        >
                          <path
                            d="M0.521915 2C0.513031 1.48762 0.641936 0.990672 0.880796 0.61647C1.11966 0.242269 1.4493 0.0208404 1.79855 0C1.97196 0.00826693 2.14256 0.0665729 2.3006 0.171584C2.45863 0.276594 2.601 0.426251 2.71956 0.611997C2.83813 0.797742 2.93056 1.01593 2.99159 1.2541C3.05261 1.49226 3.08101 1.74573 3.07519 2C3.08101 2.25427 3.05261 2.50774 2.99159 2.7459C2.93056 2.98407 2.83813 3.20226 2.71956 3.388C2.601 3.57375 2.45863 3.72341 2.3006 3.82842C2.14256 3.93343 1.97196 3.99173 1.79855 4C1.4493 3.97916 1.11966 3.75773 0.880796 3.38353C0.641936 3.00933 0.513031 2.51238 0.521915 2ZM9.9712 2C9.9882 1.63625 10.0773 1.28769 10.2275 0.997133C10.3777 0.706574 10.5825 0.48666 10.8167 0.364395C11.051 0.24213 11.3045 0.222836 11.5461 0.308881C11.7878 0.394926 12.007 0.582566 12.1769 0.848759C12.3468 1.11495 12.46 1.44811 12.5026 1.80733C12.5452 2.16655 12.5153 2.53618 12.4167 2.87086C12.318 3.20553 12.1548 3.49066 11.9472 3.69125C11.7396 3.89184 11.4965 3.99915 11.2478 4C11.0744 3.99173 10.9038 3.93343 10.7458 3.82842C10.5878 3.72341 10.4454 3.57375 10.3268 3.388C10.2083 3.20226 10.1158 2.98407 10.0548 2.7459C9.99378 2.50774 9.96537 2.25427 9.9712 2ZM5.24656 2C5.24656 1.50351 5.38106 1.02736 5.62048 0.676296C5.85989 0.325227 6.18461 0.128 6.52319 0.128C6.86178 0.128 7.1865 0.325227 7.42591 0.676296C7.66533 1.02736 7.79983 1.50351 7.79983 2C7.79983 2.49649 7.66533 2.97264 7.42591 3.3237C7.1865 3.67477 6.86178 3.872 6.52319 3.872C6.18461 3.872 5.85989 3.67477 5.62048 3.3237C5.38106 2.97264 5.24656 2.49649 5.24656 2Z"
                            fill="white"
                          />
                        </svg>
                      </button>
                      <ul
                        tabIndex={0}
                        className="dropdown-content menu p-2 shadow rounded-box w-52 bg-pink-700 opacity-20 z-40"
                      >
                        {type != "private" ? (<li className="place-content-center font-Bomb">
                          <button onClick={checkPrivacy}>
                            Switch privacy
                          </button>
                        </li>) : null}
                        {type === "protected" ? (
                          <li className=" place-content-center font-Bomb">
                            <button onClick={openModal}>
                              Change Password
                            </button>
                          </li>) : (null)
                        }
                        {type === "private" ? (
                          <li className=" place-content-center font-Bomb">
                            <button onClick={getLink}>
                              Group link
                            </button>
                          </li>) : (null)
                        }
                      </ul>
                      <dialog id="my_modal_2" className="modal">
                        <div className="modal-box bg-[#810851]/[0.9] space-y-5 grid place-items-center">
                          <h3 className="font-Bomb text-2xl text-center">Change Password!</h3>
                          <input onChange={e => { setPassword(e.target.value) }} value={password} type="text" className=" outline-none focus:outline bg-[#532051]  text-center placeholder:font-Bomb font-bold text-white h-14 px-10  w-full placeholder:text-white" placeholder="Password" />
                          <button onClick={handleChangePassword} className="bg-[#FF1382] hover:bg-[#FF1382]/[0.8] duration-300 text-white font-Bomb text-xl tracking-wide px-14 h-10 rounded-xl">Change</button>
                          {errorMessage && <p className="text-red-500 font-Bomb">{errorMessage}</p>}
                        </div>
                        <form method="dialog" className="modal-backdrop">
                          <button onClick={closeModal}>Close</button>
                        </form>
                      </dialog>
                      <dialog id="my_modal_1" className="modal">
                        <div className="modal-box bg-[#810851]/[0.9] space-y-5 grid place-items-center">
                          <h3 className="font-Bomb text-2xl text-center">Create Password</h3>
                          <input onChange={e => { setPassword(e.target.value) }} value={password} type="text" className=" outline-none focus:outline bg-[#532051]  text-center placeholder:font-Bomb font-bold text-white h-14 px-10  w-full placeholder:text-white" placeholder="Password" />
                          <button onClick={switchPrivacy} className="bg-[#FF1382] hover:bg-[#FF1382]/[0.8] duration-300 text-white font-Bomb text-xl tracking-wide px-14 h-10 rounded-xl">Submit</button>
                          {errorMessage && <p className="text-red-500 font-Bomb">{errorMessage}</p>}
                        </div>
                        <form method="dialog" className="modal-backdrop">
                          <button >Close</button>
                        </form>
                      </dialog>
                      <dialog id="my_modal" className="modal">
                        <div className="modal-box bg-pink-800">
                          <div className="p-4 flex justify-center items-center">
                            <input
                              id="copy-input"
                              type=""
                              value={privateLink}
                              placeholder="Enter text to copy"
                              className="bg-purple-700 border-none p-2 rounded-md w-[150px] flex justify-center items-center"
                              disabled
                            />
                          </div>
                        </div>
                        <form method="dialog" className="modal-backdrop">
                          <button>close</button>
                        </form>
                      </dialog>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className=" h-[55%] overflow-y-scroll no-scrollbar bg-[#4C2556]">
            <ul className=" flex flex-col whitespace-no-wrap p-4 max-sm:p-0">
              {mem?.map((mem, id) => (
                <GroupList key={Math.random()} member={mem} />
              ))}
            </ul>
          </div>
          <div className="menu h-[15%] rounded-b-2xl place-items-center max-sm:mb-8 flex items-center justify-center">
            <button onClick={leaveGroup} className="btn btn-sm btn-outline btn-error absolute w-[50%] ">
              Leave group
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default chatMembers;
