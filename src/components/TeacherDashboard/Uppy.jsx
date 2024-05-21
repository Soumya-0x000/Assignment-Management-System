import React, { useEffect } from 'react';
import Uppy from '@uppy/core';
import { Dashboard } from '@uppy/react';
import RemoteSources from '@uppy/google-drive';
import ImageEditor from '@uppy/image-editor';
import Tus from '@uppy/tus';
import '@uppy/core/dist/style.css';
import '@uppy/dashboard/dist/style.css';
import '@uppy/webcam/dist/style.css';
import '@uppy/file-input/dist/style.css';
import '@uppy/progress-bar/dist/style.css';
import '@uppy/drag-drop/dist/style.css';

function Component() {
    const uppy = new Uppy({
        restrictions: {
            maxNumberOfFiles: 5, 
            maxFileSize: 5 * 1024 * 1024, 
            allowedFileTypes: ['.pdf', '.docx', '.jpg', '.jpeg', '.png']
        }
    })
    .use(RemoteSources, { companionUrl: 'https://companion.uppy.io', id: 'RemoteSources' })
    .use(ImageEditor, { target: 'body', id: 'ImageEditor' })
    .use(Tus, { endpoint: 'https://tusd.tusdemo.net/files/', id: 'Tus' });

  useEffect(() => {
    return () => uppy.close();
  }, [uppy]);

  return <Dashboard uppy={uppy} plugins={['RemoteSources', 'ImageEditor']} />;
}

export default Component;
