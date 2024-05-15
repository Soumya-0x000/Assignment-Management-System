import React from 'react'
import { useDispatch } from 'react-redux';
import { setMode } from '../../../reduxStore/reducers/AdminDashboardSlice';
import { Tooltip } from '@nextui-org/react';
import { FiHome } from "react-icons/fi";

const AdminHome = ({sidebarHold}) => {
    const dispatch = useDispatch();

    const handleInsertClicked = () => {
        dispatch(setMode('home'))
    };

    return <>
        <Tooltip 
        placement={'right'}
        content={'Home'}
        color={"warning"}
        closeDelay={0}>
            <button className={`${sidebarHold ? ' preLg:pl-5 justify-start' : ' justify-center preLg:group-hover:justify-start preLg:group-hover:pl-5'} rounded-lg text-xl bg-[#b77738] w-full h-10 text-white flex items-center gap-x-2 md:gap-x-3 border-none outline-none`}
            onClick={handleInsertClicked}>
                <FiHome className=' md:text-xl'/>
                <span className={`${sidebarHold ? 'block' : 'hidden group-hover:preLg:block'} text-[1rem] md:text-[1.2rem] font-onest`}>Home</span>
            </button>
        </Tooltip>
    </>
}

export default AdminHome