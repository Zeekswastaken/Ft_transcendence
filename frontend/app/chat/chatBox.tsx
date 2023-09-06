import reaact from "react"
import Message from "./message"
import { Content } from './content';


function chatBox({content}: Content)
{
    return <div className= "h-[85%] max-sm:h-[70%] max-lg:h-[80%] max-xl:h-[80%] overflow-y-scroll flex flex-col-reverse scrollbar-hide">
        <ul>
         {content.map( mes => (
            <li key={mes.id}>
                <Message message={mes} />
            </li>
            ))}

        </ul>
    </div>;
}

export default chatBox;