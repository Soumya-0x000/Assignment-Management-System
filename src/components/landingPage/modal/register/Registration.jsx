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
import { SiGoogleclassroom } from "react-icons/si";

const Registration = ({userType, isOpen, onOpen, onClose}) => {
    const [commonAttributes, setCommonAttributes] = useState({
        name: "", 
        email:"", 
        password: "",
    });
    const [studentRegisterData, setStudentRegisterData] = useState({
        usnId: "",
        dateOfBirth: "",
        semester: "",
        dept: "",
    });
    const [tableName, setTableName] = useState('studentsSem');
    const [isVisible, setIsVisible] = useState(false);
    const [isExist, setIsExist] = useState(false);
    const [users, setUsers] = useState([]);

    const toggleVisibility = () => setIsVisible(!isVisible);
    
    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'name' || name === 'email' || name === 'password') {
            setCommonAttributes({
                ...commonAttributes,
                [name]: value
            });
        } else {
            setStudentRegisterData({
                ...studentRegisterData,
                [name]: value
            });
        } 
    }

    const handleRegister = async (e) => {
        e.preventDefault();
    
        try {
            const { data, error } = await supabase
                .from(tableName)
                .select('*')
                .eq('emailId', commonAttributes.email)
                .eq('usnId', studentRegisterData.usnId);
    
            if (error) {
                console.error('Error fetching data:', error.message);
                return;
            }
    
            if (data.length > 0) {
                window.alert('USN ID with provided email already exists');
                return;
            }
    
            if (userType === 'Student') {
                const { data, error } = await supabase.from(tableName).insert([
                    {
                        name: commonAttributes.name,
                        emailId: commonAttributes.email,
                        password: commonAttributes.password,
                        birthDate: studentRegisterData.dateOfBirth,
                        semester: studentRegisterData.semester,
                        usnId: studentRegisterData.usnId,
                        department: studentRegisterData.dept.toLowerCase()
                    }
                ]);
    
                if (error) {
                    console.error('Error inserting data into student table:', error.message);
                } else {
                    setCommonAttributes({
                        name: "", 
                        email:"", 
                        password: "",
                    })
                    setStudentRegisterData({
                        usnId: "",
                        dateOfBirth: "",
                        semester: "",
                        dept: "",
                    })
                    onClose();
                }
            } else if (userType === 'Teacher') {
                const existingTeacher = users.find(user => user.emailId === commonAttributes.email || user.name === commonAttributes.name);
                if (existingTeacher) {
                    console.error('Email already exists in the database');
                    return;
                }
    
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
                    onClose();
                }
            }
        } catch (error) {
            console.error('An unexpected error occurred:', error);
        }
    
        onClose();
    };
    
    useEffect(() => {
        setTableName(prevTableName => 'studentsSem' + studentRegisterData.semester);
    }, [studentRegisterData.semester]);
    
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

                    {/* {userType === 'Student' && ( <> */}
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
                            endContent={<SiGoogleclassroom className="text-xl text-default-400 pointer-events-none flex-shrink-0" />}
                            label="Department"
                            type='text'
                            name="dept"
                            value={studentRegisterData.dept}
                            onChange={handleChange}
                            variant="bordered"
                            required
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
                    {/* </>)} */}
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

export default Registration;
