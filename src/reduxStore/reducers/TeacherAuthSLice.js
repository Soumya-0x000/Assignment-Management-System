import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    session: {},
    teacherIsAuthenticated: true,
    selectedTeacherId: ''
};

export const TeacherAuthSlice = createSlice({
    name: "teacherAuth",
    initialState,
    reducers: {
        setTeacherAuthentication: function(state, action) {
            state.teacherIsAuthenticated = action.payload;
        },
    }
});

export const {
    setTeacherAuthentication,
} = TeacherAuthSlice.actions;
