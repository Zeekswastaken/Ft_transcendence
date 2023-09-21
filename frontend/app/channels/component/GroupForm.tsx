import React from 'react'

interface searchGroupsStateProps
{
    search: string;
    handleOnChangeSearch: (entredSearch :any) => void;
    handleOnClickSearch: (entredSearch :any) => void;
}

const GroupFrom = ({handleOnChangeSearch, handleOnClickSearch, search}: searchGroupsStateProps) => {
    return (
        <div>
            <form>
                <div className="relative flex items-center">
                    <span className="absolute inset-y-0 left-2 flex items-center">
                    <button type="submit" className="p-1 focus:outline-none focus:shadow-outline ">
                        {search.length  ? <p onClick={handleOnClickSearch}  className=' text-[20px] text-gray-500'></p>
                                        :   <img onClick={(e) => {e.preventDefault()}} src="/searchIcon.svg" width={20} height={20} alt="search" className=""/>}
                    </button>
                    </span>
                    <input autoComplete='off'  onChange={handleOnChangeSearch} value={search} type="search" className=" border-transparent focus:border-transparent focus:ring-0 w-[150px] h-[35px] sm:h-[50px] py-2  text-sm text-[#6E4778] placeholder-[#6E4778] bg-[#411742]  rounded-xl pl-10 focus:outline-none focus:bg-primary-dark-500 focus:text-primary-white-200" placeholder="channel" />
                </div>
            </form>
        </div> 
    );
}

export default GroupFrom;