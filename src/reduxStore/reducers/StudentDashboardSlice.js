import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    studentData: {},
    studentIsAuthenticated: true,
    tableName: ''
};

export const StudentDashboardSlice = createSlice({
    name: "studentDashboard",
    initialState,
    reducers: {
        setStudentData: (state, action) => {
            state.studentData = action.payload
        },
        setStudentTable: function(state, action) {
            state.tableName = action.payload
        }
    }
})

export const { 
    setStudentData, 
    setStudentTable 
} = StudentDashboardSlice.actions