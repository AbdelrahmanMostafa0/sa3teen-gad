"use client";
// import {
//   updateAutoSwitch,
//   updateDisplayedTimer,
// } from "@/store/features/settingsSlice";
import { setActiveTab } from "@/store/features/timerSlice";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch } from "react-redux";
interface TimerProps {
  specificMinutes: number;
  isBreak?: boolean;
}
function usePomodoro({ specificMinutes = 25, isBreak = false }: TimerProps) {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(specificMinutes * 60);
  const [finished, setFinished] = useState<boolean>(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const alarmRef = useRef<HTMLAudioElement | null>(null);
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const dispatch = useDispatch();
  useEffect(() => {
    if (typeof window !== "undefined") {
      alarmRef.current = isBreak
        ? new Audio("/sound/elsho8l-sho8l.mp3")
        : new Audio("/sound/4tbna.mp3");
    }
  }, [isBreak]);
  useEffect(() => {
    if (!isActive || finished) {
      if (finished) {
        setHasStarted(false);
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, finished]);

  useEffect(() => {
    setTimeLeft(specificMinutes * 60);
  }, [specificMinutes]);

  // Handle timer completion side effects

  const minutes = useMemo(() => Math.floor(timeLeft / 60), [timeLeft]);
  const seconds = useMemo(() => timeLeft % 60, [timeLeft]);

  const formattedMinutes = useMemo(
    () => (minutes < 10 ? `0${minutes}` : `${minutes}`),
    [minutes]
  );
  const formattedSeconds = useMemo(
    () => (seconds < 10 ? `0${seconds}` : `${seconds}`),
    [seconds]
  );

  const togglePomodoro = () => {
    if (!hasStarted) {
      startPomodoro();
      return;
    }
    setIsActive((prev) => !prev);
  };
  useEffect(() => {
    if (isActive) {
      setHasStarted(true);
    }
  }, [isActive]);

  const startPomodoro = useCallback((): void => {
    setTimeLeft(specificMinutes * 60);
    setFinished(false);
    setIsActive(true);
    setHasStarted(true);
  }, [specificMinutes]);
  const stopPomodoro = useCallback((): void => {
    setIsActive(false);
  }, []);
  const resetPomodoro = useCallback((): void => {
    setIsActive(false);
    setHasStarted(false);
    setFinished(false);
    setTimeLeft(specificMinutes * 60);
  }, [specificMinutes]);

  useEffect(() => {
    if (timeLeft === 0 && isActive) {
      setFinished(true);
      resetPomodoro();
      setIsActive(false);
      alarmRef.current?.play();

      if (!isBreak) {
        dispatch(setActiveTab("shortBreak"));
      } else {
        dispatch(setActiveTab("focus"));
      }
    }
  }, [timeLeft, isActive, isBreak, dispatch, resetPomodoro]);
  return {
    isActive,
    togglePomodoro,
    timeLeft,
    minutes: formattedMinutes,
    seconds: formattedSeconds,
    finished,
    startPomodoro,
    stopPomodoro,
    resetPomodoro,
    hasStarted,
  };
}

export default usePomodoro;
