"use client";

import {
  updateAutoSwitch,
  updateDisplayedTimer,
} from "@/store/features/settingsSlice";
import { RootState } from "@/store/store";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
interface TimerProps {
  specificMinutes?: number;
  isBreak?: boolean;
}
function usePomodoro({ specificMinutes = 25 }: TimerProps) {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(specificMinutes * 60);
  const [finished, setFinished] = useState<boolean>(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const alarmRef = useRef<HTMLAudioElement | null>(null);
  const { displayedTimer, shortBreakDuration, focusDurationTime } = useSelector(
    (state: RootState) => state.Settings
  );
  const dispatch = useDispatch();
  const isBreak = displayedTimer.toLocaleLowerCase().includes("break");
  useEffect(() => {
    if (typeof window !== "undefined") {
      alarmRef.current = isBreak
        ? new Audio("/sound/elsho8l-sho8l.mp3")
        : new Audio("/sound/4tbna.mp3");
    }
  }, [isBreak]);
  useEffect(() => {}, [isBreak]);
  useEffect(() => {
    if (!isActive || finished) {
      if (finished) {
        dispatch(updateDisplayedTimer(isBreak ? "focus" : "shortBreak"));
      }
      console.log("outside");
      if (finished && !isBreak) {
        dispatch(updateAutoSwitch(true));
        console.log("auto switch");
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setFinished(true);
          setIsActive(false);
          alarmRef.current?.play();
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
  }, [isActive, finished, dispatch, isBreak]);
  useEffect(() => {
    setTimeLeft(specificMinutes * 60);
  }, [, shortBreakDuration, focusDurationTime, specificMinutes]);

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
    setIsActive((prev) => !prev);
  };

  const startPomodoro = useCallback((): void => {
    setTimeLeft(specificMinutes * 60);
    setFinished(false);
    setIsActive(true);
  }, [specificMinutes]);
  const stopPomodoro = useCallback((): void => {
    setIsActive(false);
  }, []);
  return {
    isActive,
    togglePomodoro,
    timeLeft,
    minutes: formattedMinutes,
    seconds: formattedSeconds,
    finished,
    startPomodoro,
    stopPomodoro,
  };
}

export default usePomodoro;
