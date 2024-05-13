import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    mode: '',
    teachers: [],
    students: [],
    dataForCanvas: [],
    teacherAssignClassDetails: {
        dept: ['MCA', 'MSc'],
        sem: ['1st sem', '2nd sem', '3rd sem', '4th sem'],
        subject: [
            'DSA',
            'DBMS',
            'OS',
            'Computer Networks',
            'IOT',
            'Software Engineering',
            'Computer Architecture',
            'AI',
            'ML',
            'Cybersecurity'
        ],
    }
    
};

export const AdminDashboardSlice = createSlice({
    initialState,
    name: "adminDashboard",
    reducers: {
        setMode: function(state, action) {
            state.mode = action.payload;
        },
        setTeachers: function(state, action) {
            state.teachers = action.payload;
            state.dataForCanvas = setDataForCanvas(state);
        },
        setStudents: function(state, action) {
            state.students = action.payload;
            state.dataForCanvas = setDataForCanvas(state)
        },
    }
});

export const {
    setMode,
    setTeachers,
    setStudents
} = AdminDashboardSlice.actions;

const setDataForCanvas = (state) => {
    switch (state.mode) {
        case 'teacher':
            return state.teachers;
        case 'student':
            return state.students;
        default:
            return [];
    }
};
