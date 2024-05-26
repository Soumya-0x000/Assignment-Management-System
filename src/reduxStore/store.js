import { configureStore } from "@reduxjs/toolkit";
import { AdminAuthSlice } from "./reducers/AdminAuthSlice";
import { AdminDashboardSlice } from "./reducers/AdminDashboardSlice";
import { TeacherAuthSlice } from "./reducers/TeacherAuthSLice";
import { StudentAuthSlice } from "./reducers/StudentAuthSlice";

export const store = configureStore({
    reducer: {
        adminAuth: AdminAuthSlice.reducer,
        adminDashboard: AdminDashboardSlice.reducer,
        teacherAuth: TeacherAuthSlice.reducer,
        studentAuth: StudentAuthSlice.reducer,
    }
});