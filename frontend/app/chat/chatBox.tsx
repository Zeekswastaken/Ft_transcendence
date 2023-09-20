import react, { useEffect, useState } from "react"
import Message from "./message"
import MessageGroups from "./messageGroups"
import { Content } from './content';
import { useMyStore } from "./state";
import { useSocketContext } from '../socket';
import { channel } from "diagnostics_channel";




function chatBox()
{
  const {socket} = useSocketContext();
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const {message, getChat, setGetChat, updateChat, setUpdateChat, tempo, setTempo, userData, currUserData, chanelType} = useMyStore();
  useEffect(()=>{
      socket?.on("OBJ", (data:any) => {
        console.log("OBJ USE EFFECT");
        console.log(data);
          setUpdateChat(data);
        });
        console.log(currUserData , updateChat);
    }, [])
    if(currUserData && Object.keys(currUserData).length){
    socket?.on("MessageToRoom", (data:any) => {
            setUpdateChat(data);
        });
    }
    useEffect(()=> {
        if (userData && updateChat && !chanelType){
            if (userData.channelid === updateChat.channelid) {
                setTempo([...tempo, updateChat]);
            }
        }
        // if (currUserData)
        if (userData && updateChat && chanelType)
        {
            if (userData.id === updateChat.channelid) {
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
        {!chanelType ?(<ul>
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
        </ul>)
        :(
            <ul>
            {getChat.map( (mes, id) => (
                <li key={id}>
                    <MessageGroups messages={mes}/>
                </li>
            ))}
            {tempo.map( (mes, id) => (
                <li key={id}>
                    <MessageGroups messages={mes} />
                </li>
            ))}
        </ul>
        )}
    </div>
}

export default chatBox;