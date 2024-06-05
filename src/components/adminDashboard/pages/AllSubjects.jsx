import React, { useEffect, useMemo, useState } from 'react'
import { setDeptSemSubjects } from '../../../reduxStore/reducers/AdminDashboardSlice';
import toast from 'react-hot-toast';
import { supabase } from '../../../CreateClient';
import { useDispatch, useSelector } from 'react-redux';
import { IoIosAdd } from "react-icons/io";
import { CiEdit } from "react-icons/ci";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@nextui-org/react';
import { MdDeleteOutline } from "react-icons/md";

const AllSubjects = () => {
    const dispatch = useDispatch();
    const {isOpen, onOpen, onClose} = useDisclosure();
    const [subjectsInfo, setSubjectsInfo] = useState([]);
    const { teacherAssignClassDetails } = useSelector(state => state.adminDashboard);
    const [subToInsertInfo, setSubToInsertInfo] = useState({
        dept: '',
        sem: ''
    });
    const [insertingValue, setInsertingValue] = useState({
        name: '',
        fName: ''
    });
    const maxSubLength = 5;

    useEffect(() => {
        (async () => {
            try {
                const { data: subjectData, error: subjectError } = await supabase
                    .from('subjects')
                    .select('*');
                
                if (subjectError) {
                    toast.error('Error in fetching subjects', {
                        style: {
                            borderRadius: '10px',
                            background: '#333',
                            color: '#fff',
                        }
                    });
                    console.error('Error in fetching subjects', subjectError);
                } else {
                    setSubjectsInfo(subjectData);
                    dispatch(setDeptSemSubjects(subjectData[0]));
                }
            } catch (error) {
                console.error(error);
                toast.error('Error in fetching subjects', {
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    }
                });
            }
        })();
    }, []);

    const insertModal = (dept, sem) => {
        setInsertingValue({ name: '', fName: ''})
        setSubToInsertInfo({dept, sem})
        onOpen();
    };

    const handleChange = (name, e) => {
        const { value } = e.target;
        setInsertingValue({
            ...insertingValue,
            [name]: value
        });
    };

    const actualSemName = (semester) => {
        return teacherAssignClassDetails.sem.find(val => val.startsWith(...semester))
    };

    const handleInsert = async () => {
        try {
            const extractSubObj = subjectsInfo[0][subToInsertInfo.dept][subToInsertInfo.sem];
            const newSubArr = [...extractSubObj, insertingValue];
            
            const newSemValue = {
                ...subjectsInfo[0][subToInsertInfo.dept],
                [subToInsertInfo.sem]: newSubArr
            }

            const newSubjectsInfo = subjectsInfo.map(item => 
                item.id === subjectsInfo[0].id 
                    ? { ...item, [subToInsertInfo.dept]: newSemValue } 
                    : item
            );
            
            const { data: insertData, error: insertError } = await supabase
                .from('subjects')
                .update({[subToInsertInfo.dept]: newSemValue })
                .eq('id', subjectsInfo[0].id)

            if (insertError) {
                console.error('Error occurred', insertError);
                toast.error('Error occurred in insertion', {
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    }
                });
                return;
            } else {
                toast.success('Subject inserted successfully', {
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    }
                });
                setSubjectsInfo(newSubjectsInfo);
                dispatch(setDeptSemSubjects(newSubjectsInfo));
                onClose();
            }
        } catch (error) {
            console.error('Error occurred', error);
            toast.error('Error occurred in insertion', {
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                }
            });
        }
    };
    
    const handleInsertToast = () => {
        if (insertingValue.name !== '') {
            if (insertingValue.fName === '') {
                const updatedValue = insertingValue
                updatedValue.fName = insertingValue.name
                setInsertingValue(updatedValue)
            }

            toast.promise(handleInsert(), {
                loading: 'Inserting subject...',
                success: 'Subject inserted successfully!',
                error: 'Failed to insert subject!'
            }, {style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                }
            })
        }
    };

    return (
        <div className=' bg-slate-800 w-full px-2 sm:px-5 py-3 rounded-lg'>
            <div className=' text-white font-mavenPro md:text-[1.1rem] lg:text-[1.2rem] xl:text-[1.4rem] w-full font-bold tracking-wider text-lg'>
                All Subjects
            </div>

            <div className=' w-full flex gap-y-3 mt-3'>
                {[...subjectsInfo]
                .map(({id, ...rest}) => rest)
                .map((value, indx) => (
                    <div className=' w-full text-slate-300 flex flex-col md:flex-row items-start gap-4'
                    key={indx}>
                        {Object.entries(value).map(([dept, innerValue], innerIndx) => (
                            <div className=' w-full bg-slate-900 rounded-lg p-3 text-slate-300 space-y-8'
                            key={innerIndx}>
                                <div className=' text-blue-300 font-robotoMono tracking-wider text-lg font-bold bg-slate-800 w-full py-1 pl-3 rounded-lg'>
                                    {dept} Subjects
                                </div>

                                <div className=' w-full grid grid-cols-1 xl:grid-cols-2 gap-6'>
                                    {Object.entries(innerValue).map(([sem, sub], subIndx) => (
                                        <div 
                                        className=' bg-slate-800 rounded-lg overflow-hidden w-full'
                                        key={subIndx}>
                                            <div className=' font-robotoMono text-[17px] font-bold tracking-wide bg-slate-700 w-full pl-3 py-2'>
                                                {actualSemName(...sem[0])}
                                            </div>

                                            <div className=' pl-5 pr-3 py-2 space-y-5'>
                                                <div className=' font-montserrat space-y-3'>
                                                    {sub.map((sub, innerSubIndex) => (
                                                        <div className=' text-[14px] xl:text-[15px] tracking-wide line-clamp-1 w-full flex items-center justify-between py-1 pr-1'
                                                        key={innerSubIndex}>
                                                            <span className=' hidden sm:block line-clamp-1'>
                                                                {innerSubIndex+1}) {sub.fName}
                                                            </span>
                                                            
                                                            <span className=' sm:hidden block line-clamp-1'>
                                                                {sub.name}
                                                            </span>

                                                            <div className=' space-x-2'>
                                                                <button className=' w-fit rounded-lg md:p-[1px] hover:scale-125 text-red-500 transition-all md:hover:scale-110'>
                                                                    <MdDeleteOutline
                                                                        className=' text-[1.3rem]'
                                                                    />
                                                                </button>

                                                                <button className=' w-fit rounded-lg md:p-[1px] hover:scale-125 text-yellow-300 transition-all md:hover:scale-110'>
                                                                    <CiEdit
                                                                        className=' text-[1.2rem]'
                                                                    />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                                    
                                                {sub.length < maxSubLength ? (
                                                    <button className=' w-fit rounded-full bg-blue-400 text-blue-800 hover:rotate-90 transition-all active:scale-125'
                                                    onClick={() => insertModal(dept, sem)}>
                                                        <IoIosAdd
                                                            className=' text-[1.5rem]'
                                                        />
                                                    </button>
                                                ) : ''}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            <Modal backdrop={'blur'} isOpen={isOpen} onClose={onClose} className=' bg-slate-700'>
                <ModalContent>
                {(onClose) => (<>
                    <ModalHeader className=" font-robotoMono text-white">Insert new subject in {subToInsertInfo.dept} {actualSemName(...subToInsertInfo.sem[0])}</ModalHeader>

                    <ModalBody>
                        <input 
                            type="text" 
                            placeholder='Subject name (acronym)'
                            className={` w-full bg-slate-800 px-4 py-3 font-robotoMono text-green-400 rounded-lg outline-none ${insertingValue.name !== '' && 'border-2 border-green-500'} focus:border-2 focus:border-green-500`}
                            value={insertingValue.name}
                            onChange={(e) => handleChange('name', e)}
                            onKeyDown={(e) => {e.key === 'Enter' && handleInsertToast()}}
                            autoFocus
                            required
                        />
                        
                        <input 
                            type="text" 
                            placeholder='Full name'
                            className={` w-full bg-slate-800 px-4 py-3 font-robotoMono text-green-400 rounded-lg outline-none ${insertingValue.fName !== '' && 'border-2 border-green-500'} focus:border-2 focus:border-green-500`}
                            onKeyDown={(e) => {e.key === 'Enter' && handleInsertToast()}}
                            value={insertingValue.fName}
                            onChange={(e) => handleChange('fName', e)}
                        />
                    </ModalBody>

                    <ModalFooter>
                        <Button className=' font-robotoMono' color="danger" variant="shadow" onPress={onClose}>
                            Close
                        </Button>

                        <Button className=' font-robotoMono' color="primary" variant="shadow"
                        onClick={handleInsertToast}>
                            Insert
                        </Button>
                    </ModalFooter>
                </>)}
                </ModalContent>
            </Modal>
        </div>
    );
}

export default AllSubjects;
