import { Tooltip } from '@nextui-org/react'
import React from 'react'
import { CgUserAdd } from 'react-icons/cg'
import { useDispatch } from 'react-redux'
import { setMode } from '../../../reduxStore/reducers/AdminDashboardSlice'

const InsertMembers = ({sidebarHold}) => {
    const dispatch = useDispatch();

    const handleInsertClicked = () => {
        dispatch(setMode('insert'))
    };

    return <>
        <Tooltip 
        placement={'right'}
        content={
            <div className=' text-green-900 font-bold w-full h-full'>
                Insert member
            </div>
        }
        color={"success"}
        closeDelay={0}>
            <button className={`${sidebarHold ? ' preLg:pl-5 justify-start' : ' justify-center preLg:group-hover:justify-start preLg:group-hover:pl-5'} rounded-lg text-xl bg-[#299b7ae8] w-full h-10 text-white flex items-center gap-x-2 md:gap-x-3 border-none outline-none`}
            onClick={handleInsertClicked}>
                <CgUserAdd className=' md:text-xl'/>
                <span className={`${sidebarHold ? 'block' : 'hidden group-hover:preLg:block'} text-[1rem] md:text-[1.2rem] font-onest`}>Insert</span>
            </button>
        </Tooltip>
    </>
}

export default InsertMembers