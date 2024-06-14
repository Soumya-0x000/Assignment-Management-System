import React, { useEffect, useState } from 'react'
import { supabase } from '../../CreateClient';
import { downloadFile, formatSemester, parseDate } from '../../common/customHooks';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, RadioGroup, Tooltip, useDisclosure } from '@nextui-org/react';
import { CustomRadio } from '../../common/CustomRadioBtn';
import { motion } from 'framer-motion';
import { childVariants, staggerVariants } from '../../common/Animation';
import { useDateFormatter } from "@react-aria/i18n";
import { FaDownload, FaUpload } from "react-icons/fa6";
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import FilePondPluginFileEncode from 'filepond-plugin-file-encode';
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import {now, getLocalTimeZone} from "@internationalized/date";
import SubmittedAssignments from './SubmittedAssignments';

registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageExifOrientation,
    FilePondPluginFileValidateSize,
    FilePondPluginFileEncode
);

const RenderAssignments = () => {
    const {isOpen, onOpen, onClose} = useDisclosure();
    const { studentData } = useSelector(state => state.studentDashboard);
    const [mySubjects, setMySubjects] = useState([]);
    const [myAssignments, setMyAssignments] = useState([]);
    const [renderedAssignments, setRenderedAssignments] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState('All');
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [questionAssignment, setQuestionAssignment] = useState({});
    const [isSubmittedAssignmentModalOpen, setIsSubmittedAssignmentModalOpen] = useState(false);
    const [isDeadlineExceeded, setIsDeadlineExceeded] = useState(false);

    let formatter = useDateFormatter({dateStyle: "full"});  

    useEffect(() => {
        if (Object.keys(studentData).length > 0) {
            (async() => {
                try {
                    const semName = formatSemester(`${studentData?.semester}`).split(' ')[0]+'Sem'
                    const assignmentTableName = `${studentData.department}assignments`;

                    const { data: assignmentData, error: assignmentError } = await supabase
                        .from(assignmentTableName)
                        .select(semName)

                    const { data: subjectData, error: subjectError } = await supabase
                        .from('subjects')
                        .select(studentData.department)

                    if (assignmentError || subjectError) {
                        console.error('Error fetching assignments from Supabase:', assignmentError);
                        toast.error('Error fetching assignments', {
                            style: {
                                borderRadius: '10px',
                                background: '#333',
                                color: '#fff',
                            }
                        })
                    } else {
                        setMySubjects(subjectData[0][studentData.department][semName]);
                        const fetchedAssignments = assignmentData
                            .flatMap(val => Object.entries(val)
                                .filter(([key, val]) => key === semName && val)
                                .flatMap(([key, val]) => val))
                            .filter(Boolean);
                            
                        setMyAssignments(fetchedAssignments);
                        setSelectedSubject('All');
                    }
                } catch (error) {
                    console.log('Error fetching assignments from Supabase:', error);
                    toast.error('Error fetching assignments', {
                        style: {
                            borderRadius: '10px',
                            background: '#333',
                            color: '#fff',
                        }
                    })
                }
            })()
        }
    }, [studentData]);

    useEffect(() => {
        if (selectedSubject === 'All') {
            const tempSelectedSubjects = myAssignments
                .map(assignment => Object.values(assignment))
                .flat().flat()
            setRenderedAssignments(tempSelectedSubjects);
        } else {
            const tempSelectedSubjects = myAssignments
                .map(assignment => (assignment[selectedSubject]))
                .flat()
                .filter(Boolean)
            
            setRenderedAssignments(tempSelectedSubjects);
        }
    }, [selectedSubject, myAssignments]);

    const handleFileDownload = async(item) => {
        try {
            const semName = item.sem.split(' ').join('');
            const path = `${item?.department}/${semName}/${item?.name}`
            
            const { data: downloadData, error: downloadError } = await supabase
                .storage
                .from('assignments')
                .download(path)

            if (downloadError) {
                console.log('Error in downloading file');
                toast.error('Error in downloading file', {
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    }
                })
            }
                
            await downloadFile(downloadData, item.orgName);
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

    const handleFileDownloadToast = (value, event) => {
        event.stopPropagation();

        toast.promise(handleFileDownload(value), {
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

    const handleFileUpload = async () => {
        try {
            for (const [index, fileItem] of selectedFiles.entries()) {
                const file = fileItem?.file;
                if (!file) continue;
    
                const newFileName = `${studentData.department}_${questionAssignment.sem}_${questionAssignment.fullSubName}_${index}_Roll_${studentData.rollNo}_${file.name}`;
                const filePath = `${questionAssignment.department}/${questionAssignment.sem}/`;
                const fullPath = `${filePath}${newFileName}`;
    
                const { data: uploadData, error: uploadError } = await supabase
                    .storage
                    .from('submittedAssignments')
                    .upload(fullPath, file, {
                        cacheControl: '3600',
                        upsert: false,
                    });
    
                if (uploadError) {
                    console.log('Error in uploading file:', uploadError);
                    toast.error('Error in uploading file', {
                        style: {
                            borderRadius: '10px',
                            background: '#333',
                            color: '#fff',
                        },
                    });

                    continue;
                }
    
                // Fetch current submitted assignments only if the file upload is successful
                const { data: currentData, error: fetchError } = await supabase
                    .from(studentData.tableName)
                    .select('submittedAssignments')
                    .eq('uniqId', studentData.uniqId);
    
                if (fetchError) {
                    console.log('Error in fetching current submitted assignments:', fetchError);
                    toast.error('Error in fetching submitted assignments', {
                        style: {
                            borderRadius: '10px',
                            background: '#333',
                            color: '#fff',
                        },
                    });

                    await supabase
                        .storage
                        .from('submittedAssignments')
                        .remove([fullPath]);

                    continue;
                }
    
                const assignmentObj = {
                    name: studentData.name,
                    sem: questionAssignment.sem,
                    dept: studentData.department,
                    assignmentName: questionAssignment.name,
                    assignmentOrgName: questionAssignment.orgName,
                    subName: questionAssignment.subject,
                    fullSubName: questionAssignment.fullSubName,
                    myFileName: newFileName,
                    myFileOrgName: file.name,
                    deadline: questionAssignment.submitDeadline,
                    submittedDate: now(getLocalTimeZone()),
                };
    
                const existingAssignments = currentData[0]?.submittedAssignments || {};
    
                // Merge the new assignment with existing ones
                const updatedAssignments = {
                    ...existingAssignments,
                    [questionAssignment.fullSubName]: [
                        ...(existingAssignments[questionAssignment.fullSubName] || []),
                        assignmentObj,
                    ],
                };
    
                // Now upsert the updated assignments
                const { data: upsertData, error: upsertError } = await supabase
                    .from(studentData.tableName)
                    .update({
                        submittedAssignments: updatedAssignments
                    })
                    .eq('uniqId', studentData.uniqId);
    
                if (upsertError) {
                    console.log('Error in updating assignment data:', upsertError);
                    toast.error('Error in updating assignment data', {
                        style: {
                            borderRadius: '10px',
                            background: '#333',
                            color: '#fff',
                        },
                    });

                    // Clean up the uploaded file if updating data fails
                    await supabase
                        .storage
                        .from('submittedAssignments')
                        .remove([fullPath]);
                } else {
                    console.log('Assignment data updated successfully:', upsertData);
                    toast.success('Assignment data updated successfully', {
                        style: {
                            borderRadius: '10px',
                            background: '#333',
                            color: '#fff',
                        },
                    });
                }
            }
            onClose();
            setSelectedFiles([]);
        } catch (error) {
            console.log('Error in uploading file:', error);
            toast.error('Error in uploading file', {
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                },
            });
        }
    };
    
    const handleFileUploadToast = (event) => {
        event.stopPropagation(); 

        if (selectedFiles.length > 0) {
            toast.promise(handleFileUpload(), {
                loading: 'Uploading...',
                success: 'File uploaded successfully',
                error: 'Error in uploading file'
            }, {
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                }
            })
        } else {
            toast.error('Please select a file', {
                icon: '⚠️',
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                }
            })
        }
    }

    const uploadingModal = (item, event) => {
        event.stopPropagation();
        setQuestionAssignment(item)
        
        const { day: dDay, year: dYear, month: dMonth } = item.submitDeadline;
        const { year, month, day } = now(getLocalTimeZone());
        
        const deadlineDate = new Date(dYear, dMonth - 1, dDay);
        const currentDate = new Date(year, month - 1, day);
        
        const isDeadlineExceeded = currentDate > deadlineDate;
        
        if(isDeadlineExceeded) {
            toast('Submission date exceeded', {
                icon: '⚠️',
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                }
            })
        } else onOpen();
        
        setIsDeadlineExceeded(isDeadlineExceeded)
    }

    const displaySubmittedAssignments = (item) => {
        setIsSubmittedAssignmentModalOpen(true)
        setQuestionAssignment(item)
    };

    return (
        <div>
            <RadioGroup 
            className=' text-gray-300'
            value={selectedSubject} 
            onValueChange={setSelectedSubject}>
                <div className=' flex flex-wrap gap-2 items-center'>
                    {[{name: 'All', fName: 'All'}, ...mySubjects].map((subject, index) => (
                        <CustomRadio key={index} value={subject.name}>
                            {subject.name}
                        </CustomRadio>
                    ))}
                </div>
            </RadioGroup>

            <motion.div className=' grid grid-cols-1 sm:grid-cols-2 postLg:grid-cols-3 2xl:grid-cols-4 gap-4 rounded-lg overflow-hidden mt-10 bg-gradient-to-br from-pink-600 to-indigo-600 p-4'
            variants={staggerVariants}
            initial="initial"
            animate="animate">
                {renderedAssignments.length > 0 ? (<>
                    {renderedAssignments.map((item, indx) => (
                        <motion.div 
                        variants={childVariants}
                        className='bg-[#19253a] rounded-xl p-3 flex flex-col gap-y-3 group overflow-hidden cursor-pointer group transition-all relative' 
                        key={indx}
                        onClick={() => displaySubmittedAssignments(item)}>
                            <span className=' absolute p-2 bg-slate-900 right-0 top-0 text-violet-300 rounded-bl-xl font-oxanium font-bold z-20'>
                                {indx+1}
                            </span>

                            <Tooltip color='primary'
                            content={item.orgName}
                            className=' capitalize max-w-full sm:max-w-[20rem] md:max-w-full overflow-hidden md:overflow-visible flex flex-wrap items-start justify-center whitespace-normal text-balance text-white'
                            placement='top'>
                                <div className='text-gray-300 font-bold font-robotoMono tracking-wider mb-2 line-clamp-1 w-fit  group-hover:translate-x-1 group-hover:-translate-y-[3px] transition-all'>
                                    {item.orgName}
                                </div>
                            </Tooltip>

                            <div className='text-gray-300 font-onest tracking-wider flex flex-wrap gap-1.5 xl:gap-2.5 group-hover:translate-x-1  group-hover:-translate-y-1 transition-all'>
                                <span className=' bg-slate-950 rounded-lg py-1 px-3 text-[14px]'>{item.sem}</span>
                                <span className=' bg-slate-950 rounded-lg py-1 px-3 text-[14px]'>{item.department}</span>
                                <span className=' bg-slate-950 rounded-lg py-1 px-3 text-[14px]'>{item.subject}</span>
                            </div>

                            <div className=' font-robotoMono text-sm bg-slate-950 text-green-300 w-fit px-3 py-1 rounded-lg group-hover:translate-x-1 group-hover:-translate-y-1 transition-all'>
                                {item.submitDeadline && formatter.format(parseDate(item.submitDeadline))}
                            </div>

                            <div className=' flex items-center justify-between mt-3'>
                                <button className=' text-green-400 text-[17px] bg-green-900 p-2 rounded-xl active:scale-110 transition-all group-hover:translate-x-1'
                                onClick={(e) => handleFileDownloadToast(item, e)}>
                                    <FaDownload/>
                                </button>
                                
                                <button className=' text-blue-300 text-[17px] bg-blue-700 p-2 rounded-xl active:scale-110 transition-all group-hover:translate-x-1'
                                onClick={(e) => uploadingModal(item, e)}>
                                    <FaUpload/>
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </>) : (
                    <div className=' text-lg font-robotoMono font-bold bg-slate-800 py-2 px-3 rounded-lg w-full text-slate-200'>
                        No assignments {selectedSubject === 'All' ? '' : `for ${selectedSubject}`}
                    </div>
                )}
            </motion.div>

            <Modal 
            backdrop={'blur'} 
            className=' bg-slate-700 text-slate-200 relative' 
            isOpen={isOpen} 
            onClose={onClose}>
                <ModalContent>
                {(onClose) => (<>
                    <ModalHeader className="flex flex-col gap-1 font-robotoMono">Upload your assignment</ModalHeader>

                    <ModalBody>
                        <FilePond
                            files={selectedFiles}
                            allowMultiple={true}
                            maxFiles={3}
                            allowReorder={true}
                            allowPaste
                            maxFileSize='5MB'
                            labelIdle=' <span class="filepond--label-action no-underline font-montserrat text-violet-300">Drag & Drop your files or Browse</span>'
                            onupdatefiles={setSelectedFiles}
                            name="filepond"
                            onaddfilestart={(fileItem) => {
                                const file = fileItem.file;

                                const acceptedTypes = [
                                    'application/pdf', 
                                    'application/msword', 
                                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
                                    'text/plain'
                                ];

                                // Check file size
                                if (file.size > 5 * 1024 * 1024) {
                                    toast.error(`${file.name} size exceeds 5MB`, {
                                        style: {
                                            borderRadius: '10px',
                                            background: '#333',
                                            color: '#fff',
                                        }
                                    });
                                    fileItem.abortLoad();
                                    return;
                                }

                                // Check file type
                                if (!acceptedTypes.includes(file.type)) {
                                    toast.error(`${file.type.split('/')[0]} not accepted`, {
                                        style: {
                                            borderRadius: '10px',
                                            background: '#333',
                                            color: '#fff',
                                        }
                                    });
                                    fileItem.abortLoad();
                                    return;
                                }
                            }}
                        />
                    </ModalBody>

                    <ModalFooter>
                        <Button color="danger" className=' text-md font-robotoMono' onPress={onClose}>
                            Close
                        </Button>
                        
                        {!isDeadlineExceeded && (
                            <Button 
                            color="primary" 
                            className=' text-md font-robotoMono'
                            onClick={(e) => handleFileUploadToast(e)}>
                                Upload
                            </Button>
                        )}
                        
                    </ModalFooter>
                </>)}
                </ModalContent>
            </Modal>

            <SubmittedAssignments
                modalStatus={isSubmittedAssignmentModalOpen}
                setModalStatus={setIsSubmittedAssignmentModalOpen}
                assignment={questionAssignment}
                studentId={studentData.uniqId}
            />
        </div>
    )
}

export default RenderAssignments;
