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
            <button className=' rounded-lg text-xl bg-[#299b7ae8] w-full h-10 text-white flex items-center justify-center gap-x-2 md:gap-x-3 '
            onClick={handleInsertClicked}>
                <CgUserAdd className=' md:text-2xl'/>
                <span className={`${sidebarHold ? 'block' : 'hidden group-hover:preLg:block'} text-[1rem] md:text-[1.3rem]`}>Insert</span>
            </button>
        </Tooltip>
    </>
}

export default InsertMembers