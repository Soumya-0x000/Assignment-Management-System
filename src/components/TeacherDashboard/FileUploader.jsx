import React, { useEffect, useState } from 'react';
import { supabase } from '../../CreateClient';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import FilePondPluginFileEncode from 'filepond-plugin-file-encode';
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';

registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageExifOrientation,
    FilePondPluginFileValidateSize,
    FilePondPluginFileEncode
);


const ClassicFileUploader = ({ currentValue, teacherId, onClose, setAssignments }) => {
    const { deptSemClasses } = useSelector(state => state.teacherAuth);
    const [subExistingArray, setSubExistingArray] = useState([]);
    const [filePath, setFilePath] = useState('');
    const [fileNameStarter, setFileNameStarter] = useState('');
    const [selectedFiles, setSelectedFiles] = useState([]);

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
            const newFileName = `${fileNameStarter}_${index}_${file.filename}`;
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
                        orgName: file.filename
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
            <div className=" h-full bg-slate-800 px-2 rounded-lg overflow-y-auto pt-2">
                <FilePond 
                    files={selectedFiles}
                    allowMultiple={true}
                    maxFiles={5}
                    allowReorder={true}
                    allowFileTypeValidation={true}
                    maxFileSize='5MB'
                    allowImageCrop={true}
                    imageCropAspectRatio='1:1'
                    labelIdle=' <span class="filepond--label-action no-underline font-montserrat text-violet-300">Drag & Drop your files or Browse</span>'
                    onupdatefiles={setSelectedFiles}
                    name="filepond"
                />
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
