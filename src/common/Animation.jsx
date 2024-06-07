import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { supabase } from "../CreateClient";
import { useNavigate } from "react-router-dom";
import { formatDate, nameLogo } from "./customHooks";
import { CiLogout } from 'react-icons/ci';
import SlidingTabs from './SlidingTabs'
import { CgUserRemove } from "react-icons/cg";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

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

export const FlyoutLink = ({ children, FlyoutContent, array, userMode, userId }) => {
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

            <div className=" absolute right-0 lg:-right-[8rem] ">
                <AnimatePresence>
                    {showFlyout && (
                        <motion.div
                        className=" z-30 pt-4"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 15 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}>
                            <FlyoutContent selectedArray={array} userMode={userMode} userId={userId}/>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export const userActions = ({selectedArray, userMode, userId}) => {
    const navigate = useNavigate();
    const {isOpen, onOpen, onClose} = useDisclosure();
    const { teacherAssignClassDetails } = useSelector(state => state.adminDashboard)

    const handleAction = async(text) => {
        switch (text) {
            case 'LogOut':
                const { error } = await supabase.auth.signOut();
                navigate(`/`)
                break;
            case 'Delete account':
                onOpen();
                console.log(text)
                break;
            default:
                break;
        }
    };

    const handelAccDel = () => {
        switch (userMode) {
            case 'admin':
                toast.promise(adminDelete(), {
                    loading: 'Removing admin...',
                    success: 'Admin deleted successfully!',
                    error: 'Error deleting admin!',
                }, {style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    }
                });
                break;

            case 'teachers':
                toast.promise(teacherDelete(), {
                    loading: 'Removing teacher...',
                    success: 'Teacher deleted successfully!',
                    error: 'Error deleting teacher!',
                }, {style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    }
                });
                break;
                
            default:
                break;
        }
    };

    const adminDelete = async() => {
        try {
            const {data: adminDelData, error: adminDelError} = await supabase
                .from('admin')
                .delete()
                .eq('uniqId', userId);
            
            if (adminDelError) {
                console.log('Admin not deleted!', adminDelError);
                toast.error('Admin not deleted!', {
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    }
                });
                return;
            }

            if (adminDelData) {
                console.log('Admin deleted successfully!', adminDelData);
                toast.success('Admin deleted successfully!', {
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    }
                });
            }
            
            navigate('/');
        } catch (error) {
            console.log('Error is deleting admin!', error);
            toast.error('Error occurred during admin deletion!', {
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                }
            });
        }
    };

    const teacherDelete = async() => {
        try {
            const {data: teacherDelData, error: teacherDelError} = await supabase
                .from('teachers')
                .delete()
                .eq('uniqId', userId);
            
            if (teacherDelError) {
                console.log('Teacher not deleted!', teacherDelError);
                toast.error('Teacher not deleted!', {
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    }
                });
            } else {
                teacherAssignClassDetails.dept.map(async(department) => {
                    const { data: assignmentEntryDelData, error: assignmentEntryDelError } = await supabase
                        .from(`${department}assignments`)
                        .delete()
                        .eq('uniqId', userId);

                    if (assignmentEntryDelError) {
                        console.log('Assignment entry not deleted!', assignmentEntryDelError);
                        toast.error(`${department} Assignment entry not deleted!`, {
                            style: {
                                borderRadius: '10px',
                                background: '#333',
                                color: '#fff',
                            }
                        });
                    }
                })
            }

            navigate('/');
        } catch (error) {
            console.log('Error is deleting teacher!', error);
            toast.error('Error occurred during teacher deletion!', {
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                }
            });
        }
    };

    return (
        <div className=" bg-gradient-to-b from-violet-600 to-indigo-600 rounded-lg overflow-hidden shadow-xl">
            {selectedArray.map((item, index) => (
                <button 
                onClick={() => handleAction(item.text)}
                className='w-[12rem] lg:w-[15rem] pl-4 xl:pl-6 no-underline flex items-center py-3 gap-x-3 hover:bg-gradient-to-l hover:from-violet-800 hover:to-indigo-800'
                key={item.text+index}>
                    <span className='text-violet-200 text-[1.2rem] xl:text-[1.3rem]'>
                        {item.icon}
                    </span>
                    
                    <span className='flex flex-wrap text-violet-200 font-bold font-robotoMono tracking-wider text-sm sm:text-md'>
                        {item.text}
                    </span>
                </button>
            ))}

            <Modal backdrop={'blur'} isOpen={isOpen} onClose={onClose} className=" bg-slate-600">
                <ModalContent>
                {(onClose) => (<>
                    <ModalHeader className="flex flex-col gap-1 text-slate-200 font-robotoMono">You want to remove your account?</ModalHeader>
                    
                    <ModalBody className=" font-montserrat bg-slate-800 rounded-lg p-3 mx-3 text-sm md:text-md">
                        <p className="text-slate-200">This action is permanent and cannot be undone.</p>

                        <p className="text-slate-200">All of your details will be removed from everywhere.</p>
                    </ModalBody>

                    <ModalFooter>
                        <Button 
                        color="danger" className=" font-robotoMono text-md text-white"
                        variant="shadow" onPress={onClose}>
                            Close
                        </Button>

                        <Button 
                        color="success" className=" font-robotoMono text-md text-white bg-green-600"
                        variant="shadow" onPress={onClose}
                        onClick={handelAccDel}>
                            Remove
                        </Button>
                    </ModalFooter>
                </>)}
                </ModalContent>
            </Modal>
        </div>
    );
};

