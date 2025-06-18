"use client";

import { useEffect, useMemo, useRef, useState } from "react";

// const minutes = 25;
function usePomodoro({ sepcificMinutes }: { sepcificMinutes: number }) {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [secondPassed, setSecondPassed] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);
  // const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [finished, setFinished] = useState<boolean>(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isActive) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }
    if (finished) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      setSecondPassed((prev) => prev + 1);
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, finished]);
  // useEffect(() => {
  //   if (!isActive) {
  //     if (intervalId) {
  //       clearInterval(intervalId);
  //       setIntervalId(null);
  //     }
  //     return;
  //   }

  //   const id = setInterval(() => {
  //     setSecondPassed((prev) => prev + 1);
  //     setSeconds((prev) => prev + 1);
  //   }, 1000);
  //   setIntervalId(id);

  //   return () => {
  //     if (intervalId) {
  //       clearInterval(intervalId);
  //     }
  //   };
  // }, [isActive]);
  useEffect(() => {
    const MinutesPassed: number = Math.floor(secondPassed / 60);
    setMinutes(MinutesPassed);
    if (MinutesPassed === sepcificMinutes) {
      setFinished(true);
      setIsActive(false);
      setSecondPassed(0);
    }
  }, [secondPassed, sepcificMinutes]);
  useEffect(() => {
    setSeconds(0);
  }, [minutes]);

  const getSecondPassed = useMemo(() => {
    if (seconds < 10) {
      return `0${seconds}`;
    } else {
      return seconds;
    }
  }, [seconds]);
  const getMinutes = useMemo(() => {
    if (minutes < 10) {
      return `0${minutes}`;
    } else {
      return minutes;
    }
  }, [minutes]);
  const togglePomodoro = () => {
    setFinished((prev) => !prev);
    setIsActive((prev) => !prev);
  };
  console.log("isActive", isActive);

  return {
    isActive,
    togglePomodoro,
    secondPassed,
    minutes: getMinutes,
    seconds: getSecondPassed,
    finished,
  };
}
export default usePomodoro;
