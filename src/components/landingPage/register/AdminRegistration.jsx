import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@nextui-org/react'
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { BsPersonLinesFill } from 'react-icons/bs';
import { CgLogIn } from 'react-icons/cg'
import { MailIcon } from '../icons/MailIcon';
import { BiSolidLock, BiSolidLockOpen } from 'react-icons/bi';
import { supabase } from '../../../CreateClient';
import { titleArr } from '../../../common/customHooks';

const AdminRegistration = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [adminSignUpData, setAdminSignUpData] = useState({
        title: "",
        name: "", 
        email:"", 
        password: "",
    });
    const [isVisible, setIsVisible] = useState(false);
    const inputFields = [
        { label: 'Name', name: 'name', type: 'text', icon: <BsPersonLinesFill /> },
        { label: 'Email', name: 'email', type: 'email', icon: <MailIcon /> },
        { label: 'Password', name: 'password', type: 'password', icon: isVisible ? <BiSolidLockOpen /> : <BiSolidLock /> }
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;

        setAdminSignUpData({
            ...adminSignUpData,
            [name]: value
        });
    };

    const handleDropDown = (name, val) => {
        setAdminSignUpData({
            ...adminSignUpData,
            [name]: val
        })
    };

    const handleReset = () => {
        setAdminSignUpData({
            title: "",
            name: "",
            email: "",
            password: ""
        });
    };

    const handleSignUp = async () => {
        try {
            const { data: tableInsertData, error: tableInsertError } = await supabase
                .from('pendingAdmin')
                .upsert({
                    title: adminSignUpData.title.trim(),
                    name: adminSignUpData.name.trim(), 
                    emailId: adminSignUpData.email.trim(), 
                    password: adminSignUpData.password.trim(),
                    createdAt: new Date().toISOString()
                }, { onConflict: ['emailId'] })

            if (tableInsertError) {
                toast.error(`Can't insert`, {
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    }
                })
            } else {
                toast.success(`Successfully inserted ${adminSignUpData.name} as Admin`, {
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    }
                });

                const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
                    email: adminSignUpData.email.trim(),
                    password: adminSignUpData.password.trim(),
                }, {
                    redirectTo: 'https://assignment-management-system-nine.vercel.app/' 
                });
                console.log(signUpData)

                if (signUpError) {
                    setTimeout(async() => {
                        const {data: delData, error: delError} = await supabase
                            .from('pendingAdmin')
                            .delete()
                            .eq('emailId', adminSignUpData.email.trim())
                    }, 600);
                    throw signUpError;    
                }
        
                handleReset()
            }
        } catch (error) {
            console.error(error.message);
            toast.error('Error occurred during creating admin', {
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                }
            })
        } finally {
            onClose();
        }
    };

    const handleSignUpToast = () => {
        const validate = adminSignUpData.name.trim().length > 4 &&
        adminSignUpData.email.trim().length > 6 &&
        adminSignUpData.email.includes('@') &&
        adminSignUpData.password.trim().length >= 6
        
        if (validate) {
            toast.promise(handleSignUp(), {
                loading: 'Creating admin',
                success: 'Now you need approval',
                error: 'Failed to sign up'
            }, {style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff'
                }
            })
        } else {
            toast('Fill up the form 🥸', {
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff'
                }
            })
        }
    };

    return (
        <div className='flex items-center bg-[#b2b2b24b] p-2 rounded-md shadow-black shadow-md min-w-[66%] max-w-[66%]'>
            <Button onPress={onOpen} className="flex flex-wrap items-center justify-start gap-x-3 text-slate-200 bg-slate-800 rounded-md pl-2 text-lg font-onest active:scale-110 transition-all w-full h-12">
                <CgLogIn className='text-[21px] sm:text-2xl'/>
                <span className='text-[16px]'>Sign up Manually</span>
            </Button>
            
            <Modal 
            backdrop="blur"
            isOpen={isOpen} 
            onOpenChange={onClose}
            className="border-[1px] bg-slate-800 border-slate-300 absolute top-1/2 -translate-y-1/2"
            placement="top-center"
            onClose={onClose}>
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1 text-xl mb-2 font-robotoMono text-white tracking-wider">
                        Sign up as Admin
                    </ModalHeader>

                    <ModalBody>
                        <div className=' w-full flex flex-col items-center gap-y-8'>
                            {inputFields.map((field, index) => (
                                <div key={index} className={` w-full transition-all ${field.name === 'name' && ' grid grid-cols-4 gap-x-4 gap-y-8'}`}>
                                    {field.name === 'name' && (
                                        <div className=" col-span-4 sm:col-span-1">
                                            <Dropdown className=' w-full'>
                                                <DropdownTrigger className=' w-full'>
                                                    <Button 
                                                    className={`border-2 rounded-xl px-4 focus:border-b-2 transition-colors focus:outline-none bg-slate-950 w-full h-[3.2rem] font-onest text-green-500 ${adminSignUpData.title ? 'border-green-500' : ''} focus:border-green-500 flex items-center justify-between text-md`}
                                                    variant="bordered">
                                                        {adminSignUpData.title ? adminSignUpData.title : 'Title'}
                                                    </Button>
                                                </DropdownTrigger>

                                                <DropdownMenu aria-label="Static Actions" className=' w-full bg-slate-900 text-green-500 rounded-xl '
                                                onAction={(key) => handleDropDown('title', key)}>
                                                    {titleArr.map(title => 
                                                        <DropdownItem key={title}>{title}</DropdownItem>
                                                    )}
                                                </DropdownMenu>
                                            </Dropdown>
                                        </div>
                                    )}

                                    <div className={`${field.name === 'name' && ' col-span-4 sm:col-span-3' } relative`}>
                                        <input
                                            autoFocus={index === 0}
                                            type={field.name === 'password' ? isVisible ? 'text' : 'password' : field.type}
                                            name={field.name}
                                            id={field.name}
                                            className={`border-2 rounded-xl pl-4 pr-12 focus:border-b-2 transition-colors focus:outline-none bg-slate-950 w-full h-[3.2rem] font-onest text-green-500 ${adminSignUpData[field.name] ? 'border-green-500' : ''} focus:border-green-500 focus:placeholder:-translate-x-7 transition-all peer`}
                                            value={adminSignUpData[field.name]}
                                            onChange={handleChange}
                                            min={field.name === 'password' ? 6 : 3}
                                            max={field.name === 'password' ? 16 : undefined}
                                            required={true}
                                        />

                                        <label
                                        htmlFor={field.name}
                                        className={`text-md text-green-500 pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 ${adminSignUpData[field.name] ? '-translate-y-[3.1rem] translate-x-[.5rem] text-sm' : ''} peer-focus:-translate-y-[3.1rem] peer-focus:translate-x-[.5rem] peer-focus:text-sm transition-all`}>
                                            {field.label}
                                        </label>

                                        <div className={`${field.name === 'password' && 'cursor-pointer hover:scale-110 active:scale-90'} text-lg text-default-400 absolute right-3 top-1/2 -translate-y-1/2 bg-slate-800 p-1 rounded-lg transition-all`}
                                        onClick={() => field.name === 'password' && setIsVisible(!isVisible)}>
                                            {field.icon}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ModalBody>

                    <ModalFooter className=" mt-4 flex flex-col gap-y-3">
                        <Button className=' bg-yellow-700 text-yellow-300 font-onest text-lg tracking-wide'  onPress={onClose}>
                            Close
                        </Button>

                        <div className=' w-full space-x-2 flex justify-between'>
                            <Button className=" font-onest text-md tracking-wide"
                            color='danger'
                            onClick={handleReset}>
                                Reset
                            </Button>

                            <Button 
                            className="bg-[#23fda2ed] text-green-800 font-bold font-onest text-md tracking-wide"
                            onPress={handleSignUpToast}>
                                Sign Up
                            </Button>
                        </div>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    )
}

export default AdminRegistration
