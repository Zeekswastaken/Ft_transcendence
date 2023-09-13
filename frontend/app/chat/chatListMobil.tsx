import reaact from "react"
import Profile from './profile';
import FriendBar from './friendBar';

function chatListMobil() 
{
    return (
    <div className=" relative w-full lg:w-[400px] md:w-[300px] h-[100%] mx-3 p-1 backdrop-blur-lg"> {/* friends*/}
      <div>
        <ul className='flex flex-row overflow-x-auto whitespace-no-wrap space-x-4 no-scrollbar'>
            <Profile  name="elipsse" img="/OneVsBot.png" href="#" alt="test" online={true} />
            <Profile  name="elipsse" img="/OneVsBot.png" href="#" alt="test" online={true} />
            <Profile  name="elipsse" img="/Ellipse-3.png" href="#" alt="test" online={false} />
            <Profile  name="elipsse" img="/Ellipse.png" href="#" alt="test" online={true} />
            <Profile  name="elipsse" img="/OneVsBot.png" href="#" alt="test" online={false} />
            <Profile  name="elipsse" img="/OneVsBot.png" href="#" alt="test" online={false} />
            <Profile  name="elipsse" img="/OneVsBot.png" href="#" alt="test" online={true} />
            <Profile  name="elipsse" img="/OneVsBot.png" href="#" alt="test" online={false} />
        </ul>
      </div>
      <div className="relative w-full h-[95%] mt-2">
        <div className=" w-full h-full overflow-y-scroll no-scrollbar rounded-2xl">
          <ul className=" flex flex-col  whitespace-no-wrap space-y-2">
            <FriendBar />
            <FriendBar />
            <FriendBar />
            <FriendBar />
            <FriendBar />
            <FriendBar />
            <FriendBar />
            <FriendBar />
            <FriendBar />
            <FriendBar />
            <FriendBar />
            <FriendBar />
            <FriendBar />
            <FriendBar />
            <FriendBar />
            <FriendBar />
            <FriendBar />
            <FriendBar />
            <FriendBar />
            <FriendBar />
            <FriendBar />
            <FriendBar />
          </ul>
        </div>
      </div>
    </div>);
}

export default chatListMobil;
