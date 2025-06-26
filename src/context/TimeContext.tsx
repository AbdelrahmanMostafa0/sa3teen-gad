// context/TimeContext.tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

const TimeContext = createContext<Date | null>(null);

export const TimeProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Update every second

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <TimeContext.Provider value={currentTime}>{children}</TimeContext.Provider>
  );
};

export const useTime = () => {
  const context = useContext(TimeContext);
  if (context === null) {
    throw new Error("useTime must be used within a TimeProvider");
  }
  return context;
};
