"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import LoggedInTasks from "./LoggedInTasks";
import UserTasks from "./UserTasks";

const TasksWrapper = () => {
    const isAuthenticated = useSelector(
        (state: RootState) => state.User.isAuthenticated
    );

    return isAuthenticated ? <LoggedInTasks /> : <UserTasks />;
};

export default TasksWrapper;
