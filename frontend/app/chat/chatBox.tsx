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
          setUpdateChat(data);
        });
    }, [])
    if(currUserData && Object.keys(currUserData).length){
    socket?.on("MessageToRoom", (data:any) => {
            setUpdateChat(data);
        });
        socket?.on("MessageToRoom", (data:any) =>{
            console.log("chanelllsCHANELLSSS data", data, currUserData);
            // if (currUserData.user){

                if(currUserData.id != data.user.id){
                    console.log("IAMMMM HEEEEER, ", currUserData, data);
                    setUpdateChat(data);
                    // setTempo([...tempo, data]);
                }
            // }
        })
    } []

    useEffect(() => {
        console.log("IAMMMM HEEEEER, ", userData, updateChat);
        if (userData.user && updateChat.user) {
            if (userData.user.id === updateChat.user.id) {
                console.log("tste");
                setTempo([...tempo, updateChat]);
            }
        }
    }, [updateChat]);
    useEffect(() => {
        if(updateChat&& updateChat.user ){
            if(userData.id == updateChat.channelid){
            // console.log("chanelllsCHANELLSSS data", updateChat);
            // console.log("chanelllsCHANELLSSS curr", currUserData);
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
    // console.log("TEEEEEEMpo RENDERING",tempo)

    return <div className={`${windowHeight >= 1200 ? "h-[83%]" : windowHeight <= 800 ? "h-[70%]" : "h-[77%]"} overflow-y-scroll flex flex-col-reverse no-scrollbar`}>
        {!chanelType ? (<ul>
            {getChat.map((mes, id) => (
                <li key={id}>
                    <Message messages={mes} />
                </li>
            ))}
            {tempo.map((mes, id) => (
                <li key={id}>
                    <Message messages={mes} />
                </li>
            ))}
        </ul>)
            : (
                <ul>
                    {getChat.map((mes, id) => (
                        <li key={id}>
                            <MessageGroups messages={mes} />
                        </li>
                    ))}
                    {tempo.map((mes, id) => (
                        <li key={id}>
                            <MessageGroups messages={mes} />
                        </li>
                    ))}
                </ul>
            )}
    </div>
}

export default chatBox;