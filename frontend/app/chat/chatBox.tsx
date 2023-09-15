import reaact from "react"
import Message from "./message"
import { Content } from './content';
import { useMyStore } from "./state";



function chatBox({content}: Content)
{
  const {message} = useMyStore();
  console.log(content);

    return <div className= "h-[85%] max-sm:h-[70%] max-lg:h-[80%] max-xl:h-[80%] overflow-y-scroll flex flex-col-reverse no-scrollbar">
        <ul>
         {/* {content.map( mes => ( */}
            <li
            >
                <Message message={message} />
            </li>
            {/* ))} */}

        </ul>
    </div>;
}

export default chatBox;