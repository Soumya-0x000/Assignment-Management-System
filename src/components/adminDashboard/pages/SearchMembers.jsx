import { Tooltip } from '@nextui-org/react'
import React from 'react'
import { TbUserSearch } from 'react-icons/tb'
import { useDispatch } from 'react-redux';
import { setMode } from '../../../reduxStore/reducers/AdminDashboardSlice';

const SearchMembers = ({sidebarHold}) => {
    const dispatch = useDispatch();

    const handleSearchClicked = () => {
        dispatch(setMode('search'))
    };

    return <>
        <Tooltip 
        placement={'right'}
        content={'Search member'}
        color='primary'
        closeDelay={0}>
            <button className={`${sidebarHold ? ' preLg:pl-5 justify-start' : ' justify-center preLg:group-hover:justify-start preLg:group-hover:pl-5'} rounded-lg text-xl bg-[#4646ffe8] w-full h-10 text-white flex items-center gap-x-2 md:gap-x-3 border-none outline-none`}
            onClick={handleSearchClicked}>
                <TbUserSearch className=' md:text-xl'/>
                <span className={`${sidebarHold ? 'block' : 'hidden group-hover:preLg:block'} text-[1rem] md:text-[1.2rem] font-onest`}>Search</span>
            </button>
        </Tooltip>
    </>
}

export default SearchMembers