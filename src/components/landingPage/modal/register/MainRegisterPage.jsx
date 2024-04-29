import React, { useState } from 'react';
import { CgLogIn } from 'react-icons/cg';
import { FaGoogle } from 'react-icons/fa';
import { FiGithub } from 'react-icons/fi';
import { 
    Modal, 
    ModalContent, 
    ModalHeader, 
    ModalBody, 
    ModalFooter, 
    Button, 
    useDisclosure, 
    Input, 
    Link
} from "@nextui-org/react";
import Registration from './Registration';

const MainRegisterPage = ({userType}) => {
    const {isOpen, onOpen, onClose} = useDisclosure();

    return (
        <div className='flex flex-col gap-y-3 bg-[#b2b2b24b] p-2 rounded-md shadow-black shadow-md w-[66%]'>
            <button className='flex flex-wrap items-center gap-x-3 text-slate-200 bg-slate-800 rounded-md py-1.5 sm:py-2 pl-3 text-lg font-onest active:scale-110 transition-all'>
                <FaGoogle className='text-[16px] sm:text-xl'/>
                <span className='text-[14px] sm:text-[16px]'>Sign up with Google</span>
            </button>
            
            <button className='flex flex-wrap items-center gap-x-3 text-slate-200 bg-slate-800 rounded-md py-1.5 sm:py-2 pl-3 text-lg font-onest active:scale-110 transition-all'>
                <FiGithub className='text-[16px] sm:text-xl'/>
                <span className='text-[14px] sm:text-[16px]'>Sign up with Github</span>
            </button>

            <Button onPress={onOpen} className="flex flex-wrap items-center justify-start gap-x-3 text-slate-200 bg-slate-800 rounded-md py-1.5 sm:py-2 pl-2 text-lg font-onest active:scale-110 transition-all">
                <CgLogIn className='text-[19px] sm:text-2xl'/>
                <span className='text-[14px] sm:text-[16px]'>Sign up Manually</span>
            </Button>

            {userType !== 'Admin' && (  
                <Registration
                    userType={userType}
                    isOpen={isOpen}
                    onOpen={onOpen}
                    onClose={onClose}
                />
            )}
        </div>
    );
}

export default MainRegisterPage;
