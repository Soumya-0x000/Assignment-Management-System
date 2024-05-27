import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    mode: '',
    teachers: [],
    students: [],
    dataForCanvas: [],
    teacherAssignClassDetails: {
        dept: ['MCA', 'MSc'],
        sem: ['1st Sem', '2nd Sem', '3rd Sem', '4th Sem'],
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
            { name: 'Cybersecurity', fName: 'Cybersecurity' },
            { name: 'Cloud Computing', fName: 'CloudComputing' },
            { name: 'Human-Computer Interaction', fName: 'HumanComputerInteraction' },
            { name: 'Blockchain', fName: 'Blockchain' },
            { name: 'Quantum Computing', fName: 'QuantumComputing' },
            { name: 'Robotics', fName: 'Robotics' },
            { name: 'Data Science', fName: 'DataScience' },
            { name: 'Big Data', fName: 'BigData' },
            { name: 'Bioinformatics', fName: 'Bioinformatics' },
            { name: 'Game Development', fName: 'GameDevelopment' },
            { name: 'Embedded Systems', fName: 'EmbeddedSystems' },
            { name: 'Information Retrieval', fName: 'InformationRetrieval' }
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
