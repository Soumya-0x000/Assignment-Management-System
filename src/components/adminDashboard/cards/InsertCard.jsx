import React, { useState } from 'react'
import SlidingTabs from '../../../common/SlidingTabs'
import { motion } from 'framer-motion';
import { BsPersonLinesFill } from 'react-icons/bs';
import { MailIcon } from '../../landingPage/icons/MailIcon';
import { BiSolidLock, BiSolidLockOpen } from 'react-icons/bi';
import { Button, Input } from '@nextui-org/react';

const tabs = ['Admin', 'Teacher', 'Student'];

const InsertCard = () => {
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
        <div className=' flex flex-col items-center h-full'>
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

            <div className='w-[85rem] h-full flex flex-col items-center justify-center'>
                {renderInsertionForm()}
            </div>
        </div>
    )
}

export default InsertCard;

const InsertAdmin = () => {
    const [commonAttributes, setCommonAttributes] = useState({
        name: "", 
        email:"", 
        password: "",
    });
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => setIsVisible(!isVisible);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setCommonAttributes({
            ...commonAttributes,
            [name]: value
        });
    };

    return (
        <div className=' w-[70%] space-y-8'>
            <div className=' w-full flex flex-col items-center gap-y-4'>
                <Input
                    autoFocus
                    endContent={<BsPersonLinesFill className="text-[1.4rem] text-default-400 pointer-events-none flex-shrink-0" />}
                    label="Name"
                    type='text'
                    name="name"
                    className=' bg-slate-800'
                    value={commonAttributes.name}
                    onChange={handleChange}
                    required
                    variant="underlined"
                />

                <Input
                    endContent={<MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />}
                    label="Email"
                    type='email'
                    name="email"
                    className=' bg-slate-800'
                    value={commonAttributes.email}
                    onChange={handleChange}
                    required
                    variant="underlined"
                />

                <Input
                    label="Password"
                    name="password"
                    variant="underlined"
                    min={8}
                    className=' bg-slate-800'
                    value={commonAttributes.password}
                    onChange={handleChange}
                    endContent={
                        <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                            {isVisible ? (
                                <BiSolidLockOpen className="text-2xl text-default-400 pointer-events-none" />
                            ) : (
                                <BiSolidLock className="text-2xl text-default-400 pointer-events-none" />
                            )}
                        </button>
                    }
                    type={isVisible ? "text" : "password"}
                />
            </div>

            <div className=' w-full flex justify-between'>
                <Button className="bg-[#882424f6] text-[#ff8383] font-onest text-md tracking-wide">
                    Reset
                </Button>

                <Button className="bg-[#23fda2ed] text-green-800 font-bold font-onest text-md tracking-wide">
                    Submit
                </Button>
            </div>
        </div>
    )
};

const InsertTeacher = () => {
    return <>
        teacher
    </>
};

const InsertStudent = () => {
    return <>
        admin
    </>
};