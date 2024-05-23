import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    mode: '',
    teachers: [],
    students: [],
    dataForCanvas: [],
    teacherAssignClassDetails: {
        dept: ['MCA', 'MSc'],
        sem: ['1st sem', '2nd sem', '3rd sem', '4th sem'],
        subjects: [
            { name: 'DSA', fName: 'dataStructuresAndAlgorithms' },
            { name: 'DBMS', fName: 'databaseManagementSystems' },
            { name: 'OS', fName: 'operatingSystems' },
            { name: 'Computer Networks', fName: 'computerNetworks' },
            { name: 'IOT', fName: 'internetOfThings' },
            { name: 'Software Engineering', fName: 'softwareEngineering' },
            { name: 'Computer Architecture', fName: 'computerArchitecture' },
            { name: 'AI', fName: 'artificialIntelligence' },
            { name: 'ML', fName: 'machineLearning' },
            { name: 'Cybersecurity', fName: 'cybersecurity' }
        ]
        
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
        case 'search':
            return state.students;
        default:
            return [];
    }
};
