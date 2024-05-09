import { configureStore } from "@reduxjs/toolkit";
import { AdminAuthSlice } from "./reducers/AdminAuthSlice";
import { AdminDashboardSlice } from "./reducers/AdminDashboardSlice";

export const store = configureStore({
    reducer: {
        adminAuth: AdminAuthSlice.reducer,
        adminDashboard: AdminDashboardSlice.reducer,
    }
});