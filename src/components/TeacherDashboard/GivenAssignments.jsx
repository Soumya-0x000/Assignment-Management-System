import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { FaRegTrashAlt } from "react-icons/fa";
import { FaDownload } from "react-icons/fa6";
import { supabase } from '../../CreateClient';
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Modal, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@nextui-org/react';
import { RxCross2 } from "react-icons/rx";
import { motion } from 'framer-motion';
import { childVariants, staggerVariants } from '../../common/Animation';
import { useSelector } from 'react-redux';

const searchModeArr = [
    {key: 'orgName', name: 'Name'},
    {key: 'sem', name: 'Semester'},
    {key: 'department', name: 'Department'},
    {key: 'subject', name: 'Subject'}
];

const GivenAssignments = ({ assignments, setAssignments, teacherId }) => {
    const {isOpen, onOpen, onClose} = useDisclosure();
    const [assignmentDetails, setAssignmentDetails] = useState({});
    const [populatingKey, setPopulatingKey] = useState([...assignments])
    const [searchKeyword, setSearchKeyword] = useState('');
    const [searchedItem, setSearchedItem] = useState([]);
    const [searchMode, setSearchMode] = useState({
        name: searchModeArr[0].name,
        value: searchModeArr[0].key
    });
    const { assignmentToRender } = useSelector(state => state.teacherAuth)
    console.log(assignmentToRender)

    useEffect(() => {
        if (searchedItem.length > 0) {
            setPopulatingKey(searchedItem)
        } else {
            setPopulatingKey([...assignments])
        }
    }, [searchedItem, assignments]);

    const handleFileDelete = async(item) => {
        try {
            const semName = item.sem.split(' ').join('');
            const path = `${item?.department}/${semName}/${item?.name}`

            const { data: storageData, error: storageError } = await supabase
                .storage
                .from('assignments')
                .remove([path]);

            if (storageError) {
                console.error('Error in deleting file')
                toast.error('Error in deleting file', {
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    }
                })
            } else {
                toast.success(`${item.orgName} deleted successfully`, {
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    }
                });
                
                const columnName = `${item?.department}assignments`;
                const updatedAssignments = assignments
                    .filter(val => val[0].department === item.department)
                    .filter(val => val[0].name !== item.name)
                
                // Update teacher data with new assignments
                const { data: updateData, error: updateError } = await supabase
                    .from('teachers')
                    .update({
                        [columnName]: updatedAssignments
                    })
                    .eq('uniqId', teacherId);

                if (updateError) {
                    console.error('Error updating teacher data:', updateError.message);
                    toast.error('An error occurred while updating teacher data', {
                        style: {
                            borderRadius: '10px',
                            background: '#333',
                            color: '#fff',
                        }
                    });
                    return;
                } else {
                    const updatedAssignmentsOnUI = assignments.filter(val => val[0].name !== item.name)
                    setAssignments(updatedAssignmentsOnUI);
                    setAssignmentDetails({});
                }
            }
        } catch (error) {
            console.error('Error in deleting file')
            toast.error('Error in deleting file', {
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                }
            })
        }
    };

    const handleFileDeleteToast = (value) => {
        toast.promise(handleFileDelete(value), {
            loading: 'Deleting...',
            success: 'File deleted successfully',
            error: 'Error in deleting file'
        }, {
            style: {
                borderRadius: '10px',
                background: '#333',
                color: '#fff',
            }
        })
    }

    const handleDownload = async(item) => {
        try {
            const semName = item.sem.split(' ').join('');
            const path = `${item?.department}/${semName}/${item?.name}`
            
            const { data: downloadData, error: downloadError } = await supabase
                .storage
                .from('assignments')
                .download(path)

            if (downloadError) {
                console.error('Error in downloading file');
                toast.error('Error in downloading file', {
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    }
                })
            } else {
                const url = URL.createObjectURL(downloadData);
                const link = document.createElement('a');
                link.href = url;
                link.download = item.orgName;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                URL.revokeObjectURL(url);

                toast.success(`${item.orgName} downloaded successfully`, {
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    }
                });
            }
        } catch (error) {
            console.error('Error in downloading file');
            toast.error('Error in downloading file', {
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                }
            })
        }
    };

    const handleDownloadToast = (value) => {
        toast.promise(handleDownload(value), {
            loading: 'Downloading...',
            success: 'File downloaded successfully',
            error: 'Error in downloading file'
        }, {
            style: {
                borderRadius: '10px',
                background: '#333',
                color: '#fff',
            }
        })
    }

    const handleDeleteModal = (assignment) => {
        setAssignmentDetails(assignment)
        onOpen()
    };

    const handelSearch = (e) => {
        e.preventDefault();

        if (searchKeyword) {
            const filteredAssignments = assignments.filter(val => val[0][searchMode.value].toLowerCase().includes(searchKeyword.toLowerCase()))
            setSearchedItem(filteredAssignments)

            if (filteredAssignments.length === 0) {
                toast.error(`No search result found for ${searchKeyword}`, {
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    }
                })
            }
        }
    };

    const handelCancelSearch = (e) => {
        e.preventDefault();

        setSearchKeyword('');
        setSearchedItem([]);
        setSearchMode({
            name: searchModeArr[0].name,
            value: searchModeArr[0].key
        })
    };

    const handleSelectionChange = (e) => {
        const changedName = searchModeArr.find(val => val.key === e.currentKey)
        setSearchMode(prev => ({
            name: changedName.name, value: changedName.key
        }))
    };

    return (
        <div className=' bg-gradient-to-tl from-green-500 to-indigo-600 text-white px-3 py-3 rounded-lg w-full h-fit'>
            <div className='  border-b-2 pb-2 flex flex-col md:flex-row md:items-center justify-between gap-4'>
                <div className='text-[1rem] lg:text-xl font-onest'>
                    Given Assignments ({assignments.length})
                </div>

                <div className=' flex gap-x-2  h-[2.7rem]'>
                    {/* input */}
                    <div className=' relative rounded-lg overflow-hidden w-full'>
                        <input 
                            type="text" 
                            placeholder="Search"
                            className=' bg-[#2f3646] text-gray-300 font-onest tracking-wider h-full pl-3 pr-9 md:pr-11 text-[14px] w-full md:w-[23rem] lg:w-[30rem] xl:w-[35rem] outline-none border-none'
                            onChange={(e) => setSearchKeyword(e.target.value)}
                            value={searchKeyword}
                            onKeyDown={(e) => { (e.key === 'Enter') && handelSearch(e) }}
                        />

                        <button className=' absolute right-0 top-1/2 -translate-y-1/2 bg-slate-900 h-full px-1 lg:px-2'
                        onClick={(e) => handelCancelSearch(e)}>
                            <RxCross2 className=' text-gray-300 text-xl' />
                        </button>
                    </div>

                    {/* category */}
                    <Dropdown>
                        <DropdownTrigger>
                            <Button 
                            variant="bordered" 
                            className={` rounded-lg px-4 transition-colors outline-none border-none bg-slate-950 w-[6.8rem] md:w-[7.6rem] h-full font-onest text-green-500 flex items-center justify-between text-sm md:text-md`}>
                                {searchMode.name}
                            </Button>
                        </DropdownTrigger>

                        <DropdownMenu 
                        closeOnSelect={false}
                        disallowEmptySelection
                        className="w-full bg-slate-900 text-green-500 rounded-xl font-robotoMono"
                        selectionMode="single"
                        selectedKeys={searchMode.key}
                        onSelectionChange={(e) => handleSelectionChange(e)}>
                            {searchModeArr?.map((item, indx) => (
                                <DropdownItem key={item.key}>
                                    {item.name}
                                </DropdownItem>
                            ))}
                        </DropdownMenu>
                    </Dropdown>
                </div>
            </div>

            {assignments.length ? (
                <motion.div className='mt-4 flex flex-wrap items-center gap-3'
                variants={staggerVariants}
                initial="initial"
                animate="animate">
                    {populatingKey?.map((assignment, indx) => (
                        <motion.div 
                        variants={childVariants}
                        className='bg-[#2f3646] rounded-xl p-3 flex flex-col gap-y-3 group  w-full sm:w-fit' 
                        key={indx}>
                            <div className='text-gray-300 font-bold font-robotoMono tracking-wider mb-2'>
                                {assignment[0].orgName}
                            </div>

                            <div className='text-gray-300 font-onest tracking-wider flex gap-x-1.5 xl:gap-x-2.5'>
                                <span className=' bg-slate-950 rounded-lg py-1 px-3 text-[14px]'>{assignment[0].sem}</span>
                                <span className=' bg-slate-950 rounded-lg py-1 px-3 text-[14px]'>{assignment[0].department}</span>
                                <span className=' bg-slate-950 rounded-lg py-1 px-3 text-[14px]'>{assignment[0].subject}</span>
                            </div>

                            <div className=' flex items-center justify-between mt-3'>
                                <button className=' bg-[#ae2222] px-2 py-1 text-[14px] rounded-lg flex items-center gap-x-1 text-red-300 font-bold font-lato tracking-wider w-fit active:scale-110 transition-all'
                                onClick={() => handleDeleteModal(assignment[0])}>
                                    <FaRegTrashAlt />
                                    Remove
                                </button>

                                <button className=' text-green-400 text-[17px] bg-green-900 p-2 rounded-xl active:scale-110 transition-all'
                                onClick={() => handleDownloadToast(assignment[0])}>
                                    <FaDownload/>
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            ) : (
                <div className=' text-lg font-robotoMono font-bold mt-3 bg-slate-800 py-2 px-3 rounded-lg'>
                    No assignments from your side
                </div>
            )}

            <Modal 
            backdrop={'blur'} 
            className=' bg-slate-700 text-slate-200 relative' 
            isOpen={isOpen} 
            onClose={onClose}>
                <ModalContent>
                {(onClose) => (<>
                    <ModalHeader className="flex flex-col gap-1">Delete {assignmentDetails.orgName} ?</ModalHeader>

                    <ModalFooter>
                        <Button color="danger" className=' text-md' onPress={onClose}>
                            Close
                        </Button>

                        <Button 
                        color="primary" 
                        onClick={() => handleFileDeleteToast(assignmentDetails)}
                        onPress={onClose}>
                            Delete
                        </Button>
                    </ModalFooter>
                </>)}
                </ModalContent>
            </Modal>
        </div>
    )
}

export default GivenAssignments;
