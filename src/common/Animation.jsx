import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { supabase } from "../CreateClient";
import { useNavigate } from "react-router-dom";

export const staggerVariants = {
    initial: {},
    animate: {
        transition: {
            staggerChildren: 0.15,
        },
    },
};

export const childVariants = {
    initial: { opacity: 0, y: 200, },
    animate: { opacity: 1, y: 0,  transition: {duration: .3}},
};


export const FlyoutLink = ({ children, FlyoutContent, array }) => {
    const [open, setOpen] = useState(false);

    const showFlyout = FlyoutContent && open;
  
    return (
        <div
        className="relative w-fit h-fit"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}>
            <span className="relative text-violet-300 font-onest">
                {children}
            </span>

            <AnimatePresence>
                {showFlyout && (
                    <motion.div
                    className="absolute -right-[6rem] lg:-right-[8rem] top-[4.2rem] z-30"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 15 }}
                    style={{ translateX: "-50%" }}
                    transition={{ duration: 0.3, ease: "easeOut" }}>
                        <FlyoutContent selectedArray={array} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export const userActions = ({selectedArray}) => {
    const navigate = useNavigate();

    const handleAction = async(text) => {
        if (text === 'LogOut') {
            const { error } = await supabase.auth.signOut();
            navigate(`/`)
        }
    };

    return (
        <div className=" bg-gradient-to-b from-violet-600 to-indigo-600 rounded-lg py-2.5 lg:py-4 shadow-xl">
            {selectedArray.map((item, index) => (
                <button 
                onClick={() => handleAction(item.text)}
                className='w-[12rem] lg:w-[15rem] pl-4 xl:pl-6 no-underline flex items-center md:py-2 gap-x-3 hover:bg-gradient-to-l hover:from-violet-800 hover:to-indigo-800'
                key={item.text+index}>
                    <span className='text-violet-200 text-[1.2rem] xl:text-[1.3rem]'>
                        {item.icon}
                    </span>
                    
                    <span className='flex flex-wrap text-violet-200 font-bold font-robotoMono tracking-wider text-sm sm:text-md'>
                        {item.text}
                    </span>
                </button>
            ))}
        </div>
    );
};