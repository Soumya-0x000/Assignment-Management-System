import React, { useEffect, useState } from 'react';
import { supabase } from '../../CreateClient';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';

const ClassicFileUploader = ({ currentValue, teacherId, onClose, setAssignments }) => {
    const { deptSemClasses } = useSelector(state => state.teacherAuth);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [filePath, setFilePath] = useState('');
    const [subExistingArray, setSubExistingArray] = useState([]);
    const [fileNameStarter, setFileNameStarter] = useState('');

    useEffect(() => {
        const semName = currentValue.sem.split(' ').join('');
        const pathName = `${currentValue.dept}/${semName}/`;
        setFilePath(pathName);

        const subArr = deptSemClasses[currentValue.dept][semName];
        setSubExistingArray(subArr);

        const subName = subExistingArray.find(val => (val.name === currentValue.subject))?.fName;
        const newFileName = `${currentValue.dept}_${semName}_${subName}`;
        setFileNameStarter(newFileName);
    }, [currentValue, subExistingArray, deptSemClasses]);

    const handleFileChange = (event) => {
        setSelectedFiles([...selectedFiles, ...Array.from(event.target.files)]);
    };

    const handleUpload = async () => {
        if (selectedFiles.length === 0) {
            toast.error('No files selected', {
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                }
            });
            return;
        }

        for (const [index, file] of Array.from(selectedFiles).entries()) {
            const newFileName = `${fileNameStarter}_${index}_${file.name}`;
            const fullPath = `${filePath}${newFileName}`;

            try {
                const { data, error } = await supabase
                    .storage
                    .from('assignments')
                    .upload(fullPath, file, {
                        cacheControl: '3600',
                        upsert: false
                    });

                if (error) {
                    console.error(`Error uploading file ${newFileName}:`, error);
                    if (error.error === 'Duplicate') {
                        toast.error(`File already exists`, {
                            style: {
                                borderRadius: '10px',
                                background: '#333',
                                color: '#fff',
                            }
                        });
                    }
                    return;
                } else {
                    toast.success('Successfully uploaded', {
                        style: {
                            borderRadius: '10px',
                            background: '#333',
                            color: '#fff',
                        }
                    });

                    const columnName = `${currentValue.dept}assignments`;
                    const newAssignment = {
                        sem: currentValue.sem,
                        department: currentValue.dept,
                        subject: currentValue.subject,
                        name: newFileName,
                        orgName: file.name
                    };

                    // Fetch existing assignments
                    const { data: teacherData, error: teacherError } = await supabase
                        .from('teachers')
                        .select(columnName)
                        .eq('uniqId', teacherId)
                        .single();

                    if (teacherError) {
                        console.error('Error fetching teacher data:', teacherError.message);
                        toast.error('An error occurred while fetching teacher data');
                        return;
                    }

                    setAssignments(prev => [ ...prev, [newAssignment] ]);

                    let updatedAssignments = teacherData ? teacherData[columnName] || [] : [];
                    updatedAssignments.push([newAssignment]);

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
                        onClose();
                    }
                }
            } catch (err) {
                console.error(`Error uploading file ${newFileName}:`, err);
                toast.error(`Can't upload`, {
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    }
                });
            }
        }
    };

    return (
        <div className='mt-4 rounded-lg h-full relative'>
            <div className=" h-full bg-slate-800 px-2 rounded-lg overflow-y-auto">
                <input type="file" multiple onChange={handleFileChange} />
                {selectedFiles.length > 0 && (
                    <ul>
                        {selectedFiles.map((file, index) => (
                            <li key={index} className="flex justify-between items-center bg-gray-900 p-2 my-2 rounded ">
                                <span className=' line-clamp-1'>{file.name}</span>
                                <button 
                                    className="bg-red-500 text-white px-2 py-1 rounded" 
                                    onClick={() => handleRemoveFile(index)}
                                >
                                    Remove
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <button 
                className='bg-violet-600 rounded-xl px-3 py-2.5 absolute -bottom-[65px]'
                onClick={handleUpload}>
                Upload Files
            </button>
        </div>
    );
};

export default ClassicFileUploader;
