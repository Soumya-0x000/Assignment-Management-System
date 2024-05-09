import { Radio, RadioGroup } from '@nextui-org/react'
import React, { useEffect, useState } from 'react'
import { PiStudentBold } from 'react-icons/pi'
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";
import { supabase } from '../../CreateClient';
import toast, { Toaster } from 'react-hot-toast';

const semArr = ['all', '1st', '2nd', '3rd', '4th'];
const tableData = [

  { id: 1, tableName: 'studentsSem1' },

  { id: 2, tableName: 'studentsSem2' },

  { id: 3, tableName: 'studentsSem3' },

  { id: 4, tableName: 'studentsSem4' }

]
const SelectStudent = ({sidebarHold}) => {
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [studentData, setStudentData]= useState({
        dept: 'mca',
        sem: 'all'
    });
    const [studentDetails, setStudentDetails] = useState({
        all: [],
        each: []
    })

    const handleDropDown = (name, val) => {
        setStudentData({
            ...studentData,
            [name]: val
        })
    };

    const StudentArr = async () => {
        Promise.all(tableData.map(async(name, i) => {
            const{ data, error } = await supabase
                .from(name.tableName)
                .select('*')
            studentDetails.all.push(...data)
            
            return { data, error }
        }))
    }
    console.log(studentDetails.all)
    const handleMainBtnClick = () => {
        onOpen();
        toast.promise(StudentArr(), {
            loading: "Loading all students...",
            success: "Successfully loaded student data!",
            error: "Failed to load student data."
        })
    };

//     useEffect(() => {
//         (async() => {
//             try {
// //                 const { data: tableData, error: tableError } = await supabase
// //                     .from('studentsTableName')
// //                     .select('*')
// // console.log(tableData)
// //                 if (tableError) {
// //                     console.error('Error querying studentsTableName:', tableError.message);
// //                     return;
// //                 }
        
// //                 if (!tableData) {
// //                     console.error('No table data found for:', tableName);
// //                     return;
// //                 }
               
                
//                 console.log(studentDetails)
                
//             } catch (error) {
//                 toast.error('Error occurred in fetching data')
//                 console.error('An unexpected error occurred:', error);
//             }
//         })()
//     }, []);

    return <>
        <button className=' rounded-lg text-xl bg-[#8446ffe8] w-full h-10 text-white flex items-center justify-center gap-x-3 border-none outline-none'
        onClick={handleMainBtnClick}>
            <PiStudentBold className=' text-2xl'/>
            <span className={`${sidebarHold ? 'block' : 'hidden group-hover:block'}`}>Students</span>
        </button>

        <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement='auto' className=' w-[15rem ]'>
            <ModalContent>
            {(onClose) => (
                <>
                    <ModalHeader className="flex flex-col gap-1">Student Selection</ModalHeader>

                    <ModalBody>
                        {semArr.map((semester, index) => (
                            <button
                            key={index}
                            className={`w-full bg-slate-200 rounded-lg py-2 text-left px-4 ${studentData.sem === semester && ' ring-[2px] ring-blue-400'}`}
                            onClick={() => handleDropDown('sem', semester)}>
                                {semester} semester
                            </button>
                        ))}
                        
                        <RadioGroup 
                        onChange={(e) => handleDropDown('dept', e.target.value)}
                        color="secondary"
                        className=' mt-5 ml-2'
                        value={studentData.dept}
                        orientation="horizontal">
                            <Radio className='mr-7 bg-slate-200 rounded-lg px-4' value="mca">MCA</Radio>
                            <Radio className=' bg-slate-200 rounded-lg px-4' value="msc">MSc</Radio>
                        </RadioGroup>
                    </ModalBody>

                    <ModalFooter>
                        <Button color="danger" variant="light" onPress={onClose}>
                            Close
                        </Button>

                        <Button color="primary" onPress={onClose}>
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
