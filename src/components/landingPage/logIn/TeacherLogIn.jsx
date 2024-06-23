import React, { useEffect, useState } from "react";
import { 
    Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, 
    Button, useDisclosure, Checkbox, Input, Link
} from "@nextui-org/react";
import { MailIcon } from "../icons/MailIcon";
import { supabase } from "../../../CreateClient";
import { useNavigate } from "react-router-dom";
import { BiSolidLock, BiSolidLockOpen } from "react-icons/bi";
import toast from "react-hot-toast";

export default function TeacherLogIn() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const navigate = useNavigate();
    const [teacherLoginData, setTeacherLoginData] = useState({
        email: '',
        password: ''
    });
    const [isVisible, setIsVisible] = useState(false);
    const toggleVisibility = () => setIsVisible(!isVisible);

    useEffect(() => {
        localStorage.clear()
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTeacherLoginData({
            ...teacherLoginData,
            [name]: value
        });
    };

    const handleLogin = async () => {
        try {
            const { data, error } = await supabase
                .from('teachers')
                .select('*')
                .eq('emailId', teacherLoginData.email)
                .eq('password', teacherLoginData.password)
                .single();

            if (error) {
                console.error('Error querying database:', error.message);
                toast.error(`No teacher found with the provided credentials`, {
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff'
                    }
                });
                return;
            } else {
                setTeacherLoginData({
                    email: '',
                    password: ''
                });
                localStorage.setItem('teacherId', data.uniqId)
                navigate(`/teacherdashboard/${data.uniqId}`)
            }
        } catch (error) {
            console.error('An unexpected error occurred:', error.message);
            toast.error('An unexpected error occurred. Please try again', {
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff'
                }
            });
        }
        onClose();
    };

    const handleLoginToast = () => {
        toast.promise(handleLogin(), {
            loading: 'Logging in...',
            success: 'Logged in successfully...',
            error: 'Failed to log in...'
        }, {
            style: {
                borderRadius: '10px',
                background: '#333',
                color: '#fff'
            }
        })
    };

    return (
        <>
            <Button onPress={onOpen} className="bg-gray-900 font-bold font-oxanium tracking-wider text-green-300 sm:text-[17px] text-left rounded-md">
                Teacher
            </Button>

            <Modal 
            backdrop="blur"
            isOpen={isOpen} 
            onOpenChange={onClose}
            className="border-[1px] border-slate-300 absolute top-1/2 -translate-y-1/2"
            placement="top-center"
            onClose={onClose}>
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1 text-xl mb-5">
                        Log in as Teacher
                    </ModalHeader>

                    <ModalBody>
                        <Input
                            autoFocus
                            value={teacherLoginData.email}
                            type="email"
                            onChange={handleChange}
                            endContent={<MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />}
                            label="Email"
                            variant="bordered"
                            name='email'
                            required
                        />

                        <Input
                            label="Password"
                            name="password"
                            variant="bordered"
                            min={8}
                            value={teacherLoginData.password}
                            onChange={handleChange}
                            required
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
                    </ModalBody>

                    <ModalFooter className=" mt-10 font-robotoMono">
                        <Button color="danger" variant="flat" onPress={onClose}>
                            Close
                        </Button>

                        <Button className="bg-cyan-200 text-cyan-800" onPress={handleLoginToast}>
                            Sign in
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};
