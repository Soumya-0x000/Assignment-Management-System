import React from 'react'
import { TbUserSearch } from 'react-icons/tb'

const SearchMembers = ({sidebarHold}) => {
    return <>
        <button className=' rounded-lg text-xl bg-[#4646ffe8] w-full h-10 text-white flex items-center justify-center gap-x-3'>
            <TbUserSearch className=' text-2xl'/>
            <span className={`${sidebarHold ? 'block' : 'hidden group-hover:block'}`}>Search</span>
        </button>
    </>
}

export default SearchMembers