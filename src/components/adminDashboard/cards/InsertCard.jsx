import React, { useState } from 'react'
import SlidingTabs from '../../../common/SlidingTabs'
import { motion } from 'framer-motion';

const tabs = ['Admin', 'Teacher', 'Student'];

const InsertCard = () => {
    const [selected, setSelected] = useState(tabs[0]);

    return (
        <div className=' flex flex-col items-center'>
            {/* selection tab */}
            <motion.div 
            className=' flex flex-col sm:flex-row gap-y-3 items-center justify-between bg-slate-900 w-full max-w-[85rem] py-3 md:py-4 px-3 md:px-10 rounded-md'
            initial={{y: -100}}
            animate={{y: 0}}>
                <div className=' text-white font-mavenPro text-[1.1rem] lg:text-[1.2rem] xl:text-[1.4rem]'>
                    Whom you want to insert?
                </div>

                <SlidingTabs
                    tabs={tabs}
                    selected={selected}
                    setSelected={setSelected}
                />
            </motion.div>

            
        </div>
    )
}

export default InsertCard;
