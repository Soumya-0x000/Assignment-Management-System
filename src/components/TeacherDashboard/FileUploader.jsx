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
import { DatePicker } from '@nextui-org/react';
import { getLocalTimeZone, today, now } from "@internationalized/date";
import { useDateFormatter } from "@react-aria/i18n";

registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageExifOrientation,
    FilePondPluginFileValidateSize,
    FilePondPluginFileEncode
);

const FileUploader = ({ currentValue, teacherId, onClose, setAssignments }) => {
    const { deptSemClasses, teacherData } = useSelector(state => state.teacherAuth);

    const [subExistingArray, setSubExistingArray] = useState([]);
    const [filePath, setFilePath] = useState('');
    const [fileNameStarter, setFileNameStarter] = useState('');
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [deadline, setDeadline] = useState(now(getLocalTimeZone()));

    let formatter = useDateFormatter({dateStyle: "full"});
    
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
    
        if (!deadline) {
            toast('Please select a deadline', {
                icon: '⚠️',
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                }
            });
            return;
        }
    
        for (const [index, fileItem] of selectedFiles.entries()) {
            const file = fileItem.file;
            const newFileName = `${fileNameStarter}_${index}_${fileItem.filename}`;
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
                    toast.error(`File already exists or other upload error`, {
                        style: {
                            borderRadius: '10px',
                            background: '#333',
                            color: '#fff',
                        }
                    });
                    return;
                } else {
                    const columnName = `${currentValue.dept}assignments`;
                    const newAssignment = [{
                        sem: currentValue.sem,
                        department: currentValue.dept,
                        subject: currentValue.subject,
                        name: newFileName,
                        orgName: fileItem.filename,
                        submitDeadline: deadline
                    }];
    
                    // Fetch existing assignments
                    const { data: teacherAssignmentData, error: teacherError } = await supabase
                        .from('teachers')
                        .select(columnName)
                        .eq('uniqId', teacherId)
                        .single();
    
                    if (teacherError) {
                        console.error('Error fetching teacher data:', teacherError.message);
                        toast.error('An error occurred while fetching teacher data');
                        return;
                    }
    
                    setAssignments(prev => [...prev, newAssignment]);
    
                    let updatedAssignments = teacherAssignmentData ? teacherAssignmentData[columnName] || [] : [];
                    updatedAssignments.push(newAssignment);
    
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
                    }

                   insertOnAssignmentTable(newAssignment, columnName);
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

    const insertOnAssignmentTable = async (newAssignment, tableName) => {
        const assignmentTableContent = newAssignment[0];
        const GivenBy = `${teacherData.title} ${teacherData.name}`;
    
        // Fetch the existing record for the teacher
        const { data: existingData, error: fetchError } = await supabase
            .from(tableName)
            .select('*')
            .eq('uniqId', teacherId)
            .single();
    
        if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116: no rows found
            console.error('Error fetching existing assignments:', fetchError.message);
            toast.error('Error occurred while fetching existing assignments', {
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                }
            });
            return;
        }
    
        let updatedAssignments = existingData ? existingData[currentValue.sem] || {} : {};
        
        // Ensure the subject key exists in the updatedAssignments
        if (!updatedAssignments[assignmentTableContent.subject]) {
            updatedAssignments[assignmentTableContent.subject] = [];
        }
    
        // Append the new assignment to the subject array
        updatedAssignments[assignmentTableContent.subject].push(assignmentTableContent);
    
        // Upsert the updated assignments
        const { data: assignmentTableData, error: assignmentTableError } = await supabase
            .from(tableName)
            .upsert({
                uniqId: teacherId,
                [currentValue.sem]: updatedAssignments,
                GivenBy
            }, {
                onConflict: ['uniqId']
            });
    
        if (assignmentTableError) {
            console.error('Error updating assignments:', assignmentTableError.message);
            toast.error('Error occurred on assignment uploading', {
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                }
            });
            return;
        }
    
        onClose();
        toast.success('Successfully uploaded', {
            style: {
                borderRadius: '10px',
                background: '#333',
                color: '#fff',
            }
        });
    };
    
    const handleUploadToast = () => {
        toast.promise(handleUpload(), {
            loading: 'Uploading...',
            success: 'File uploaded successfully',
            error: 'Error in uploading file'
        }, {
            style: {
                borderRadius: '10px',
                background: '#333',
                color: '#fff',
            }
        });
    };
    
    return (
        <div className='mt-4 rounded-lg h-full relative'>
            <div className="h-full bg-slate-800 px-2 rounded-lg overflow-y-auto py-2">
                <FilePond
                    files={selectedFiles}
                    allowMultiple={true}
                    maxFiles={5}
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

                <div className="w-full flex flex-col gap-y-2">
                    <p className="text-white font-robotoMono text-sm">
                        Deadline: {deadline && formatter.format(deadline.toDate(getLocalTimeZone()))}
                    </p>

                    <DatePicker 
                        hideTimeZone
                        showMonthAndYearPickers
                        isRequired
                        className=" w-full" 
                        isInvalid
                        minValue={today(getLocalTimeZone())}
                        defaultValue={now(getLocalTimeZone())}
                        onChange={setDeadline} 
                    />
                </div>
            </div>

            <button
                className='bg-violet-600 rounded-xl px-3 py-2.5 absolute -bottom-[65px] font-robotoMono'
                onClick={handleUploadToast}>
                Upload Files
            </button>
        </div>
    );
};

export default FileUploader;
