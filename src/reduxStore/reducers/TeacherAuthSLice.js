import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    session: {},
    teacherIsAuthenticated: true,
    selectedTeacherId: '',
    deptSemClasses: {},
    teacherData: [],
    assignmentToRender: []
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
        },
        setTeacherInfo: function(state, action) {
            state.teacherData = action.payload;
            console.log(state.teacherData)

        },
        setAssignmentToRender: function(state, action) {
            state.assignmentToRender = action.payload;
        }
    }
});

export const {
    setTeacherAuthentication,
    setDeptSemClasses,
    setTeacherInfo,
    setAssignmentToRender
} = TeacherAuthSlice.actions;
