import { configureStore } from "@reduxjs/toolkit";
import { AdminAuthSlice } from "./reducers/AdminAuthSlice";
import { AdminDashboardSlice } from "./reducers/AdminDashboardSlice";
import { TeacherAuthSlice } from "./reducers/TeacherAuthSLice";
import { StudentAuthSlice } from "./reducers/StudentAuthSlice";
import { StudentDashboardSlice } from "./reducers/StudentDashboardSlice";

export const store = configureStore({
    reducer: {
        adminAuth: AdminAuthSlice.reducer,
        teacherAuth: TeacherAuthSlice.reducer,
        studentAuth: StudentAuthSlice.reducer,
        adminDashboard: AdminDashboardSlice.reducer,
        studentDashboard: StudentDashboardSlice.reducer,
    }
});