import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    students: [],
    studentIsAuthenticated: true
}

export const StudentAuthSlice = createSlice({
    name: "studentAuth",
    initialState,
    reducers: {
        setStudentAuthentication: function(state, action) {
            state.studentIsAuthenticated = action.payload;
        },
        setStudents: function(state, action) {
            state.students = action.payload;
        }
    }
});

export const {
    setStudentAuthentication,
    setStudents
} = StudentAuthSlice.actions