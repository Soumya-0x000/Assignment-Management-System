import React, { useEffect, useState } from 'react';
import { 
    Modal, 
    ModalContent, 
    ModalHeader, 
    ModalBody, 
    ModalFooter, 
    Button, 
    Input, 
} from "@nextui-org/react";
import { MailIcon } from "../../icons/MailIcon";
import { MdAdminPanelSettings } from "react-icons/md";
import { BsPersonLinesFill } from "react-icons/bs";
import { BiSolidLock, BiSolidLockOpen  } from "react-icons/bi";
import { supabase } from '../../../../CreateClient';
import { TbListNumbers } from "react-icons/tb";

const Registtration = ({userType, isOpen, onOpen, onClose}) => {
    const [commonAttributes, setCommonAttributes] = useState({
        name: "", 
        email:"", 
        password: "",
    });
    const [studentRegisterData, setStudentRegisterData] = useState({
        usnId: "",
        dateOfBirth: "",
        semester: "",
    });
    const [isVisible, setIsVisible] = useState(false);
    const [isRegistered, setIsRegistered] = useState(false);
    const [users, setUsers] = useState([]);

    const toggleVisibility = () => setIsVisible(!isVisible);
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'name' || name === 'email' || name === 'password') {
            setCommonAttributes({
                ...commonAttributes,
                [name]: value
            });
        } else if (name === 'usnId' || name === 'dateOfBirth' || name === 'semester') {
            setStudentRegisterData({
                ...studentRegisterData,
                [name]: value
            });
        } 
    }

    const handleRegister = async (e) => {
        e.preventDefault();
    
        try {            
            if (userType === 'Student') {
                const { data, error } = await supabase.from('student').insert([
                    {
                        name: commonAttributes.name,
                        emailId: commonAttributes.email,
                        password: commonAttributes.password,
                        birthDate: studentRegisterData.dateOfBirth,
                        semester: studentRegisterData.semester,
                        usnId: studentRegisterData.usnId,
                    }
                ]);
    
                if (error) {
                    console.error('Error inserting data into student table:', error.message);
                } else {
                    console.log('Data inserted into student table:', data);
                    onClose();
                }
            } else if (userType === 'Teacher') {
                const { data, error } = await supabase.from('teacher').insert([
                    {
                        name: commonAttributes.name,
                        emailId: commonAttributes.email,
                        password: commonAttributes.password,
                    }
                ]);
    
                if (error) {
                    console.error('Error inserting data into teacher table:', error.message);
                } else {
                    console.log('Data inserted into teacher table:', data);
                    onClose();
                }
            }
            setIsRegistered(true)
        } catch (error) {
            console.error('An unexpected error occurred:', error);
        }
    };

    const trySupabase = async () => {
        const {data} = await supabase
            .from(userType.toLowerCase())
            .select('*')
        setUsers(data)
        console.log(data)
        setIsRegistered(false)
    }
    
    useEffect(() => {
        isRegistered && trySupabase();
    }, [isRegistered]);
    
    return (
        <Modal 
        backdrop="blur"
        isOpen={isOpen} 
        onClose={onClose}
        className="border-[1px] border-slate-300 absolute top-1/2 -translate-y-1/2"
        placement="top-center">
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1 text-xl mb-5">
                    Register as {userType}
                </ModalHeader>

                <ModalBody>
                    <Input
                        autoFocus
                        endContent={<BsPersonLinesFill className="text-[1.4rem] text-default-400 pointer-events-none flex-shrink-0" />}
                        label="Name"
                        type='text'
                        name="name"
                        value={commonAttributes.name}
                        onChange={handleChange}
                        required
                        variant="bordered"
                    />

                    <Input
                        endContent={<MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />}
                        label="Email"
                        type='email'
                        name="email"
                        value={commonAttributes.email}
                        onChange={handleChange}
                        required
                        variant="bordered"
                    />

                    <Input
                        label="Password"
                        name="password"
                        variant="bordered"
                        min={8}
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

                    {userType === 'Student' && ( <>
                        <Input
                            endContent={<MdAdminPanelSettings className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />}
                            label="USN ID"
                            type='text'
                            name="usnId"
                            value={studentRegisterData.usnId}
                            onChange={handleChange}
                            variant="bordered"
                            required
                        />

                        <Input
                            label="Date of Birth"
                            type='date'
                            name="dateOfBirth"
                            value={studentRegisterData.dateOfBirth}
                            onChange={handleChange}
                            required
                            variant="bordered"
                        />
                        
                        <Input 
                            endContent={<TbListNumbers className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />}
                            label="Semester"
                            min={1}
                            max={4}
                            type='number'
                            name="semester"
                            value={studentRegisterData.semester}
                            onChange={handleChange}
                            required
                            variant="bordered"
                        />
                    </>)}
                </ModalBody>

                <ModalFooter className="mt-10">
                    <Button color="danger" variant="flat" onClick={onClose}>
                        Close
                    </Button>

                    <Button className="bg-green-200 text-green-800" onClick={(e) => handleRegister(e)}>
                        Register
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

export default Registtration;
