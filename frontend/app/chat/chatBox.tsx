import react, { useEffect } from "react"
import Message from "./message"
import { Content } from './content';
import { useMyStore } from "./state";
import { useSocketContext } from '../socket';




function chatBox()
{
  const {socket} = useSocketContext();
  const {message, getChat, setGetChat, updateChat, setUpdateChat, tempo, setTempo, userData} = useMyStore();
  useEffect(()=>{
      socket?.on("OBJ", (data:any) => {
          setUpdateChat(data);
        });
    }, [])

    useEffect(()=> {
        if (
            userData &&
            updateChat
            ){
            if (userData.channelid === updateChat.channelid) {
                setTempo([...tempo, updateChat]);
            }
        }
    }, [updateChat]);
    return <div className= "h-[85%] max-sm:h-[70%] max-lg:h-[80%] max-xl:h-[80%] overflow-y-scroll flex flex-col-reverse no-scrollbar">
        <ul>
         {getChat.map( (mes, id) => (
            <li key={id}>
                <Message messages={mes}/>
            </li>
            ))}
        {tempo.map( (mes, id) => (
            <li key={id}>
                <Message messages={mes} />
            </li>
            ))}
        </ul>
    </div>;
}

export default chatBox;