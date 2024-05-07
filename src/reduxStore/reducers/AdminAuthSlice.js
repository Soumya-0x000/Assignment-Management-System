import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    adminIsAuthenticated: false
};

export const AdminAuthSlice = createSlice({
    name: "adminAuth",
    initialState,
    reducers: {
        setAdminAuthentication: function(state, action) {
            state.adminIsAuthenticated = action.payload;
        }
    }
});

export const {
    setAdminAuthentication,
} = AdminAuthSlice.actions;