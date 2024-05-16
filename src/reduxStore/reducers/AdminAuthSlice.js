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
        setSession: function(state, action) {
            state.session = action.payload;
        },
        setAdminAuthentication: function(state, action) {
            state.adminIsAuthenticated = action.payload;
        },
        setSelectedAdminId: function(state, action) {
            state.selectedAdminId = action.payload
            console.log(state.selectedAdminId)
        }
    }
});

export const {
    setAdminAuthentication,
    setSession,
    setSelectedAdminId
} = AdminAuthSlice.actions;