const AnimatedHamburgerButton = ({ hamburgerActive, setHamburgerActive }) => {
    return (   
        <button
        className="relative w-10 h-20 transition-colors"
        onClick={() => setHamburgerActive((pv) => !pv)}>
            <div className={`flex items-center justify-center flex-col gap-y-[.4rem] rounded-full w-9 h-9 transition-all cursor-pointer`}>
                <div className={`w-6 md:w-8 h-[2px] md:h-[3px] transition-all ${hamburgerActive ? 'rotate-45 translate-y-[8px]' : 'rotate-0'}  bg-blue-300`}/>
                <div className={`w-6 md:w-8 h-[2px] md:h-[3px] ${!hamburgerActive ? 'block' : 'hidden'} bg-blue-300 `}/>
                <div className={`w-6 md:w-8 h-[2px] md:h-[3px] bg-blue-300 ${hamburgerActive ? '-rotate-45' : 'rotate-0'}  transition-all`}/>
            </div> 
        </button>
    );
};

const Option = ({ text, setIsDropdownOpen, setSelected, setHamburgerActive, selected }) => {
    const handleClick = () => {
        setHamburgerActive(false)
        setIsDropdownOpen(false)
        setSelected(text)
    };
    
    return (
        <motion.li
        variants={itemVariants}
        className={`flex items-center w-full gap-3 p-2 text-xs font-medium transition-colors rounded-md cursor-pointer whitespace-nowrap hover:bg-indigo-600 text-cyan-100 hover:text-indigo-100 ${selected === text ? ' bg-slate-700' : ''}`}
        onClick={handleClick}>
            <span className='text-[1rem] font-robotoMono'>{text}</span>
        </motion.li>
    );
};

const HamburgerMenu = ({ tabs, setSelected, selected }) => {
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
                    className="flex flex-col gap-2 p-2 rounded-lg bg-slate-900 shadow-xl absolute top-[120%] overflow-hidden z-30 ring-1 w-[11rem] ring-blue-400"
                    initial={wrapperVariants.closed}
                    variants={wrapperVariants}
                    style={{ originY: "top", translateX: "-50%" }}>
                        {tabs.map((tab, indx) => (
                            <Option 
                                key={tab.val+indx}
                                setIsDropdownOpen={setIsDropdownOpen}
                                text={tab.name}
                                selected={selected}
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

export const NavigationActions = ({ 
    navArr, 
    selected, 
    setSelected, 
    personName, 
    userMode, 
    userId 
}) => {
    const logOutOptions = [
        { text: 'LogOut', icon: <CiLogout /> },
        { text: 'Delete account', icon: <CgUserRemove /> },
    ];

    return (
        <div className='w-full bg-slate-900 rounded-lg flex items-center justify-between px-2 md:px-4 md:h-20 h-16'>
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

            <FlyoutLink 
            FlyoutContent={userActions} 
            userMode={userMode} 
            userId={userId} 
            array={logOutOptions}>
                <div className='cursor-pointer aspect-square w-11 md:w-14 bg-slate-700 text-green-300 flex items-center justify-center text-md md:text-lg font-robotoMono tracking-wider rounded-full overflow-hidden'>
                    <div className='flex items-center justify-center gap-x-2'>
                        {nameLogo(personName)}
                    </div>
                </div>
            </FlyoutLink>
        </div>
    )
}




const ShiftingCountdown = ({ date }) => {
    // const COUNTDOWN_FROM = formatDate(date);
    const [COUNTDOWN_FROM, setCOUNTDOWN_FROM] = useState('');
    useEffect(() => {
        setCOUNTDOWN_FROM(formatDate(date));
    }, []);
    console.log(COUNTDOWN_FROM)
    
    const SECOND = 1000;
    const MINUTE = SECOND * 60;
    const HOUR = MINUTE * 60;
    const DAY = HOUR * 24;

    const intervalRef = useRef(null);

    const [remaining, setRemaining] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    useEffect(() => {
        intervalRef.current = setInterval(handleCountdown, 1000);

        return () => clearInterval(intervalRef.current || undefined);
    }, []);

    const handleCountdown = () => {
        const end = new Date(COUNTDOWN_FROM);
        const now = new Date();
        const distance = +end - +now;

        const days = Math.floor(distance / DAY);
        const hours = Math.floor((distance % DAY) / HOUR);
        const minutes = Math.floor((distance % HOUR) / MINUTE);
        const seconds = Math.floor((distance % MINUTE) / SECOND);

        setRemaining({
            days,
            hours,
            minutes,
            seconds,
        });
    };

    return (
        <div className="p-4 bg-gradient-to-br from-violet-600 to-indigo-600">
            <div className="w-full max-w-5xl mx-auto flex items-center bg-white">
                <CountdownItem num={remaining.days} text="days" />
                <CountdownItem num={remaining.hours} text="hours" />
                <CountdownItem num={remaining.minutes} text="minutes" />
                <CountdownItem num={remaining.seconds} text="seconds" />
            </div>
        </div>
    );
};

export const CountdownItem = ({ num, text }) => {
    return (
        <div className="font-mono w-1/4 h-24 md:h-36 flex flex-col gap-1 md:gap-2 items-center justify-center border-r-[1px] border-slate-200">
            <div className="w-full text-center relative overflow-hidden">
                <AnimatePresence mode="popLayout">
                    <motion.span
                    key={num}
                    initial={{ y: "100%" }}
                    animate={{ y: "0%" }}
                    exit={{ y: "-100%" }}
                    className="block text-2xl md:text-4xl lg:text-6xl xl:text-7xl text-black font-medium"
                    transition={{ ease: "backIn", duration: 0.75 }}>
                        {num}
                    </motion.span>
                </AnimatePresence>
            </div>

            <span className="text-xs md:text-sm lg:text-base font-light text-slate-500">
                {text}
            </span>
        </div>
    );
};

export default ShiftingCountdown;