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
            { name: 'DSA', fName: 'DataStructuresAndAlgorithms' },
            { name: 'DBMS', fName: 'DatabaseManagementSystems' },
            { name: 'OS', fName: 'OperatingSystems' },
            { name: 'Computer Networks', fName: 'ComputerNetworks' },
            { name: 'IOT', fName: 'InternetOfThings' },
            { name: 'Software Engineering', fName: 'SoftwareEngineering' },
            { name: 'Computer Architecture', fName: 'ComputerArchitecture' },
            { name: 'AI', fName: 'ArtificialIntelligence' },
            { name: 'ML', fName: 'MachineLearning' },
            { name: 'Cybersecurity', fName: 'Cybersecurity' }
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
