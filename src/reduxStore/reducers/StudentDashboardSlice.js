import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    studentData: {},
    studentIsAuthenticated: true
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