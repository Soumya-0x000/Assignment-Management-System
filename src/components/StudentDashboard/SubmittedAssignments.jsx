import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@nextui-org/react'
import React, { useEffect, useMemo, useState } from 'react'
import { useDateFormatter } from "@react-aria/i18n";
import { downloadFile, parseDate } from '../../common/customHooks';
import { supabase } from '../../CreateClient';
import { motion } from 'framer-motion'
import toast from 'react-hot-toast';
import { FaRegTrashAlt } from 'react-icons/fa';
import { FaDownload } from 'react-icons/fa6';

const SubmittedAssignments = ({modalStatus, setModalStatus, assignment, studentId}) => {
    let formatter = useDateFormatter({dateStyle: "full"});
    const tableName = useMemo(() => {
        return localStorage.getItem('studentTableName')
    }, []);
    const {isOpen, onClose, onOpen} = useDisclosure();
    const [assignmentInfo, setAssignmentInfo] = useState({});
    const [assignmentToRender, setAssignmentToRender] = useState([]);
    const [assignmentToDelete, setAssignmentToDelete] = useState([]);

    useEffect(() => {
        (async() => {
            if (studentId) {
                try {
                    const { data: assignmentData, error: assignmentError } = await supabase
                        .from(tableName)
                        .select('submittedAssignments')
                        .eq('uniqId', studentId)
                    
                    if (assignmentError) {
                        console.error('Error fetching assignments from Supabase:', assignmentError);
                        return;
                    }
                    setAssignmentInfo(assignmentData[0]['submittedAssignments']);
                } catch (error) {
                    console.error('An unexpected error occurred:', error);
                }
            }
        })()
    }, [studentId]);

    useEffect(() => {
        setAssignmentToRender(assignmentInfo[assignment.fullSubName])
    }, [assignment]);

    const handleDeleteModal = (item) => {
        onOpen();
        setAssignmentToDelete(item);
    };

    const handleDelete = async() => {
        try {
            const filePath = `${assignmentToDelete.dept}/${assignmentToDelete.sem}/${assignmentToDelete.myFileName}`;
            console.log(assignmentToDelete)

            const { data: deleteData, error: deleteError } = await supabase
                .storage
                .from('submittedAssignments')
                // .remove([filePath])

            if (deleteError) {
                console.log('Error in deleting file:', deleteError);
                toast.error('Error in deleting file', {
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    },
                });
                return;
            }

        } catch (error) {
            console.error('Error in deleting file:', error);
            toast.error('Error in deleting file', {
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                },
            });
        }
    };

    const handleFileDownloadToast = (item) => {
        toast.promise(handleDownload(item), {
            loading: 'Downloading...',
            success: 'File downloaded successfully',
            error: 'Error in downloading file'
        }, {style: {
                borderRadius: '10px',
                background: '#333',
                color: '#fff',
            }
        })
    };

    const handleDownload = async(item) => {
        try {
            const filePath = `${item.dept}/${item.sem}/`;
            const fullPath = `${filePath}${item.myFileName}`
            
            const { data: downloadData, error: downloadError } = await supabase
                .storage
                .from('submittedAssignments')
                .download(fullPath)

            if (downloadError) {
                console.log('Error in downloading file:', downloadError);
                toast.error('Error in downloading file', {
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    },
                });
                return;
            }
    
            await downloadFile(downloadData, item.myFileOrgName);
        } catch (error) {
            console.error('Error in downloading file:', error);
            toast.error('Error in downloading file', {
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                },
            });
        }
    };

    return (
        <div>
            <Modal 
            size={'full'} 
            className=' bg-slate-800 overflow-y-auto'
            isOpen={modalStatus} 
            onClose={() => setModalStatus(false)}>
                <ModalContent>
                {(setModalStatus) => (<>
                    <ModalHeader className=" font-robotoMono text-yellow-200 pb-3 border-b-1 mx-3 border-green-300">Your submitted assignments</ModalHeader>

                    <ModalBody>
                        <div className=' border-b w-fit border-green-400 pb-3'>
                            <div className='bg-[#78f1e5] rounded-xl mt-5 p-3 flex flex-col gap-y-3 group w-full sm:w-fit overflow-hidden cursor-pointer group transition-all' >
                                <div className='text-cyan-800 text-lg font-bold font-robotoMono tracking-wider mb-2 line-clamp-1 w-fit  group-hover:translate-x-1 group-hover:-translate-y-[3px] transition-all'>
                                    {assignment.orgName}
                                </div>

                                <div className='text-gray-300 font-onest tracking-wider flex flex-wrap gap-1.5 xl:gap-2.5 group-hover:translate-x-1  group-hover:-translate-y-1 transition-all'>
                                    <span className=' bg-slate-950 rounded-lg py-1 px-3 text-[14px]'>{assignment.sem}</span>
                                    <span className=' bg-slate-950 rounded-lg py-1 px-3 text-[14px]'>{assignment.department}</span>
                                    <span className=' bg-slate-950 rounded-lg py-1 px-3 text-[14px]'>{assignment.subject}</span>
                                </div>

                                <div className=' font-robotoMono text-sm bg-slate-950 text-green-300 w-fit px-3 py-1 rounded-lg group-hover:translate-x-1 group-hover:-translate-y-1 transition-all'>
                                    {assignment.submitDeadline && formatter.format(parseDate(assignment.submitDeadline))}
                                </div>
                            </div>
                        </div>

                        {assignmentToRender?.length > 0 && (
                            <div className=' flex flex-wrap items-center gap-4 mt-10'>
                                {assignmentToRender.map((item, indx) => (
                                    <div 
                                    className=' bg-slate-900 rounded-lg overflow-hidden py-3 px-4 w-full sm:w-fit'
                                    key={indx}>
                                        <div className=' text-slate-200 font-mavenPro text-[1.1rem]'>
                                            {item.myFileOrgName}
                                        </div>

                                        <div className=' text-yellow-300 font-robotoMono tracking-wide mt-6 space-x-2'>
                                            <span className=' bg-[#2e3e67] rounded-lg px-2 py-1'>
                                                {item.sem}
                                            </span>
                                            
                                            <span className=' bg-[#2e3e67] rounded-lg px-2 py-1'>
                                                {item.dept}
                                            </span>
                                            
                                            <span className=' bg-[#2e3e67] rounded-lg px-2 py-1'>
                                                {item.subName}
                                            </span>
                                        </div>

                                        <div className=' mt-6 font-jaldi text-green-300 tracking-wider flex flex-col gap-y-3 text-[1.05rem]'>
                                            <span className=' bg-[#2e3e67] rounded-lg px-2 py-1'>
                                                Deadline: {formatter.format(parseDate(item.deadline))}
                                            </span>
                                            
                                            <span className=' bg-[#2e3e67] rounded-lg px-2 py-1'>
                                                Submitted date: {formatter.format(parseDate(item.submittedDate))}
                                            </span>
                                        </div>

                                        <div className=' flex items-center justify-between mt-9'>
                                            <button className=' bg-[#ae2222] px-2 py-1 text-[14px] rounded-lg flex items-center gap-x-1 text-red-300 font-bold font-lato tracking-wider w-fit active:scale-110 transition-all group-hover:translate-x-1'
                                            onClick={() => handleDeleteModal(item)}>
                                                <FaRegTrashAlt />
                                                Remove
                                            </button>

                                            <button className=' text-green-400 text-[17px] bg-green-900 p-2 rounded-xl active:scale-110 transition-all group-hover:-translate-x-1'
                                            onClick={() => handleFileDownloadToast(item)}>
                                                <FaDownload/>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </ModalBody>

                    <ModalFooter>
                        <Button color="danger" variant="shadow" className=' font-robotoMono tracking-wide text-[1rem]' onPress={() => setModalStatus(false)}>
                            Close
                        </Button>
                    </ModalFooter>
                </>)}
                </ModalContent>
            </Modal>

            <Modal backdrop={'blur'} className=' bg-slate-700' isOpen={isOpen} onClose={onClose}>
                <ModalContent>
                    <ModalHeader className=" font-robotoMono text-slate-200 mt-3">Are you sure you want to delete this submission?</ModalHeader>

                    <ModalFooter>
                        <Button color="danger" variant="shadow" className=' font-robotoMono tracking-wide text-[1rem]' onPress={onClose}>
                            Close
                        </Button>

                        <Button color="success" variant="shadow" className=' font-robotoMono tracking-wide text-[1rem] text-white bg-green-600' onPress={handleDelete}>
                            Delete
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    )
}

export default SubmittedAssignments;
