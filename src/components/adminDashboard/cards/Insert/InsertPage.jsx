import React, { useState } from 'react'
import SlidingTabs from '../../../../common/SlidingTabs'
import { motion } from 'framer-motion';
import { InsertAdmin } from './InsertAdmin';
import { InsertTeacher } from './TeacherInsert/InsertTeacher';
import { InsertStudent } from './InsertStudent';

const tabs = ['Admin', 'Teacher', 'Student'];

const InsertPage = () => {
    const [selected, setSelected] = useState(tabs[0]);

    const renderInsertionForm = () => {
        switch (selected) {
            case 'Admin':
                return <InsertAdmin/>;
            case 'Teacher':
                return <InsertTeacher/>
            case 'Student':
                return <InsertStudent/>
            default:
                return <></>
        }
    };

    return (
        <div className=' flex flex-col items-center w-full h-full'>
            {/* selection tab */}
            <motion.div 
            className=' flex flex-col sm:flex-row gap-y-3 items-center justify-between bg-slate-900 w-full max-w-[85rem] py-2 sm:py-3 md:py-4 px-2 sm:px-4 md:px-10 rounded-xl'
            initial={{y: -100}}
            animate={{y: 0}}>
                <div className=' text-white font-mavenPro md:text-[1.1rem] lg:text-[1.2rem] xl:text-[1.4rem] hidden sm:block'>
                    Whom do you want to insert?
                </div>

                <SlidingTabs
                    tabs={tabs}
                    selected={selected}
                    setSelected={setSelected}
                />
            </motion.div>

            <div className=' w-full md:w-[80%] max-w-[80rem] h-full flex flex-col items-center justify-center mt-24'>
                {renderInsertionForm()}
            </div>
        </div>
    )
}

export default InsertPage;
