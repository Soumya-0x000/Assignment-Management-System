import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    studentData: {},
    studentIsAuthenticated: true,
    subjectsArray: {
        MCA: [
            {'1stSem': [
                { name: 'DSA', fName: 'DataStructuresAndAlgorithms' },
                { name: 'DBMS', fName: 'DatabaseManagementSystems' },
                { name: 'OS', fName: 'OperatingSystems' },
                { name: 'Computer Networks', fName: 'ComputerNetworks' }
            ]},
            {'2ndSem': [
                { name: 'IOT', fName: 'InternetOfThings' },
                { name: 'Software Engineering', fName: 'SoftwareEngineering' },
                { name: 'Computer Architecture', fName: 'ComputerArchitecture' },
                { name: 'AI', fName: 'ArtificialIntelligence' }
            ]},
            {'3rdSem': [
                { name: 'ML', fName: 'MachineLearning' },
                { name: 'Cybersecurity', fName: 'Cybersecurity' },
                { name: 'Cloud Computing', fName: 'CloudComputing' },
                { name: 'Human-Computer Interaction', fName: 'HumanComputerInteraction' }
            ]},
            {'4thSem': [
                { name: 'Blockchain', fName: 'Blockchain' },
                { name: 'Quantum Computing', fName: 'QuantumComputing' },
                { name: 'Robotics', fName: 'Robotics' },
                { name: 'Data Science', fName: 'DataScience' }
            ]}
        ],
        MSc: [
            {'1stSem': [
                { name: 'Big Data', fName: 'BigData' },
                { name: 'Bioinformatics', fName: 'Bioinformatics' },
                { name: 'Game Development', fName: 'GameDevelopment' },
                { name: 'Embedded Systems', fName: 'EmbeddedSystems' }
            ]},
            {'2ndSem': [
                { name: 'Information Retrieval', fName: 'InformationRetrieval' },
                { name: 'DSA', fName: 'DataStructuresAndAlgorithms' },
                { name: 'DBMS', fName: 'DatabaseManagementSystems' },
                { name: 'OS', fName: 'OperatingSystems' }
            ]},
            {'3rdSem': [
                { name: 'Computer Networks', fName: 'ComputerNetworks' },
                { name: 'IOT', fName: 'InternetOfThings' },
                { name: 'Software Engineering', fName: 'SoftwareEngineering' },
                { name: 'Computer Architecture', fName: 'ComputerArchitecture' }
            ]},
            {'4thSem': [
                { name: 'AI', fName: 'ArtificialIntelligence' },
                { name: 'ML', fName: 'MachineLearning' },
                { name: 'Cybersecurity', fName: 'Cybersecurity' },
                { name: 'Cloud Computing', fName: 'CloudComputing' }
            ]}
        ]
    }
};

export const StudentDashboardSlice = createSlice({
    name: "studentDashboard",
    initialState,
    reducers: {
        setStudentInfo: (state, action) => {
            state.studentData = action.payload
        },
        
    }
})

export const { 
    setStudentInfo,
} = StudentDashboardSlice.actions