import React, { useState } from 'react'
import { GrUserAdmin } from "react-icons/gr";
import { GrPowerShutdown } from "react-icons/gr";
import { supabase } from '../../CreateClient';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import SelectStudent from './pages/SelectStudent';
import SelectTeachers from './pages/SelectTeachers';
import InsertMembers from './pages/InsertMembers';
import SearchMembers from './pages/SearchMembers';
import { Tooltip } from '@nextui-org/react';
import { FaRegHandPaper } from "react-icons/fa";
import { FaRegHandRock } from "react-icons/fa";

const Sidebar = () => {
    const name = 'Soumya Sankar Das';
    const [sidebarHold, setSidebarHold] = useState(false);
    const navigate = useNavigate();

    const handleAdminSignOut = async() => {
        const { error } = await supabase.auth.signOut();
        navigate(`/`)
    };

    const handleSignOutToaster = () => {
        toast.promise(handleAdminSignOut(), {
            loading: "Logging out...",
            success: "Successfully logged out.",
            error: "Failed to logout."
        })
    };

    return (
        <div className={`${sidebarHold 
            ? `min-w-[8rem] max-w-[8rem] md:min-w-[13rem] md:max-w-[13rem]` 
            : `min-w-[4rem] max-w-[4rem] 
            md:min-w-[5rem] md:max-w-[5rem] 
            hover:preLg:min-w-[13rem] hover:preLg:max-w-[13rem]`
        } transition-all h-screen flex flex-col items-center justify-between bg-slate-800 rounded-tr-md hover:rounded-tr-lg rounded-br-md hover:rounded-br-lg relative group py-5 overflow-y-aut gap-y-8`}>
            {/* upper part, name and image */}
            <div className=' w-full flex flex-col md:gap-y-2 items-center justify-center relative'>
                {/* img */}
                <div className={`${!sidebarHold ? 'w-10 h-10 group-hover:preLg:w-[5rem] group-hover:preLg:md:w-[7rem] group-hover:preLg:h-12' : 'w-[5rem] md:w-[7rem] h-12'}  transition-all rounded-full bg-green-300 flex items-center justify-center`}>
                    <GrUserAdmin className={`${!sidebarHold ? ' scale-[1.3] group-hover:preLg:scale-[1.5] group-hover:lg:scale-[2] delay-50' : ' scale-[1.5] md:scale-[2]'} transition-all`}/>
                </div>

                {/* name part */}
                <div className=' text-green-200 font-robotoMono text-lg'>
                    <p className={`${!sidebarHold ? 'block group-hover:preLg:hidden' : 'hidden'} mt-2`}>
                        {name.split(' ').map(a => [...a][0])}
                    </p>
                    
                    <p className={`${!sidebarHold ? 'hidden group-hover:preLg:block group-hover:preLg:mt-2' : 'block mt-2'} text-sm md:text-lg transition-all delay-1000 text-center`}>
                        <span className=' line-clamp-1'>
                            Soumya Sankar Das
                        </span>
                    </p>
                </div>

                <button className={` absolute left-1/2 -bottom-12 -translate-x-1/2 text-[1.5rem] w-fit text-green-300 active:text-red-400 bg-slate-700 rounded-lg mt-3 p-2 transition-all ${sidebarHold ? 'block' : ' hidden group-hover:preLg:block'}`}
                onClick={() => setSidebarHold(!sidebarHold)}>
                    {sidebarHold ? <FaRegHandRock/> : <FaRegHandPaper/>}
                </button>
            </div>

            {/* operational buttons */}
            <div className=' w-full px-3 space-y-4'>
                <SelectTeachers sidebarHold={sidebarHold}/>
                <SelectStudent sidebarHold={sidebarHold}/>
                <InsertMembers sidebarHold={sidebarHold}/>
                <SearchMembers sidebarHold={sidebarHold}/>  
            </div>

            {/* logout */}
            <Tooltip 
            placement={'right'}
            content={'LogOut'}
            color='danger'
            closeDelay={0}>
                <div className=' w-full px-3'>
                    <button className={` h-10 w-full text-white rounded-lg transition-all flex items-center justify-center gap-x-2 bg-[#fc5050] text-lg`}
                    onClick={handleSignOutToaster}>
                        <GrPowerShutdown/>
                        <span className={`${sidebarHold ? 'block' : 'hidden group-hover:preLg:block'}  text-[1.1rem] md:text-[1.2rem]`}>
                            LogOut
                        </span>
                    </button>
                </div> 
            </Tooltip>
        </div>
    )
}

export default Sidebar;
