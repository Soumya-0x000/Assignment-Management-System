import { configureStore } from "@reduxjs/toolkit";
import { AdminAuthSlice } from "./reducers/AdminAuthSlice";

export const store = configureStore({
    reducer: {
        adminAuth: AdminAuthSlice.reducer
    }
});