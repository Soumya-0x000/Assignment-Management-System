import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { FaRegTrashAlt, FaSearch } from "react-icons/fa";
import { FaDownload } from "react-icons/fa6";
import { supabase } from '../../CreateClient';
import { Button, Modal, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@nextui-org/react';

const GivenAssignments = ({ assignments, setAssignments, teacherId }) => {
    const {isOpen, onOpen, onClose} = useDisclosure();
    const [assignmentDetails, setAssignmentDetails] = useState({});
    const [searchKeyword, setSearchKeyword] = useState('');
    const [searchItem, setSearchItem] = useState([]);

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
        console.log(e.target.value)
    };

    return (
        <div className=' bg-gradient-to-tl from-green-500 to-indigo-600 text-white px-3 py-3 rounded-lg w-full h-fit'>
            <div className='  border-b-2 pb-2 flex flex-col md:flex-row md:items-center justify-between gap-4'>
                <div className=' text-xl font-onest'>
                    Given Assignments ( {assignments.length} )
                </div>

                <div className=' relative rounded-lg overflow-hidden'>
                    <input 
                        type="text" 
                        placeholder="Search"
                        className=' bg-[#2f3646] text-gray-300 font-onest tracking-wider py-3 pl-3 pr-9 md:pr-11 text-[14px] w-full md:w-[24rem] xl:w-[35rem] outline-none border-none'
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        value={searchKeyword}
                        onKeyDown={(e) => { (e.key === 'Enter') && handelSearch(e) }}
                    />

                    <button className=' absolute right-0 top-1/2 -translate-y-1/2 bg-slate-900 h-full px-1.5 md:px-2.5'
                    onClick={(e) => handelSearch(e)}>
                        <FaSearch className=' text-gray-300' />
                    </button>
                </div>
            </div>

            {assignments.length ? (
                <div className='mt-4 flex flex-wrap items-center gap-3'>
                    {assignments?.map((assignment, indx) => (
                        <div 
                        className='bg-[#2f3646] rounded-xl p-3 flex flex-col gap-y-3 group  w-full xmd:w-fit' 
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
                        </div>
                    ))}
                </div>
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
