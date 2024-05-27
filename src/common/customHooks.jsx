import { useMemo } from "react";

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

export const downloadFile = async(downloadData) => {
    const url = URL.createObjectURL(downloadData);
    const link = document.createElement('a');
    link.href = url;
    link.download = item.orgName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
};

export const formatDate = (date) => {
    // const memoizedDate = useMemo(() => {
        console.log(date)
        const [year, month, day] = date.split('-');
        return `${month}/${day}/${year}`
    // }, [date]);

    return memoizedDate;
}