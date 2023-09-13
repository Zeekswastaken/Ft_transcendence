import reaact from "react"
import { useMyStore } from "./state";


type profileProps = 
{
    name:string;
    img:string;
    href:string;
    alt:string;
    online:boolean;
}

const profile = ({friend}:any) =>
{
  const {setMyBoolean , myBoolean} = useMyStore();
  console.log("usename" + friend.username);
    return (
        <li className=" items-center space-y-1">
          <button onClick={() =>setMyBoolean(true)}>

        <div className=' relative bg-[#321B38] p-1 rounded-full'>

        <a className="block  w-16 h-16  rounded-full " href="#">
          <img className="h-16 w-16 rounded-full" src={friend.avatar_url} alt="test" />
        </a>
        <div className={`absolute bottom-0 right-0 rounded-full ${friend.status ? "bg-green-500" : "bg-gray-500"} border-2 border-white w-[20px] h-[20px]`}></div>
        </div>
        {/* <a href={props.href}>{props.name}</a> */}
          </button>
      </li>
    );
}

export default profile