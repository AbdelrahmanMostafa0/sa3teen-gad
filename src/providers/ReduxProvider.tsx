"use client";
import { getToken } from "@/lib/auth";
import { fetchUser } from "@/store/features/userSlice";
import store from "@/store/store";
import { useEffect, useRef } from "react";
import { Provider } from "react-redux";

const ReduxProvider = ({ children }: { children: React.ReactNode }) => {
  const initialized = useRef(false);
  useEffect(() => {
    if (!initialized.current) {
      const token = getToken();
      if (token) {
        store.dispatch(fetchUser());
      }
      initialized.current = true;
    }
  }, []);
  return <Provider store={store}>{children}</Provider>;
};
export default ReduxProvider;
