"use client";
import react, { MouseEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMyStore } from "./state";
import { useSocketContext } from "../socket";

interface members {
  member: any;
}

function groupList({ member }: members) {

  const {setAdmin, admin, setBaned, currUserData, chatMembers, setChatMembers, userData, setMuted, muted } = useMyStore();
  const { socket } = useSocketContext();
  const [isMuted, setIsMuted] = useState(member.isMuted );
  const [isBanned, setIsBanned] = useState(member.isBanned);
  const [isAdmin, setIsAdmin] = useState(member.Type ==="admin");
  const router = useRouter();
  function redirectToProfile() {
    router.push("/users/" + member.user.username)
  }
  function Challenge (e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    socket.emit("AddtoInviteQueue", {userid: currUserData.id, receiver: member.user.username});
    socket.on("pendingqueue", (data:any) => {
      router.push("/queue/friendqueue")
    })
  }
  function muteMember() {
    setIsMuted(true);
    socket?.emit("muteUser", { channelID: userData.id, userID: member.user.id, initiatorID: currUserData.id, amount: 0 });
  }
  function unMuteMember() {
    setIsMuted(false);
    socket?.emit("unmuteUser", { channelID: userData.id, userID: member.user.id })
  }
  function banMember() {
    setIsBanned(true);
    socket?.emit("banUser", { channelID: userData.id, userID: member.user.id, initiatorID: currUserData.id, amount: 0 });

  }
  function unBanMember() {
    setIsBanned(false);
    socket?.emit("unbanUser", { channelID: userData.id, userID: member.user.id });
  }

  function assignAdmin() {
    setIsAdmin(true);
    socket?.emit("assignAdmin", { channelID: userData.id, userID: member.user.id, initiatorID: currUserData.id});

  }
  function removeAdmin() {
    setIsAdmin(false);
    socket?.emit("removeAdmin", { channelID: userData.id, userID: member.user.id, initiatorID: currUserData.id});
  }
  useEffect(() => {
    socket?.on("newmembership", (data: any) => {
      setMuted(data);
    })
  }, [])
  useEffect(() => {
    socket?.on("newmembership1", (data: any) => {
      setBaned(data);
    })
  }, [])
  useEffect(() => {
    socket?.on("isadmin", (data: any) => {
      setAdmin(data);
    })
  }, [])
  return (
    member.user.id != currUserData.id ? (
      <li className=" p-2 rounded-xl place-items-center">
        <div className="relative h-[60px] flex-shrink-0 rounded-2xl bg-[#673E6A] space-x-4 max-sm:space-x-0 ">
          <img
            src={member.user.avatar_url}
            alt="pic"
            className="absolute w-[50px] mx-4 max-sm:mx-1 left-0 bottom-1"
          />
          <div className=" chat_text_username absolute bottom-4 left-6 max-sm:left-20">
            <p className=" font-Heading text-2xl max-sm:text-lg sm:w-36 truncate">{member.user.username}</p>
          </div>

          <div className=" float-right ">
            <div className="dropdown dropdown-left mx-4 max-sm:mx-0">
              <button tabIndex={0} className=" absolute border-none ring-0 right-4 place-content-center">
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
                  <button onClick={redirectToProfile}> View profile </button>
                </li>
                <li className=" place-content-center font-Bomb ">
                  <button onClick={Challenge}>Challenge</button>
                </li>
                {currUserData.id === chatMembers?.owner?.Userid ? (<>

                  {!isMuted ? (
                    <li className="place-content-center font-Bomb">
                      <button onClick={muteMember}>Mute</button>
                    </li>
                  ) : (
                    <li className="place-content-center font-Bomb">
                      <button onClick={unMuteMember}>Unmute</button>
                    </li>
                  )}
                  {!isBanned ? (
                    <li className="place-content-center font-Bomb">
                      <button onClick={banMember}>Ban</button>
                    </li>
                  ) : (
                    <li className="place-content-center font-Bomb">
                      <button onClick={unBanMember}>Unban</button>
                    </li>
                  )}
                  {!isAdmin ? (
                    <li className="place-content-center font-Bomb">
                      <button onClick={assignAdmin}>Assign Admin</button>
                    </li>
                  ) : (
                    <li className="place-content-center font-Bomb">
                      <button onClick={removeAdmin}>Remove Admin</button>
                    </li>
                  )}
                </>
                ) : null}
                {admin.Type === "admin" && currUserData.id === admin.Userid ? (<>
                  {!isMuted ? (
                    <li className="place-content-center font-Bomb">
                      <button onClick={muteMember}>Mute</button>
                    </li>
                   ) : (
                    <li className="place-content-center font-Bomb">
                      <button onClick={unMuteMember}>Unmute</button>
                    </li>
                  )}
                  {!isBanned ? (
                    <li className="place-content-center font-Bomb">
                      <button onClick={banMember}>Ban</button>
                    </li>
                  ) : (
                    <li className="place-content-center font-Bomb">
                      <button onClick={unBanMember}>Unban</button>
                    </li>
                  )}
                  </>
                ):null}
              </ul>
            </div>
          </div>
        </div>
      </li>
    ) : null
  )
}

export default groupList;
