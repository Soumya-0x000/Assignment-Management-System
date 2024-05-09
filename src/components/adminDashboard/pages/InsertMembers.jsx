import React from 'react'
import { CgUserAdd } from 'react-icons/cg'

const InsertMembers = ({sidebarHold}) => {
    return <>
        <button className=' rounded-lg text-xl bg-[#299b7ae8] w-full h-10 text-white flex items-center justify-center gap-x-3'>
            <CgUserAdd className=' text-2xl'/>
            <span className={`${sidebarHold ? 'block' : 'hidden group-hover:block'}`}>Insert</span>
        </button>
    </>
}

export default InsertMembers