import react, { useEffect, useState } from "react"
import Message from "./message"
import MessageGroups from "./messageGroups"
import { useMyStore } from "./state";
import { useSocketContext } from '../socket';




function chatBox()
{
  const {socket} = useSocketContext();
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const {getChat, updateChat, setUpdateChat, tempo, setTempo, userData, currUserData, chanelType} = useMyStore();
  useEffect(() => {
    const handleMessageToRoom = (data: any) => {
      if (currUserData.id !== data.user.id) {
        socket?.emit("isBlocked", { userID: currUserData.id, recipientID: data.user.id });
        socket?.on("isblocked", (bool: boolean) => {
          setUpdateChat({ message: data.message, user: data.user, channelid: data.channelid, isBlocked:bool });
        });
      }
    };
  
    socket?.on("OBJ", (data: any) => {
      setUpdateChat(data);
    });
  
    socket?.on("MessageToRoom", handleMessageToRoom);
    return () => {
      socket?.off("OBJ");
      socket?.off("MessageToRoom", handleMessageToRoom);
    };
  }, [socket, currUserData.id]);
  
    useEffect(()=> {
        if (userData && updateChat && !chanelType){
            if (userData.channelid === updateChat.channelid) {
                setTempo([...tempo, updateChat]);
            }
        }
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