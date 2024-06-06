import React, { useEffect, useState } from 'react'
import { setDeptSemSubjects } from '../../../reduxStore/reducers/AdminDashboardSlice';
import toast from 'react-hot-toast';
import { supabase } from '../../../CreateClient';
import { useDispatch, useSelector } from 'react-redux';
import { IoIosAdd } from "react-icons/io";
import { CiEdit } from "react-icons/ci";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react';
import { MdDeleteOutline } from "react-icons/md";

const AllSubjects = () => {
    const dispatch = useDispatch();
    const [subjectsInfo, setSubjectsInfo] = useState([]);
    const { teacherAssignClassDetails } = useSelector(state => state.adminDashboard);
    const [subToInsertInfo, setSubToInsertInfo] = useState({
        dept: '',
        sem: ''
    });
    const [subToEditInfo, setSubToEditInfo] = useState({
        dept: '',
        sem: '',
        sub: ''
    });
    const [subToDelInfo, setSubToDelInfo] = useState({
        dept: '',
        sem: '',
        sub: ''
    });
    const [insertingValue, setInsertingValue] = useState({
        name: '',
        fName: ''
    });
    const [editingValue, setEditingValue] = useState({
        name: '',
        fName: ''
    });
    const [isModalOpen, setIsModalOpen] = useState({
        insert: false,
        delete: false,
        edit: false
    })
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

    const toggleModalVisibility = (mode, toggleValue) => {
        setIsModalOpen(prev => ({ 
            ...prev, 
            [mode]: toggleValue 
        }))
    }

    const handleChange = (name, e, mode) => {
        const { value } = e.target;

        if (mode === 'insert') {
            setInsertingValue({
                ...insertingValue,
                [name]: value
            });
        } else if (mode === 'edit') {
            setEditingValue(prev => ({
                ...prev,
                [name]: value
            }))
        }
    };

    const actualSemName = (semester) => {
        return teacherAssignClassDetails.sem.find(val => val.startsWith(...semester))
    };

    const insertModal = (dept, sem) => {
        setInsertingValue({ name: '', fName: ''})
        setSubToInsertInfo({dept, sem});
        toggleModalVisibility('insert', true)
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
                setSubjectsInfo(newSubjectsInfo);
                dispatch(setDeptSemSubjects(newSubjectsInfo[0]));
                toggleModalVisibility('insert', false);
                
                toast.success('Subject inserted successfully', {
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    }
                });
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
        if (insertingValue.fName !== '') {
            if (insertingValue.name === '') {
                const updatedValue = insertingValue
                updatedValue.name = insertingValue.fName
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
        } else {
            toast.error('Insert a subject first!', {
                icon: '⚠️',
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                }
            })
        }
    };

    const editModal = (dept, sem, sub) => {
        setEditingValue({ 
            name: sub.name, 
            fName: sub.fName
        })
        setSubToEditInfo({dept, sem, sub});
        toggleModalVisibility('edit', true)
    };

    const handleEdit = async () => {
        try {
            const newSubjectsInfo = JSON.parse(JSON.stringify(subjectsInfo));
            
            const selectedSubArr = newSubjectsInfo[0][subToEditInfo.dept][subToEditInfo.sem];
            const filteredSubArr = selectedSubArr.filter(item => item.fName !== subToEditInfo.sub.fName);
            filteredSubArr.push(editingValue)
            
            newSubjectsInfo[0][subToEditInfo.dept][subToEditInfo.sem] = filteredSubArr;

            const { data: editData, error: editError } = await supabase
                .from('subjects')
                .update({ [subToEditInfo.dept]: newSubjectsInfo[0][subToEditInfo.dept] })
                .eq('id', subjectsInfo[0].id);

            if (editError) {
                console.error('Error occurred during editing', editError);
                toast.error('Error occurred during editing', {
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    }
                });
                return;
            } else {
                setSubjectsInfo(newSubjectsInfo);
                dispatch(setDeptSemSubjects(newSubjectsInfo[0]));
                toggleModalVisibility('edit', false);

                toast.success('Subject edited successfully', {
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    }
                });
            }
        } catch (error) {
            console.error('Error occurred', error);
            toast.error('Error occurred during editing', {
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                }
            });
        }
    };

    const handleEditToast = () => {
        const isChanged = (editingValue.fName !== subToEditInfo.sub.fName) || (editingValue.name !== subToEditInfo.sub.name)
       
        if (isChanged) {
            if (editingValue.fName !== '') {
                if (editingValue.name === '') {
                    const updatedValue = editingValue
                    updatedValue.name = editingValue.fName
                    setEditingValue(updatedValue)
                }

                toast.promise(handleEdit(), {
                    loading: 'Editing subject...',
                    success: 'Subject edited successfully!',
                    error: 'Failed to edit subject!'
                }, {style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    }
                })
            } else {
                toast.error(`Full name can't be empty!`, {
                    icon: '⚠️',
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    }
                })
            }
        } else {
            toast.error(`Nothing to edit!`, {
                icon: '⚠️',
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                }
            })
        }
    };

    const deleteModal = (dept, sem, sub) => {
        setSubToDelInfo({dept, sem, sub})
        toggleModalVisibility('delete', true)
    };

    const handleDelete = async () => {
        try {
            const newSubjectsInfo = JSON.parse(JSON.stringify(subjectsInfo));
        
            const selectedSubArr = newSubjectsInfo[0][subToDelInfo.dept][subToDelInfo.sem];
            const filteredSubArr = selectedSubArr.filter(item => item.fName !== subToDelInfo.sub.fName);
            
            newSubjectsInfo[0][subToDelInfo.dept][subToDelInfo.sem] = filteredSubArr;

            const { data: delData, error: delError } = await supabase
                .from('subjects')
                .update({ [subToDelInfo.dept]: newSubjectsInfo[0][subToDelInfo.dept] })
                .eq('id', subjectsInfo[0].id);

            if (delError) {
                console.error('Error occurred during deletion', delError);
                toast.error('Error occurred during deletion', {
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    }
                });
                return;
            }

            setSubjectsInfo(newSubjectsInfo);
            dispatch(setDeptSemSubjects(newSubjectsInfo[0]));
            toggleModalVisibility('delete', false);

            toast.success('Subject deleted successfully', {
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                }
            });
        } catch (error) {
            console.error('Error occurred during deletion', error);
            toast.error('Error occurred during deletion', {
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                }
            });
        }
    };

    const handleDeleteToast = () => {
        toast.promise(handleDelete(), {
            loading: 'Deleting subject...',
            success: 'Subject deleted successfully!',
            error: 'Failed to delete subject!'
        }, {style: {
                borderRadius: '10px',
                background: '#333',
                color: '#fff',
            }
        })
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
                    <div className=' w-full text-slate-300 flex flex-col-reverse md:flex-row items-start gap-4'
                    key={indx}>
                        {Object.entries(value).map(([dept, innerValue], innerIndx) => (
                            <div className=' w-full bg-slate-900 rounded-lg p-3 text-slate-300 space-y-8'
                            key={innerIndx}>
                                <div className=' text-blue-300 font-robotoMono tracking-wider text-lg font-bold bg-slate-800 w-full py-1 pl-3 rounded-lg'>
                                    {dept} Subjects
                                </div>

                                <div className=' w-full grid grid-cols-1 xl:grid-cols-2 gap-4'>
                                    {Object.entries(innerValue).map(([sem, sub], subIndx) => (
                                        <div 
                                        className=' bg-slate-800 rounded-lg overflow-hidden w-full'
                                        key={subIndx}>
                                            <div className=' font-robotoMono text-[17px] font-bold tracking-wide bg-slate-700 w-full pl-3 py-2'>
                                                {actualSemName(...sem[0])}
                                            </div>

                                            {/* subjects according to departments */}
                                            <div className=' pl-5 lg:pl-3 xl:pl-5 pr-1 py-2 space-y-5'>
                                                <div className=' font-montserrat space-y-3'>
                                                    {sub.map((sub, innerSubIndex) => (
                                                        <div className=' text-[14px] xl:text-[15px] tracking-wide line-clamp-1 w-full flex  items-center justify-between py-1 pr-1'
                                                        key={innerSubIndex}>
                                                            <span className=' xl:hidden 2xl:block line-clamp-1 xl:text-[14px] 2xl:text-[15px]'>
                                                                {innerSubIndex+1}) {sub.fName}
                                                            </span>
                                                            
                                                            <span className=' hidden xl:block 2xl:hidden line-clamp-1'>
                                                                {sub.name}
                                                            </span>

                                                            {/* del and edit */}
                                                            <div className=' flex gap-x-2 lg:gap-x-1 xl:gap-x-2'>
                                                                <button className=' w-fit rounded-lg md:p-[1px] hover:scale-125 text-red-500 transition-all md:hover:scale-110'
                                                                onClick={() => deleteModal(dept, sem, sub)}>
                                                                    <MdDeleteOutline className=' text-[1.3rem]'/>
                                                                </button>

                                                                <button className=' w-fit rounded-lg md:p-[1px] hover:scale-125 text-yellow-300 transition-all md:hover:scale-110'
                                                                onClick={() => editModal(dept, sem, sub)}>
                                                                    <CiEdit className=' text-[1.2rem]'/>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                                
                                                {/* insert */}
                                                {(sub.length < maxSubLength) && (
                                                    <button className=' w-fit rounded-full bg-blue-400 text-blue-800 hover:rotate-90 transition-all active:scale-125'
                                                    onClick={() => insertModal(dept, sem)}>
                                                        <IoIosAdd
                                                            className=' text-[1.5rem]'
                                                        />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            <Modal backdrop={'blur'} isOpen={isModalOpen.insert} onClose={() => toggleModalVisibility('insert', false)} className=' bg-slate-700'>
                <ModalContent>
                {() => (<>
                    <ModalHeader className=" font-robotoMono text-white">Insert new subject in {subToInsertInfo.dept} {actualSemName(...subToInsertInfo.sem[0])}</ModalHeader>

                    <ModalBody>
                        <input 
                            type="text" 
                            placeholder='Full name'
                            autoFocus
                            required
                            className={` w-full bg-slate-800 px-4 py-3 font-robotoMono text-green-400 rounded-lg outline-none ${insertingValue.fName !== '' && 'border-2 border-green-500'} focus:border-2 focus:border-green-500`}
                            onKeyDown={(e) => {e.key === 'Enter' && handleInsertToast()}}
                            value={insertingValue.fName}
                            onChange={(e) => handleChange('fName', e, 'insert')}
                        />
                        
                        <input 
                            type="text" 
                            placeholder='Subject name (acronym)'
                            className={` w-full bg-slate-800 px-4 py-3 font-robotoMono text-green-400 rounded-lg outline-none ${insertingValue.name !== '' && 'border-2 border-green-500'} focus:border-2 focus:border-green-500`}
                            value={insertingValue.name}
                            onKeyDown={(e) => {e.key === 'Enter' && handleInsertToast()}}
                            onChange={(e) => handleChange('name', e, 'insert')}
                        />
                    </ModalBody>

                    <ModalFooter>
                        <Button className=' font-robotoMono' color="danger" variant="shadow" onPress={() => toggleModalVisibility('insert', false)}>
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
            
            <Modal backdrop={'blur'} isOpen={isModalOpen.edit} onClose={() => toggleModalVisibility('edit', false)} className=' bg-slate-700'>
                <ModalContent>
                {() => (<>
                    <ModalHeader className=" font-robotoMono text-white">Edit {subToEditInfo.sub.fName} in {subToEditInfo.dept} {actualSemName(...subToEditInfo.sem[0])}</ModalHeader>

                    <ModalBody>
                        <input 
                            type="text" 
                            placeholder='Full name'
                            autoFocus
                            required
                            className={` w-full bg-slate-800 px-4 py-3 font-robotoMono text-green-400 rounded-lg outline-none ${insertingValue.fName !== '' && 'border-2 border-green-500'} focus:border-2 focus:border-green-500`}
                            onKeyDown={(e) => {e.key === 'Enter' && handleInsertToast()}}
                            value={editingValue.fName}
                            onChange={(e) => handleChange('fName', e, 'edit')}
                        />
                        
                        <input 
                            type="text" 
                            placeholder='Subject name (acronym)'
                            className={` w-full bg-slate-800 px-4 py-3 font-robotoMono text-green-400 rounded-lg outline-none ${insertingValue.name !== '' && 'border-2 border-green-500'} focus:border-2 focus:border-green-500`}
                            value={editingValue.name}
                            onChange={(e) => handleChange('name', e, 'edit')}
                            onKeyDown={(e) => {e.key === 'Enter' && handleInsertToast()}}
                        />
                    </ModalBody>

                    <ModalFooter>
                        <Button className=' font-robotoMono' color="danger" variant="shadow" onPress={() => toggleModalVisibility('edit', false)}>
                            Close
                        </Button>

                        <Button className=' font-robotoMono' color="primary" variant="shadow"
                        onClick={handleEditToast}>
                            Save
                        </Button>
                    </ModalFooter>
                </>)}
                </ModalContent>
            </Modal>
            
            <Modal backdrop={'blur'} isOpen={isModalOpen.delete} onClose={() => toggleModalVisibility('delete', false)} className=' bg-slate-700'>
                <ModalContent>
                {() => (<>
                    <ModalHeader className=" font-robotoMono text-white tracking-wide leading-8">You want to remove {subToDelInfo.sub.fName} from {subToDelInfo.dept} {actualSemName(...subToDelInfo.sem[0])} ?</ModalHeader>

                    <ModalFooter>
                        <Button className=' font-robotoMono' color="danger" variant="shadow" onPress={() => toggleModalVisibility('delete', false)}>
                            Close
                        </Button>

                        <Button className=' font-robotoMono' color="primary" variant="shadow"
                        onClick={handleDeleteToast}>
                            Delete
                        </Button>
                    </ModalFooter>
                </>)}
                </ModalContent>
            </Modal>
        </div>
    );
}

export default AllSubjects;
