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
