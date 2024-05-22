import React, { useEffect } from 'react';
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

const FileUploader = ({ currentValue }) => {
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
    .use(ProgressBar, { id: 'ProgressBar', hideAfterFinish: true })

    useEffect(() => {
        return () => uppy.close();
    }, [uppy]);
    console.log(currentValue)

    return (
        <div>
            <Dashboard
                uppy={uppy}
                plugins={['GoogleDrive', 'ImageEditor', 'ProgressBar', 'StatusBar']}
                theme='dark'
                hideProgressAfterFinish={true}
            />

            <button 
            className=' bg-violet-600 rounded-xl px-3 py-2 absolute bottom-4'
            onClick={() => uppy.upload()}>
                Upload Files
            </button>
        </div>
    );
}

export default FileUploader;
