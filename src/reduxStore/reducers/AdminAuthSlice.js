import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    session: {},
    adminIsAuthenticated: true,
    selectedAdminId: ''
};

export const AdminAuthSlice = createSlice({
    name: "adminAuth",
    initialState,
    reducers: {
        setAdminAuthentication: function(state, action) {
            state.adminIsAuthenticated = action.payload;
        },
        setSelectedAdminId: function(state, action) {
            state.selectedAdminId = action.payload
        }
    }
});

export const {
    setAdminAuthentication,
    setSelectedAdminId
} = AdminAuthSlice.actions;
