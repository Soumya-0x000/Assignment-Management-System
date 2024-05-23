import React, { useEffect, useState } from 'react';
import Uppy from '@uppy/core';
import { Dashboard } from '@uppy/react';
import GoogleDrive from '@uppy/google-drive';
import ImageEditor from '@uppy/image-editor';
import Tus from '@uppy/tus';
import ProgressBar from '@uppy/progress-bar';
import '@uppy/core/dist/style.css';
import '@uppy/dashboard/dist/style.css';
import '@uppy/drag-drop/dist/style.css';
import '@uppy/file-input/dist/style.css';
import '@uppy/progress-bar/dist/style.css';
import '@uppy/status-bar/dist/style.css';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { supabase } from '../../CreateClient';

const FileUploader = ({ currentValue }) => {
    const { teacherAssignClassDetails } = useSelector(state => state.adminDashboard);
    const [filePath, setFilePath] = useState('');

    const uppy = new Uppy({
        restrictions: {
            maxNumberOfFiles: 5,
            maxFileSize: 5 * 1024 * 1024,
            allowedFileTypes: ['.pdf', '.docx', '.jpg', '.jpeg', '.png']
        },
        autoProceed: false
    })
    .use(GoogleDrive, {
        companionUrl: 'https://companion.uppy.io',
        id: 'GoogleDrive'
    })
    .use(ImageEditor, { id: 'ImageEditor' })
    .use(Tus, { endpoint: 'https://tusd.tusdemo.net/files/', id: 'Tus' })
    .use(ProgressBar, { id: 'ProgressBar', hideAfterFinish: true });

    useEffect(() => {
        const semName = currentValue.sem.split(' ').join('');
        const pathName = `${currentValue.dept}/${semName}/`;
        setFilePath(pathName);
    }, [currentValue]);

    const handleRenameUpload = async () => {
        const files = uppy.getFiles();

        for (const [index, file] of files.entries()) {
            const semName = currentValue.sem.split(' ').join('');
            const subName = teacherAssignClassDetails.subjects.find(val => (val.name === currentValue.subject))?.fName;
            const newFileName = `${currentValue.dept}_${semName}_${subName}_${index}_${file.name}`;
            const fileBlob = file.data;
            const fullPath = `${filePath}${newFileName}`;

            try {
                const { data, error } = await supabase
                    .storage
                    .from('assignments')
                    .upload(fullPath, fileBlob, {
                        cacheControl: '3600',
                        upsert: false
                    });

                if (error) {
                    console.error(`Error uploading file ${newFileName}:`, error);
                    toast.error(`Can't upload`, {
                        style: {
                            borderRadius: '10px',
                            background: '#333',
                            color: '#fff',
                        }
                    })
                } else {
                    toast.success('Successfully uploaded', {
                        style: {
                            borderRadius: '10px',
                            background: '#333',
                            color: '#fff',
                        }
                    })
                }
            } catch (err) {
                console.error(`Error uploading file ${newFileName}:`, err);
                toast.error(`Can't upload`, {
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    }
                })
            }
        }
    };

    const handleRenameUploadToast = () => {
        toast.promise(handleRenameUpload(), {
            loading: 'Uploading files...',
            success: 'Files uploaded successfully',
            error: 'Failed to upload files'
        }, {style: {
                borderRadius: '10px',
                background: '#333',
                color: '#fff',
            }
        })
    };

    return (
        <div>
            <Dashboard
                uppy={uppy}
                plugins={['GoogleDrive', 'ImageEditor', 'ProgressBar', 'StatusBar']}
                theme='dark'
                hideProgressAfterFinish={true}
            />

            <button 
                className='bg-violet-600 rounded-xl px-3 py-2 absolute bottom-4'
                onClick={handleRenameUploadToast}>
                Upload Files
            </button>
        </div>
    );
}

export default FileUploader;
