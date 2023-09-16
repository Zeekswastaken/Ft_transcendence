import react, { useEffect } from "react"
import Message from "./message"
import { Content } from './content';
import { useMyStore } from "./state";
import { useSocketContext } from '../socket';




function chatBox()
{
  const {socket} = useSocketContext();
  const {message, getChat, setGetChat, updateChat, setUpdateChat} = useMyStore();
  useEffect(()=>{

      console.log("incide Effect");
      socket?.on("OBJ", (data:any) => {
          console.log("it works");
          console.log(data);
          setUpdateChat(data);
        });
    }, [])

  console.log(getChat);
    return <div className= "h-[85%] max-sm:h-[70%] max-lg:h-[80%] max-xl:h-[80%] overflow-y-scroll flex flex-col-reverse no-scrollbar">
        <ul>
         {getChat.map( (mes, id) => (
            <li key={id}>
                {/* {console.log(mes)} */}
                <Message messages={mes}/>
            </li>
            ))}
        {updateChat ? (
            <li key={Math.random()}>
                <Message messages={updateChat} />
            </li>
            ) : null}
        </ul>
    </div>;
}

export default chatBox;