import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    teachers: [],
    students: [],
};

export const AdminDashboardSlice = createSlice({
    initialState,
    name: "admin_dashboard",
    reducers: {
        setTeachers: function(state, action) {
            state.teachers = action.payload
        },
        setStudents: function(state, action) {
            state.students = action.payload;
        }
    }
});

export const {
    setTeachers,
    setStudents
} = AdminDashboardSlice.actions;
