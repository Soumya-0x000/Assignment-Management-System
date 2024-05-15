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
