import React from 'react'
import { GrUserAdmin } from "react-icons/gr";

const Sidebar = () => {
    const name = 'Soumya Sankar Das';
    return (
        <div className='min-w-[4rem] hover:min-w-[14rem] max-w-[4rem] hover:max-w-[14rem] transition-all h-screen overflow-auto flex items-center justify-center bg-slate-800 rounded-tr-md hover:rounded-tr-lg rounded-br-md hover:rounded-br-lg relative group'>
            <div className=' absolute top-0 pt-5 w-full flex flex-col gap-y-2 items-center justify-center'>
                <div className=' w-10 group-hover:w-[6rem] h-10 group-hover:h-12 transition-all rounded-full bg-green-300 flex items-center justify-center'>
                    <GrUserAdmin className=' group-hover:scale-[2] delay- 50 transition-all'/>
                </div>

                <div className=' line-clamp-1 text-green-200 font-robotoMono text-lg'>
                    <p className='hidden group-hover:block'>
                        {name}
                    </p>
                    
                    <p className='hidden group-hover:block'>
                        Soumya Sankar Das
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Sidebar;
