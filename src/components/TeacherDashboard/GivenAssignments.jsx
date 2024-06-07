import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { FaRegTrashAlt } from "react-icons/fa";
import { FaDownload } from "react-icons/fa6";
import { supabase } from '../../CreateClient';
import { 
    Button, 
    Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, 
    Modal, ModalContent, ModalFooter, ModalHeader, 
    Tooltip, useDisclosure 
} from '@nextui-org/react';
import { RxCross2 } from "react-icons/rx";
import { motion } from 'framer-motion';
import { childVariants, staggerVariants } from '../../common/Animation';
import { useSelector } from 'react-redux';
import { useDateFormatter } from "@react-aria/i18n";
import { downloadFile, parseDate } from '../../common/customHooks';

const GivenAssignments = ({ assignments, setAssignments, teacherId }) => {
    const { teacherAssignClassDetails } = useSelector(state => state.adminDashboard);
    const {isOpen, onOpen, onClose} = useDisclosure();
    const [assignmentDetails, setAssignmentDetails] = useState({});
    const [populatingKey, setPopulatingKey] = useState([...assignments]);
    const [searchKeyword, setSearchKeyword] = useState('');
    const searchModeArr = [
        { 'Department': teacherAssignClassDetails.dept },
        { 'Semester': teacherAssignClassDetails.sem }, 
        { 'Search by': ['Name', 'Subject'] }
    ];
    const initialSearchMode = {
        'Department': '',
        'Semester': '',
        'Search by': 'Name',
    };
    const [searchMode, setSearchMode] = useState(initialSearchMode);
    const [searchCategoryName, setSearchCategoryName] = useState('orgName');
    const [searchingEnabled, setSearchingEnabled] = useState(false);

    let formatter = useDateFormatter({dateStyle: "full"});  

    useEffect(() => {
        setPopulatingKey([...assignments])
    }, [assignments]);

    useEffect(() => {
        if(searchMode.Department === '' 
            && searchMode.Semester === '' 
            && searchKeyword.length === 0
        )setPopulatingKey([...assignments])
    }, [searchKeyword])

    const handleFileDelete = async(item) => {
        try {
            const semName = item.sem.split(' ').join('');
            const path = `${item?.department}/${semName}/${item?.name}`
            const columnName = `${item?.department}assignments`;

            const { data: assignmentTableDelData, error: assignmentTableDelError } = await supabase
                .from(columnName)
                .select(item.sem)
                .eq('uniqId', teacherId)
            
            if (assignmentTableDelError) {
                console.error('Error fetching updated assignments:', assignmentTableDelError.message);
                toast.error('An error occurred while fetching updated assignments', {
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    }
                });
                return;
            } else {
                // const updatedAssignmentsOnUI = assignments.filter(val => val[0].name !== item.name)
                // setAssignments(updatedAssignmentsOnUI);
                // setAssignmentDetails({});
                // setSearchKeyword('');
                // setSearchingEnabled(false);
                // setSearchMode(initialSearchMode)
            }

            console.log(assignmentTableDelData)
            
            const tempAssignmentArr = assignmentTableDelData[0][item.sem][item.subject];
            const filteredAssignmentArr = tempAssignmentArr.filter(val => val.name !== item.name);
            const assignmentToInsert = {[item.subject]: filteredAssignmentArr}
            console.log(assignmentToInsert)

            // const { data: storageData, error: storageError } = await supabase
            //     .storage
            //     .from('assignments')
            //     .remove([path]);

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
                
                const updatedAssignments = assignments
                    .filter(val => val[0].department === item.department)
                    .filter(val => val[0].name !== item.name)
                
                // Update teacher data with new assignments
                const { data: teacherAssignmentDelData, error: teacherAssignmentDelError } = await supabase
                    .from('teachers')
                    .update({ [columnName]: updatedAssignments })
                    .eq('uniqId', teacherId);

                if (teacherAssignmentDelError) {
                    console.error('Error updating teacher data:', teacherAssignmentDelError.message);
                    toast.error('An error occurred while updating teacher data', {
                        style: {
                            borderRadius: '10px',
                            background: '#333',
                            color: '#fff',
                        }
                    });
                    return;
                }

                

                // const { data: assignmentData, error: assignmentError } = await supabase
                //     .from(columnName)
                //     .update({ [item.sem]: filteredAssignmentArr })
                //     .eq('uniqId', teacherId)
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
                
            await downloadFile(downloadData, item);
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

    const handleFileDownloadToast = (value) => {
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

    const handleDeleteModal = (assignment) => {
        setAssignmentDetails(assignment)
        onOpen()
    };

    const handelSearch = (e) => {
        e.preventDefault();

        if (searchKeyword) {
            console.log(searchCategoryName,populatingKey)
            const filteredAssignments = populatingKey.filter(val => val[0][searchCategoryName].toLowerCase().includes(searchKeyword.toLowerCase()))
            if (filteredAssignments.length === 0) {
                toast.error(`No search result found for ${searchKeyword}`, {
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    }
                })
            }
            
            setPopulatingKey(filteredAssignments)
        }
    };

    useEffect(() => {
        if (searchingEnabled) {
            let sortedAssignments = [];
            
            if (searchMode.Department !== '') {
                const sortOnDept = teacherAssignClassDetails.dept[searchMode.Department]
                const sortedDeptAssignments = assignments.filter(val => val[0].department === sortOnDept)
                sortedAssignments.push(...sortedDeptAssignments)
                setPopulatingKey(sortedDeptAssignments)
            }

            if (searchMode.Semester !== '') {
                const sortOnSem = teacherAssignClassDetails.sem[searchMode.Semester].split(' ').join('');
                const sortedSemAssignments = sortedAssignments.filter(val => val[0].sem === sortOnSem)
                sortedAssignments.pop()
                sortedAssignments.push(...sortedSemAssignments)
                setPopulatingKey(sortedSemAssignments)
            }

            if (searchMode['Search by'] !== '') {
                const sortOnSub = Object.values(searchModeArr.filter(val => Object.keys(val)[0] === 'Search by')[0])[0]
                const categoryName = sortOnSub[searchMode['Search by']];
                categoryName === 'Name' ? setSearchCategoryName('orgName') : setSearchCategoryName('subject')
            }

            setSearchKeyword('')
        }
    }, [searchMode])

    const handelCancelSearch = (e) => {
        e.preventDefault();

        setSearchKeyword('');
        setSearchingEnabled(false);
        setPopulatingKey([...assignments])
        setSearchMode(initialSearchMode)
    };

    const handleSelectionChange = (e, indx) => {
        const currentKey = Object.keys(searchModeArr[indx])[0];
        const changedName = Array.from(e)[0];

        setSearchMode(prev => {
            const updatedSearchMode = {
                ...prev,
                [currentKey]: changedName
            };
            return updatedSearchMode;
        });
    };

    return (
        <div className=' bg-gradient-to-tl from-green-500 to-indigo-600 text-white px-3 py-3 rounded-lg w-full h-fit'>
            <div className=' border-b-2 pb-2'>
                <div className=' flex flex-col sm:flex-row items-center justify-between gap-4'>
                    <div className='md:text-[1rem] lg:text-xl font-onest w-full flex items-center'>
                        Given Assignments ({populatingKey.length})
                    </div>

                    {/* category */}
                    <div className='w-full flex items-center justify-between sm:justify-end gap-3 md:gap-4 h-[3rem]'>
                        {searchModeArr.map((items, index) => {
                            const key = Object.keys(items)[0];
                            return (
                                <Dropdown key={index}>
                                    <DropdownTrigger>
                                        <Button className={`rounded-lg pl-4 transition-colors outline-none border-none bg-slate-950 w-full sm:w-[7.5rem] h-full font-mavenPro tracking-wider text-green-500 flex items-center justify-between text-[15px] md:text-md`}
                                        variant="bordered"
                                        onClick={() => setSearchingEnabled(true)}>
                                            {searchModeArr[index][key][searchMode[key]]  === undefined
                                                ? key
                                                : searchModeArr[index][key][searchMode[key]]
                                            }
                                        </Button>
                                    </DropdownTrigger>

                                    <DropdownMenu 
                                    closeOnSelect={false}
                                    aria-label="Static Actions"
                                    disallowEmptySelection
                                    className="w-full bg-slate-900 text-green-500 rounded-xl font-robotoMono"
                                    selectionMode="single"
                                    selectedKeys={new Set([searchMode[key]])}
                                    onSelectionChange={(e) => handleSelectionChange(e, index)}>
                                        {items[key].map((innerItem, indx) => (
                                            <DropdownItem key={indx}>
                                                {innerItem}
                                            </DropdownItem>
                                        ))}
                                    </DropdownMenu>
                                </Dropdown>
                            );
                        })}
                    </div>
                </div>

                {/* input */}
                <div className=' relative rounded-lg overflow-hidden mt-2 max-w-[50rem]'>
                    <input 
                        type="text" 
                        placeholder="Search"
                        className=' bg-[#2f3646] text-gray-300 font-onest tracking-wider pl-3 pr-9 md:pr-11 text-[14px] w-full outline-none border-none h-[3rem]'
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        value={searchKeyword}
                        onKeyDown={(e) => { (e.key === 'Enter') && handelSearch(e) }}
                    />

                    <button className=' absolute right-0 top-1/2 -translate-y-1/2 bg-slate-900 h-full px-1'
                    onClick={(e) => handelCancelSearch(e)}>
                        <RxCross2 className=' text-gray-300 text-xl' />
                    </button>
                </div>
            </div>

            {assignments.length ? (
                <motion.div className='mt-4 flex flex-wrap items-center gap-3'
                variants={staggerVariants}
                initial="initial"
                animate="animate">
                    {populatingKey.length > 0 ? (<>
                        {populatingKey?.map((assignment, indx) => (
                            <motion.div 
                            variants={childVariants}
                            className='bg-[#2f3646] rounded-xl p-3 flex flex-col gap-y-3 group w-full sm:w-fit max-w-full sm:max-w-[25rem] overflow-hidden cursor-pointer group transition-all' 
                            key={indx}>
                                <Tooltip color='secondary'
                                content={assignment[0].orgName}
                                className=' capitalize max-w-full sm:max-w-[20rem] md:max-w-full overflow-hidden md:overflow-visible flex flex-wrap items-start justify-center whitespace-normal text-balance text-white'
                                placement='top'>
                                    <div className='text-gray-300 font-bold font-robotoMono tracking-wider mb-2 line-clamp-1 w-fit  group-hover:translate-x-1 group-hover:-translate-y-[3px] transition-all'>
                                        {assignment[0].orgName}
                                    </div>
                                </Tooltip>

                                <div className='text-gray-300 font-onest tracking-wider flex flex-wrap gap-1.5 xl:gap-2.5 group-hover:translate-x-1  group-hover:-translate-y-1 transition-all'>
                                    <span className=' bg-slate-950 rounded-lg py-1 px-3 text-[14px]'>{assignment[0].sem}</span>
                                    <span className=' bg-slate-950 rounded-lg py-1 px-3 text-[14px]'>{assignment[0].department}</span>
                                    <span className=' bg-slate-950 rounded-lg py-1 px-3 text-[14px]'>{assignment[0].subject}</span>
                                </div>

                                <div className=' font-robotoMono text-sm bg-slate-950 w-fit px-3 py-1 rounded-lg group-hover:translate-x-1 group-hover:-translate-y-1 transition-all'>
                                    {assignment[0].submitDeadline && formatter.format(parseDate(assignment[0].submitDeadline))}
                                </div>

                                <div className=' flex items-center justify-between mt-3'>
                                    <button className=' bg-[#ae2222] px-2 py-1 text-[14px] rounded-lg flex items-center gap-x-1 text-red-300 font-bold font-lato tracking-wider w-fit active:scale-110 transition-all group-hover:translate-x-1'
                                    onClick={() => handleDeleteModal(assignment[0])}>
                                        <FaRegTrashAlt />
                                        Remove
                                    </button>

                                    <button className=' text-green-400 text-[17px] bg-green-900 p-2 rounded-xl active:scale-110 transition-all group-hover:-translate-x-1'
                                    onClick={() => handleFileDownloadToast(assignment[0])}>
                                        <FaDownload/>
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </>) : (
                        <div className=' text-lg font-robotoMono font-bold mt-3 bg-slate-800 py-2 px-3 rounded-lg w-full'>
                            No assignment found
                        </div>
                    )}
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
                        <Button color="danger" className=' text-md font-robotoMono' onPress={onClose}>
                            Close
                        </Button>

                        <Button 
                        color="primary" 
                        className=' text-md font-robotoMono'
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
