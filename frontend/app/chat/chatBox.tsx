// import react, { useEffect, useState } from "react"
// import Message from "./message"
// import MessageGroups from "./messageGroups"
// import { Content } from './content';
// import { useMyStore } from "./state";
// import { useSocketContext } from '../socket';
// import { channel } from "diagnostics_channel";




// function chatBox() {
//     const { socket } = useSocketContext();
//     const [windowHeight, setWindowHeight] = useState(window.innerHeight);
//     const { message, getChat, setGetChat, updateChat, setUpdateChat, tempo, setTempo, userData, currUserData, chanelType } = useMyStore();
//     useEffect(() => {
//         socket?.on("OBJ", (data: any) => {
//             console.log("hollla");
//             setUpdateChat(data);
//         });
        // socket?.on("MessageToRoom", (data:any) =>{
        //     // if (currUserData.user){

        //         if(currUserData.id != data.user.id){
        //             socket?.emit("isBlocked", {userID:currUserData.id, recipientID:data.user.id});
        //             socket?.on("isblocked", (bool:boolean)=>{
        //                 setUpdateChat({message:data.message, user:data.user, channelid:data.channelid,isBlocked:bool});
                        
        //             })
        //             // setTempo([...tempo, data]);
        //         }
        //     })
//         })
//     }, [])

//     useEffect(() => {
//         if (userData.user && updateChat.user) {
//             if (userData.user.id === updateChat.user.id) {
//                 console.log("tste");
//                 setTempo([...tempo, updateChat]);
//             }
//         }
//     }, [updateChat]);
//     useEffect(() => {
//         if(updateChat&& updateChat.user ){
//             if(userData.id == updateChat.channelid){
//             console.log("LOOOOOOOOOOOOOOOOOOOL");
//             // console.log("chanelllsCHANELLSSS curr", currUserData);
//             setTempo([...tempo, updateChat]);
//         }
//         }
//     }, [updateChat]);

//     useEffect(() => {
//         function handleResize() {
//             setWindowHeight(window.innerHeight);
//         }

//         window.addEventListener('resize', handleResize);

//         return () => {
//             window.removeEventListener('resize', handleResize);
//         };
//     }, []);
//     console.log("TEEEEEEMpo RENDERING",tempo)

//     return <div className={`${windowHeight >= 1200 ? "h-[83%]" : windowHeight <= 800 ? "h-[70%]" : "h-[77%]"} overflow-y-scroll flex flex-col-reverse no-scrollbar`}>
//         {!chanelType ? (<ul>
//             {getChat.map((mes, id) => (
//                 <li key={id}>
//                     <Message messages={mes} />
//                 </li>
//             ))}
//             {tempo.map((mes, id) => (
//                 <li key={id}>
//                     <Message messages={mes} />
//                 </li>
//             ))}
//         </ul>)
//             : (
//                 <ul>
//                     {getChat.map((mes, id) => (
//                         <li key={id}>
//                             <MessageGroups messages={mes} />
//                         </li>
//                     ))}
//                     {tempo.map((mes, id) => (
//                         <li key={id}>
//                             <MessageGroups messages={mes} />
//                         </li>
//                     ))}
//                 </ul>
//             )}
//     </div>
// }

// export default chatBox;

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
  
    // Cleanup previous listeners when the component unmounts or when socket changes.
    return () => {
      socket?.off("OBJ");
      socket?.off("MessageToRoom", handleMessageToRoom);
    };
  }, [socket, currUserData.id]);
  
    // if(currUserData && Object.keys(currUserData).length){
    // }
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