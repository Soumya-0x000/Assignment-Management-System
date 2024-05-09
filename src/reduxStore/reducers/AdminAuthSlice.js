import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    session: {},
    adminIsAuthenticated: true
};

export const AdminAuthSlice = createSlice({
    name: "adminAuth",
    initialState,
    reducers: {
        setSession: function(state, action) {
            state.session = action.payload;
        },
        setAdminAuthentication: function(state, action) {
            state.adminIsAuthenticated = action.payload;
        }
    }
});

export const {
    setAdminAuthentication,
    setSession
} = AdminAuthSlice.actions;
