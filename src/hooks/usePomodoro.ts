"use client";

import { useEffect, useMemo, useRef, useState } from "react";

// const minutes = 25;
function usePomodoro({
  specificMinutes = 25,
  isBreak = false,
}: {
  specificMinutes?: number;
  isBreak?: boolean;
}) {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [secondPassed, setSecondPassed] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);
  // const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [finished, setFinished] = useState<boolean>(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const alarm = useMemo(() => {
    return isBreak
      ? new Audio("/sound/elsho8l-sho8l.mp3")
      : new Audio("/sound/alarm-digital.mp3");
  }, []);

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
  useEffect(() => {}, []);
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
    if (MinutesPassed === specificMinutes) {
      setFinished(true);
      alarm.play();
      setIsActive(false);
      setSecondPassed(0);
    }
  }, [secondPassed, specificMinutes]);
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
    setIsActive((prev) => !prev);
  };
  const startPomodoro = (): void => {
    setFinished(false);
    setIsActive(true);
  };
  return {
    isActive,
    togglePomodoro,
    secondPassed,
    minutes: getMinutes,
    seconds: getSecondPassed,
    finished,
    startPomodoro,
  };
}
export default usePomodoro;
