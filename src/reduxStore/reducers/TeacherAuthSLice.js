import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    session: {},
    teacherIsAuthenticated: true,
    selectedTeacherId: '',
    deptSemClasses: []
};

export const TeacherAuthSlice = createSlice({
    name: "teacherAuth",
    initialState,
    reducers: {
        setTeacherAuthentication: function(state, action) {
            state.teacherIsAuthenticated = action.payload;
        },
        setDeptSemClasses: function(state, action) {
            state.deptSemClasses = action.payload;
        }
    }
});

export const {
    setTeacherAuthentication,
    setDeptSemClasses
} = TeacherAuthSlice.actions;
