import React, { useEffect, useState } from 'react';
import { 
    Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, 
    Button, Input,
    Dropdown, DropdownTrigger, DropdownMenu, DropdownItem
} from "@nextui-org/react";
// import { MailIcon } from "../icons/MailIcon";
import { MdAdminPanelSettings } from "react-icons/md";
import { BsPersonLinesFill } from "react-icons/bs";
// import { BiSolidLock, BiSolidLockOpen  } from "react-icons/bi";
import { supabase } from '../../../CreateClient';
import { TbListNumbers } from "react-icons/tb";
import { SiGoogleclassroom } from "react-icons/si";
import { formatSemester } from '../../../common/customHooks';
import toast from 'react-hot-toast';
import { FaCalendarAlt } from "react-icons/fa";
import { GoNumber } from "react-icons/go";

const StudentRegistration = ({userType, isOpen, onOpen, onClose}) => {
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
        rollNo: ''
    });
    const [tableName, setTableName] = useState('studentsSem');
    const [isVisible, setIsVisible] = useState(false);

    // const toggleVisibility = () => setIsVisible(!isVisible);
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log(name)

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
    };

    const handleDropDown = (name, val) => {
        setStudentRegisterData({
            ...studentRegisterData,
            [name]: val
        })
    };

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
                toast.error('User already exists...');
                return;
            }
    
            if (userType === 'Student') {
                const { data, error } = await supabase
                    .from(tableName)
                    .insert([{
                        name: commonAttributes.name,
                        // emailId: commonAttributes.email,
                        // password: commonAttributes.password,
                        birthDate: studentRegisterData.dateOfBirth,
                        semester: studentRegisterData.semester,
                        usnId: studentRegisterData.usnId,
                        department: studentRegisterData.dept,
                        rollNo: studentRegisterData.rollNo
                    }]);
    
                if (error) {
                    console.error('Error inserting data into student table:', error.message);
                } else {
                    handleReset()
                    onClose();
                }
            }
        } catch (error) {
            console.error('An unexpected error occurred:', error);
        } finally {
            setIsVisible(false);
            onClose();
        }
    };

    const handleReset = () => {
        setCommonAttributes({name: "", email:"", password: ""});
        setStudentRegisterData({usnId: "", dateOfBirth: "", semester: "", dept: "", 'Roll no': ""});
        setIsVisible(false);
    };
    
    useEffect(() => {
        setTableName(prevTableName => 'studentsSem' + studentRegisterData.semester);
    }, [studentRegisterData.semester]);
    
    const handleRegisterToast = (e) => {
        toast.promise(handleRegister(e), {
            loading: 'Registering...',
            success: 'Successfully Registered',
            error: 'Failed to Register',
        }, {style: {
                borderRadius: '10px',
                background: '#333',
                color: '#fff',
            }
        })
    };

    return (
        <Modal 
        backdrop="blur"
        isOpen={isOpen} 
        onClose={onClose}
        className=" border-slate-300 absolute top-1/2 -translate-y-1/2"
        placement="top-center">
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1 text-xl mb-5 font-robotoMono">
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

                    {/* <Input
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
                    /> */}

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
                        endContent={<FaCalendarAlt className="text-xl text-default-400 pointer-events-none flex-shrink-0" />}
                        type='date'
                        name="dateOfBirth"
                        value={studentRegisterData.dateOfBirth}
                        onChange={handleChange}
                        required
                        variant="bordered"
                    />
                    
                    <Dropdown>
                        <DropdownTrigger>
                            <Button 
                            endContent={<SiGoogleclassroom className="text-[1.25rem] text-default-400 pointer-events-none flex-shrink-0" />}
                            className={`h-14 border-gray-200 rounded-xl py-3 pl-2.5 pr-3 ${studentRegisterData.dept ? 'text-black' : 'text-gray-500'} text-[14px] active:border-gray-200 outline-none active:outline-none hover:border-gray-400 flex items-end justify-between`}
                            variant="bordered">
                                {studentRegisterData.dept ? studentRegisterData.dept : 'Select Department'}
                            </Button>
                        </DropdownTrigger>

                        <DropdownMenu aria-label="Static Actions"
                        onAction={(key) => handleDropDown('dept', key)}>
                            <DropdownItem key={'MCA'}>MCA</DropdownItem>
                            <DropdownItem key={'MSc'}>MSc</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>

                    <Dropdown>
                        <DropdownTrigger>
                            <Button 
                            endContent={<TbListNumbers className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />}
                            className={`h-14 border-gray-200 rounded-xl py-3 pl-2.5 pr-3 ${studentRegisterData.semester ? 'text-black' : 'text-gray-500'} text-[14px] active:border-gray-200 outline-none active:outline-none hover:border-gray-400 flex items-end justify-between`}
                            variant="bordered">
                                {studentRegisterData.semester ? formatSemester(studentRegisterData.semester) : 'Select semester'}
                            </Button>
                        </DropdownTrigger>

                        <DropdownMenu aria-label="Static Actions"
                        onAction={(key) => handleDropDown('semester', key)}>
                            {[1, 2, 3, 4].map(item => (
                                <DropdownItem key={item}>{formatSemester(`${item}`)}</DropdownItem>
                            ))}
                        </DropdownMenu>
                    </Dropdown>

                    <Input
                        endContent={<GoNumber className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />}
                        label="Full roll no"
                        type='text'
                        name="rollNo"
                        value={studentRegisterData.rollNo}
                        onChange={handleChange}
                        maxLength={2}
                        variant="bordered"
                        required
                    />
                </ModalBody>

                <ModalFooter className="mt-10 flex items-center justify-between">
                    <div>
                        <Button color="secondary" variant="flat" onClick={handleReset}>
                            Reset
                        </Button>
                    </div>

                    <div className=' space-x-2'>
                        <Button color="danger" variant="flat" onClick={onClose}>
                            Close
                        </Button>

                        <Button className="bg-green-200 text-green-800" onClick={(e) => handleRegisterToast(e)}>
                            Register
                        </Button>
                    </div>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

export default StudentRegistration;

