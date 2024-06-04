import { useMemo } from "react";
import toast from "react-hot-toast";

export const formatSemester = (sem) => {
    let semester = '';

    switch (sem) {
        case '0':
            semester = 'All semesters';
            break;
        case '1':
            semester = '1st semester';
            break;
        case '2':
            semester = '2nd semester';
            break;
        case '3':
            semester = '3rd semester';
            break;
        case '4':
            semester = '4th semester';
            break;
        default:
            semester = '';
    }
    return semester;
};

export const shorthandSemester = (semester) => {
    return semester.replace(/\b\d+(st|nd|rd|th)\b semester/g, (match) => match.replace('semester', 'sem'));
};

export const nameLogo = (name) => {
    return name.split(' ').map(a => ([...a][0]))
}

export const tableList = ['studentsSem1', 'studentsSem2', 'studentsSem3', 'studentsSem4'];

export const downloadFile = async (downloadData, item) => {
    try {
        if (!downloadData) {
            throw new Error('No data available for download');
        }

        const blob = new Blob([downloadData], { type: item.fileType || 'application/octet-stream' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = item.orgName || 'downloaded_file';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Download error:', error);
        toast.error('Download failed', {
            style: {
                borderRadius: '10px',
                background: '#333',
                color: '#fff',
            }
        });
    }
};

export const formatDate = (date) => {
    // const memoizedDate = useMemo(() => {
        console.log(date)
        const [year, month, day] = date.split('-');
        return `${month}/${day}/${year}`
    // }, [date]);

    return memoizedDate;
}

export const parseDate = (dateObj) => {
    const { year, month, day, hour, minute, second, millisecond, timeZone } = dateObj;
    const date = new Date(Date.UTC(year, month - 1, day, hour, minute, second, millisecond));
    return new Date(date.toLocaleString('en-US', { timeZone }));
};  