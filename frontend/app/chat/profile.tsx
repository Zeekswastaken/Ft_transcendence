import reaact, { MouseEvent, MouseEventHandler, useEffect } from "react"
import { useMyStore } from "./state";
import { useSocketContext } from '../socket';
import friendBar from "./friendBar";



const profile = ({friend}:any) =>
{
  const {token,setMyBoolean , setUserData, setChanelType, setGetChat, setUpdateChat, setTempo} = useMyStore();
  const {socket} = useSocketContext();

  const setMyStore = (e: MouseEvent<HTMLButtonElement>) =>{
    e.preventDefault();
    setMyBoolean(true);
    setUserData(friend);
    const channelid = friend.channelid;
    socket?.emit("getmessages",  {token, channelid});
    socket?.emit("isDuo",{channelid} );
    setUpdateChat([]);
    setTempo([]);
    socket?.on("messages", (data:any) => {
      setGetChat(data);
    })
    // socket?.on("isduo", (bol:Boolean)=>{
    //   setChanelType(bol);
    // });
  }
    return (
        <li className=" items-center space-y-1">
          <button onClick={setMyStore}>

        <div className=' relative bg-[#321B38] p-1 rounded-full'>

        <a className="block  w-16 h-16  rounded-full " href="#">
          <img className="h-16 w-16 rounded-full" src={friend.user.avatar_url} alt="test" />
        </a>
        <div className={`absolute bottom-0 right-0 rounded-full ${friend.user.status === "Online" ? "bg-green-500" : "bg-gray-500"} border-2 border-white w-[20px] h-[20px]`}></div>
        </div>
        {/* <a href={props.href}>{props.name}</a> */}
          </button>
      </li>
    );
}

export default profile