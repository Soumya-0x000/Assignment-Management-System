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
import { MailIcon } from "../../icons/MailIcon";
import { LockIcon } from "../../icons/LockIcon";
import { MdAdminPanelSettings } from "react-icons/md";
import { IoIosLock, IoIosUnlock } from "react-icons/io";

const MainRegister = ({userType}) => {
    const {isOpen, onOpen, onClose} = useDisclosure();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [usnId, setUsnId] = useState('');
    const [authCode, setAuthCode] = useState('');

    const handleRegister = () => {
        // Here you can perform any actions with the stored values, like sending them to an API
        console.log('Email:', email);
        console.log('Password:', password);
        console.log('USN ID:', usnId);
        console.log('Authentication Code:', authCode);

        // Close the modal after handling registration
        onClose();
    };

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

            <Modal 
                backdrop="blur"
                isOpen={isOpen} 
                onClose={onClose}
                className="border-[1px] border-slate-300 absolute top-1/2 -translate-y-1/2"
                placement="top-center"
            >
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1 text-xl mb-5">
                        Register as {userType}
                    </ModalHeader>

                    <ModalBody>
                        <Input
                            autoFocus
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            endContent={<MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />}
                            label="Email"
                            required
                            variant="bordered"
                        />

                        <Input
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            endContent={<LockIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />}
                            label="Password"
                            type="password"
                            variant="bordered"
                            required
                        />

                        {userType === 'Student' && (
                            <Input
                                value={usnId}
                                onChange={(e) => setUsnId(e.target.value)}
                                endContent={<MdAdminPanelSettings className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />}
                                label="USN ID"
                                variant="bordered"
                                required
                            />
                        )}
                        
                        {userType === 'Admin' && (
                            <Input
                                value={authCode}
                                onChange={(e) => setAuthCode(e.target.value)}
                                endContent={<MdAdminPanelSettings className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />}
                                label="Authentication code"
                                variant="bordered"
                                required
                            />
                        )}
                    </ModalBody>

                    <ModalFooter className="mt-10">
                        <Button color="danger" variant="flat" onClick={onClose}>
                            Close
                        </Button>

                        <Button className="bg-green-200 text-green-800" onClick={handleRegister}>
                            Register
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
}

export default MainRegister;
