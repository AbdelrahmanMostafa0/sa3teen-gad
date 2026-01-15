"use client";
import Cookies from "js-cookie";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import LoggedInTasks from "./LoggedInTasks";
import UserTasks from "./UserTasks";

const TasksWrapper = () => {
  console.log("token", Cookies.get("token"));
  console.log("guestId", Cookies.get("guestId"));
  const isAuthenticated = useSelector(
    (state: RootState) => state.User.isAuthenticated
  );

  return isAuthenticated ? <LoggedInTasks /> : <UserTasks />;
};

export default TasksWrapper;
