import react, { useEffect } from "react"
import Message from "./message"
import { Content } from './content';
import { useMyStore } from "./state";
import { useSocketContext } from '../socket';




function chatBox()
{
  const {socket} = useSocketContext();
  const {message, getChat, setGetChat} = useMyStore();
    useEffect(() => {
        console.log("inside Box");
        socket?.on("messages", (data:any) => {
          console.log("it works");
          setGetChat(data);
        })
    },[])
    console.log(getChat);
    return <div className= "h-[85%] max-sm:h-[70%] max-lg:h-[80%] max-xl:h-[80%] overflow-y-scroll flex flex-col-reverse no-scrollbar">
        <ul>
         {getChat.map( (mes) => (
            <li
            >
                {/* {console.log(mes)} */}
                <Message key={mes.user.id} messages={mes}/>
            </li>
            ))}

        </ul>
    </div>;
}

export default chatBox;