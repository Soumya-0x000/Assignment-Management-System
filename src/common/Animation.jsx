import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { supabase } from "../CreateClient";
import { useNavigate } from "react-router-dom";
import { nameLogo } from "./customHooks";
import { CiLogout } from 'react-icons/ci';
import SlidingTabs from './SlidingTabs'

export const staggerVariants = {
    initial: {},
    animate: {
        transition: {
            staggerChildren: 0.09,
        },
    },
};

export const childVariants = {
    initial: { opacity: 0, y: 100, },
    animate: { opacity: 1, y: 0,  transition: {duration: .15}},
};

const wrapperVariants = {
    open: {
        scaleY: 1,
        transition: {
            when: "beforeChildren",
            staggerChildren: 0.1,
        },
    },
    closed: {
        scaleY: 0,
        transition: {
            when: "afterChildren",
            staggerChildren: 0.1,
        },
    },
};
  
const itemVariants = {
    open: {
        opacity: 1,
        y: 0,
        transition: {
            when: "beforeChildren",
        },
    },
    closed: {
        opacity: 0,
        y: -15,
        transition: {
            when: "afterChildren",
        },
    },
};
  
const actionIconVariants = {
    open: { scale: 1, y: 0 },
    closed: { scale: 0, y: -7 },
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

const AnimatedHamburgerButton = ({ hamburgerActive, setHamburgerActive }) => {
    return (   
        <button
        className="relative w-10 h-20 transition-colors"
        onClick={() => setHamburgerActive((pv) => !pv)}>
            <div className={`flex items-center justify-center flex-col gap-y-[.4rem] rounded-full w-9 h-9 transition-all cursor-pointer`}>
                <div className={`w-7 md:w-8 h-[2px] md:h-[3px] transition-all ${hamburgerActive ? 'rotate-45 translate-y-[5px]' : 'rotate-0'}  bg-blue-300`}/>
                <div className={`w-7 md:w-8 h-[2px] md:h-[3px] ${!hamburgerActive ? 'block' : 'hidden'} bg-blue-300 `}/>
                <div className={`w-7 md:w-8 h-[2px] md:h-[3px] bg-blue-300 ${hamburgerActive ? '-rotate-45 -translate-y-[4px]' : 'rotate-0'}  transition-all`}/>
            </div> 
        </button>
    );
};

const Option = ({ text, setIsDropdownOpen, setSelected, setHamburgerActive }) => {
    const handleClick = () => {
        setHamburgerActive(false)
        setIsDropdownOpen(false)
        setSelected(text)
    };
    
    return (
        <motion.li
        variants={itemVariants}
        className="flex items-center w-full gap-3 p-2 text-xs font-medium transition-colors rounded-md cursor-pointer whitespace-nowrap hover:bg-indigo-600 text-cyan-100 hover:text-indigo-100"
        onClick={handleClick}>
            <span className='text-[1rem] font-robotoMono'>{text}</span>
        </motion.li>
    );
};

const HamburgerMenu = ({ tabs, setSelected }) => {
    const [hamburgerActive, setHamburgerActive] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    return (
        <div className="relative block lg:hidden">
            <div onClick={() => setIsDropdownOpen((pv) => !pv)}>
                <AnimatedHamburgerButton
                    hamburgerActive={hamburgerActive}
                    setHamburgerActive={setHamburgerActive}
                />
            </div>

            <div className="absolute flex items-center justify-center -right-11">
                <motion.div animate={isDropdownOpen ? "open" : "closed"} className="relative">
                    <motion.ul
                    className="flex flex-col gap-2 p-2 rounded-lg bg-slate-900 shadow-xl absolute top-[120%] w-fit overflow-hidden z-30 ring-1 ring-blue-400"
                    initial={wrapperVariants.closed}
                    variants={wrapperVariants}
                    style={{ originY: "top", translateX: "-50%" }}>
                        {tabs.map((tab, indx) => (
                            <Option 
                                key={tab.val+indx}
                                setIsDropdownOpen={setIsDropdownOpen}
                                text={tab.name}
                                setSelected={setSelected}
                                setHamburgerActive={setHamburgerActive}
                            />
                        ))}
                    </motion.ul>
                </motion.div>
            </div>
        </div>
    )
}

export const NavigationActions = ({ navArr, selected, setSelected, personName }) => {
    const logOutOptions = [
        { text: 'LogOut', icon: <CiLogout /> },
    ];

    return (
        <div className='w-full bg-slate-900 rounded-lg flex items-center justify-between px-2 md:px-4 md:py-2'>
            <div className=' hidden md:block'>
                <SlidingTabs 
                    tabs={navArr.map((a) => a.name)} 
                    selected={selected} 
                    setSelected={setSelected} 
                />
            </div>
            
            <div className=' block md:hidden'>
                <HamburgerMenu 
                    tabs={navArr} 
                    selected={selected} 
                    setSelected={setSelected} 
                />
            </div>

            <FlyoutLink FlyoutContent={userActions} array={logOutOptions}>
                <div className='flex flex-col-reverse items-end gap-y-2 justify-center gap-x-3 cursor-pointer'>
                    <div className='h-14 w-14 bg-slate-700 text-green-300 flex items-center justify-center text-lg font-robotoMono tracking-wider rounded-full overflow-hidden'>
                        <div className='flex items-center justify-center gap-x-2'>
                            {nameLogo(personName)}
                        </div>
                    </div>
                </div>
            </FlyoutLink>
        </div>
    )
}