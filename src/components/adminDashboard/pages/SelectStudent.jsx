import { Radio, RadioGroup } from '@nextui-org/react'
import React, { useEffect, useState } from 'react'
import { PiStudentBold } from 'react-icons/pi'
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";
import { supabase } from '../../../CreateClient';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { setMode, setStudents } from '../../../reduxStore/reducers/AdminDashboardSlice';
import { TbFilterCog } from "react-icons/tb";
import { motion } from 'framer-motion';
import { formatSemester } from '../../../common/customHooks';

const semArr = [
    { name: 'All', value: 0 },
    { name: '1st', value: 1 },
    { name: '2nd', value: 2 },
    { name: '3rd', value: 3 },
    { name: '4th', value: 4 }
];

const SelectStudent = ({sidebarHold}) => {
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [studentData, setStudentData]= useState({
        dept: 'MCA',
        sem: '0'
    });
    const [studentDetails, setStudentDetails] = useState({
        all: [],
        each: []
    });
    const [tableName, setTableName] = useState('studentsSem');
    const [showFilter, setShowFilter] = useState(false);
    const dispatch = useDispatch();

    const handleDropDown = (name, val) => {
        setStudentData({
            ...studentData,
            [name]: val
        })
    };

    const AllStudentFetch = async () => {
        let studentArr = [];
        
        try {
            const { data: tableData, error: tableError } = await supabase
                .from('studentsTableName')
                .select('*')

            await Promise.all(tableData.map(async (name) => {
                const { data, error } = await supabase
                    .from(name.tableName)
                    .select('*')
                    .eq('department', studentData.dept)

                studentArr.push(...data);
                return { data, error };
            }));
            dispatch(setMode('student'))
            setStudentDetails({ ...studentDetails, all: studentArr });
            dispatch(setStudents(studentArr))
        } catch (error) {
            console.error('An unexpected error occurred:', error);
        }
    };
    
    const handleMainBtnClick = () => {
        setShowFilter(true)
        
        toast.promise(AllStudentFetch(), {
            loading: `Loading all ${studentData.dept} students...`,
            success: `Successfully loaded ${studentData.dept} students!`,
            error: "Failed to load student data."
        })
    };

    useEffect(() => {
        return () => setShowFilter(false)
    }, []);

    useEffect(() => {
        setTableName(prevTableName => 'studentsSem' + studentData.sem);
    }, [studentData.sem]);

    const handleFilteredFetching = async() => {
        if (studentData.sem !== 0) {
            try {
                const { data: filteredData, error: filteredError } = await supabase
                    .from(tableName)
                    .select('*')
                    .eq('department', studentData.dept)
                    
                setStudentDetails({ ...studentDetails, each: filteredData });
                dispatch(setStudents(filteredData))
            } catch (error) {
                toast.error('Error in fetching data....💔')
                console.error('An unexpected error occurred:', error);
            }
        } else {
            AllStudentFetch()
        }
    };

    const handleInitiateFetchToast = () => {
        toast.promise(handleFilteredFetching(), {
            loading: `Loading ${studentData.dept} ${formatSemester(studentData.sem)} students...`,
            success: `Successfully loaded ${studentData.dept} ${formatSemester(studentData.sem)} student data!`,
            error: "Failed to load student data."
        })
    };

    return <>
        <div className={`${showFilter && 'space-y-4 rounded-lg bg-slate-950 p-1.5'}`}>
            <button className=' rounded-lg text-xl bg-[#8446ffe8] w-full h-10 text-white flex items-center justify-center gap-x-2 md:gap-x-3 border-none outline-none'
            onClick={handleMainBtnClick}>
                <PiStudentBold className=' md:text-2xl'/>
                <span className={`${sidebarHold ? 'block' : 'hidden group-hover:preLg:block'} text-[1rem] md:text-[1.3rem]`}>Students</span>
            </button>
            
            {showFilter && (
                <motion.button 
                initial={{y: -50}}
                animate={{y: 0}}
                transition={{ type: "spring", stiffness: 120, damping: 18 }}
                className=' rounded-lg text-xl bg-[#8446ffe8] w-full h-10 text-white flex items-center justify-center gap-x-3 border-none outline-none'
                onClick={onOpen}>
                    <TbFilterCog className=' text-2xl'/>
                    <span className={`${sidebarHold ? 'block' : 'hidden group-hover:preLg:block'} text-[1.2rem] md:text-[1.3rem]`}>Filter</span>
                </motion.button>
            )}
        </div>

        <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement='auto' className=' w-[15rem ]'>
            <ModalContent>
            {(onClose) => (
                <>
                    <ModalHeader className="flex flex-col gap-1">Student Selection</ModalHeader>

                    <ModalBody>
                        {semArr.map((sem, index) => (
                            <button
                            key={index}
                            className={`w-full bg-slate-200 rounded-lg py-2 text-left px-4 ${studentData.sem == sem.value && ' ring-[2px] ring-blue-400'}`}
                            onClick={() => handleDropDown('sem', sem.value)}>
                                {sem.name} semester
                            </button>
                        ))}
                        
                        <RadioGroup 
                        onChange={(e) => handleDropDown('dept', e.target.value)}
                        color="secondary"
                        className=' mt-5 ml-2'
                        value={studentData.dept}
                        orientation="horizontal"
                        isRequired={true}>
                            <Radio className='mr-7 bg-slate-200 rounded-lg px-4' value="MCA">MCA</Radio>
                            <Radio className=' bg-slate-200 rounded-lg px-4' value="MSc">MSc</Radio>
                        </RadioGroup>
                    </ModalBody>

                    <ModalFooter>
                        <Button color="danger" variant="light" onPress={onClose}>
                            Close
                        </Button>

                        <Button color="primary" onPress={onClose} onClick={handleInitiateFetchToast}>
                            Execute
                        </Button>
                    </ModalFooter>
                </>
            )}
            </ModalContent>
        </Modal>
    </>;
}

export default SelectStudent;
