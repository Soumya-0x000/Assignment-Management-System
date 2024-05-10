import React, { useState } from 'react'
import { GrUserAdmin } from "react-icons/gr";
import { GrPowerShutdown } from "react-icons/gr";
import { supabase } from '../../CreateClient';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { TbHandStop } from "react-icons/tb";
import SelectStudent from './pages/SelectStudent';
import SelectTeachers from './pages/SelectTeachers';
import InsertMembers from './pages/InsertMembers';
import SearchMembers from './pages/SearchMembers';

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
                hover:min-w-[8rem] hover:max-w-[8rem]
                hover:md:min-w-[13rem] hover:md:max-w-[13rem]`
            } transition-all h-screen flex flex-col items-center justify-between bg-slate-800 rounded-tr-md hover:rounded-tr-lg rounded-br-md hover:rounded-br-lg relative group py-5 overflow-y-aut gap-y-8`}>
            {/* upper part, name and image */}
            <div className=' w-full flex flex-col md:gap-y-2 items-center justify-center'>
                {/* img */}
                <div className={`${!sidebarHold ? 'w-10 h-10 group-hover:w-[5rem] group-hover:md:w-[7rem] group-hover:h-12' : 'w-[5rem] md:w-[7rem] h-12'}  transition-all rounded-full bg-green-300 flex items-center justify-center`}>
                    <GrUserAdmin className={`${!sidebarHold ? ' scale-[1.3] group-hover:scale-[1.5] group-hover:md:scale-[2] delay-50' : ' scale-[1.5] md:scale-[2]'} transition-all`}/>
                </div>

                {/* name part */}
                <div className=' text-green-200 font-robotoMono text-lg'>
                    <p className={`${!sidebarHold ? 'block group-hover:hidden' : 'hidden'} mt-2`}>
                        {name.split(' ').map(a => [...a][0])}
                    </p>
                    
                    <p className={`${!sidebarHold ? 'hidden group-hover:block group-hover:mt-2 group-hover:' : 'block mt-2'} text-sm md:text-lg transition-all delay-1000 text-center`}>
                        <span className=' line-clamp-1'>
                            Soumya Sankar Das
                        </span>
                    </p>
                </div>
            </div>

            {/* operational buttons */}
            <div className=' w-full px-3 space-y-4'>
                <SelectTeachers sidebarHold={sidebarHold}/>
                
                <SelectStudent sidebarHold={sidebarHold}/>
                
                <InsertMembers sidebarHold={sidebarHold}/>
                
                <SearchMembers sidebarHold={sidebarHold}/>  
            </div>

            {/* logout */}
            <div className=' w-full px-3'>
                <button className={` h-10 w-full text-white rounded-lg transition-all flex items-center justify-center gap-x-2 bg-[#fc5050] text-lg`}
                onClick={handleSignOutToaster}>
                    <GrPowerShutdown/>
                    <span className={`${sidebarHold ? 'block' : 'hidden group-hover:block'}  text-[1.1rem] md:text-[1.2rem]`}>
                        LogOut
                    </span>
                </button>
            </div>

            <button className={` absolute top-1/2 -translate-y-1/2 -right-8 text-[1.5rem] w-fit px-1 text-green-300 active:text-red-400 bg-slate-800 rounded-tr-lg rounded-br-lg mt-3 py-2 transition-all ${sidebarHold ? 'block' : ' hidden group-hover:block'}`}
            onClick={() => setSidebarHold(!sidebarHold)}>
                <TbHandStop/>
            </button> 
        </div>
    )
}

export default Sidebar;
