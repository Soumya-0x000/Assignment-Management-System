import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    session: {},
    teacherIsAuthenticated: true,
    selectedTeacherId: '',
    deptSemClasses: {},
    teacherData: [],
    assignmentToRender: [],
    gradeArr: [
        { value: 'A', score: '100%', color: 'bg-green-400 text-green-900' },
        { value: 'B', score: '80%', color: 'bg-yellow-300 text-yellow-900' },
        { value: 'C', score: '60%', color: 'bg-orange-400 text-orange-900' },
        { value: 'D', score: '40%', color: 'bg-red-400 text-red-900' },
        { value: 'E', score: '20%', color: 'bg-red-500 text-red-900' },
    ]
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
