import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    mode: '',
    teachers: [],
    students: [],
    dataForCanvas: [],
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
