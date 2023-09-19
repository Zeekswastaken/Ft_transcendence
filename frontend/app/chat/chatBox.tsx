import react, { useEffect, useState } from "react"
import Message from "./message"
import { Content } from './content';
import { useMyStore } from "./state";
import { useSocketContext } from '../socket';




function chatBox()
{
  const {socket} = useSocketContext();
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
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

    useEffect(() => {
        function handleResize() {
          setWindowHeight(window.innerHeight);
        }
    
        window.addEventListener('resize', handleResize);
    
        return () => {
          window.removeEventListener('resize', handleResize);
        };
      }, []);

    return <div className= {`${windowHeight >= 1200 ? "h-[83%]": windowHeight <= 800 ? "h-[70%]" : "h-[77%]"} overflow-y-scroll flex flex-col-reverse no-scrollbar`}>
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