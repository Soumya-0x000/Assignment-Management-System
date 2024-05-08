import { Button } from '@nextui-org/react';
import React, { useState } from 'react'
import { GrUserAdmin } from "react-icons/gr";
import { GrPowerShutdown } from "react-icons/gr";
import { supabase } from '../../CreateClient';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
    const name = 'Soumya Sankar Das';
    const [sidebarHold, setSidebarHold] = useState(false);
    const [showFname, setShowFname] = useState(false)
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

    return <>
        <Toaster/>
        
        <div className={`${sidebarHold ? 'min-w-[14rem] max-w-[14rem]' : 'min-w-[5rem] hover:min-w-[14rem] max-w-[5rem] hover:max-w-[14rem]'} transition-all h-screen overflow-auto flex flex-col items-center justify-between bg-slate-800 rounded-tr-md hover:rounded-tr-lg rounded-br-md hover:rounded-br-lg relative group py-5`}>
            <div className=' w-full flex flex-col gap-y-2 items-center justify-center'>
                <div className={`${!sidebarHold ? 'w-10 group-hover:w-[7rem] h-10 group-hover:h-12' : 'w-[7rem] h-12'}  transition-all rounded-full bg-green-300 flex items-center justify-center`}>
                    <GrUserAdmin className={`${!sidebarHold ? ' group-hover:scale-[2] delay-50' : 'scale-[2]'} transition-all`}/>
                </div>

                <div className=' text-green-200 font-robotoMono text-lg'>
                    <p className={`${!sidebarHold ? 'block group-hover:hidden' : 'hidden'}`}>
                        {name.split(' ').map(a => [...a][0])}
                    </p>
                    
                    <p className={`${!sidebarHold ? 'hidden group-hover:block group-hover:mt-4 group-hover:' : 'block mt-4'} transition-all delay-1000`}>
                        <span className=' line-clamp-1'>
                            Soumya Sankar Das
                        </span>
                    </p>

                    <button className={`${!sidebarHold ? 'hidden group-hover:block' : 'block'} text-[1.3rem] w-full bg-slate-600 rounded-lg mt-3 py-2 transition-all`}
                    onClick={() => setSidebarHold(!sidebarHold)}>
                        Hold
                    </button>
                </div>
            </div>

            <div>

            </div>

            <div className=' w-full px-1'>
                <button className={`${sidebarHold ? 'h-10' : 'h-8 group-hover:h-10'} w-full text-white rounded-lg transition-all flex items-center justify-center gap-x-2 bg-[#fc5050] text-lg`}
                onClick={handleSignOutToaster}>
                    <GrPowerShutdown/>
                    <span className={`${sidebarHold ? 'block' : 'hidden group-hover:block'}`}>
                        LogOut
                    </span>
                </button>
            </div>
        </div>
    </>;
}

export default Sidebar;
