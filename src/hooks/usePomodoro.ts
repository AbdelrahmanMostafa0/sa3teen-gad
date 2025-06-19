"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

function usePomodoro({
  specificMinutes = 25,
  isBreak = false,
}: {
  specificMinutes?: number;
  isBreak?: boolean;
}) {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(specificMinutes * 60);
  const [finished, setFinished] = useState<boolean>(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const alarmRef = useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
    setTimeLeft(specificMinutes * 60);
    setFinished(false);
    if (isActive) {
      setIsActive(false);
    }
  }, [specificMinutes]);
  useEffect(() => {
    if (typeof window !== "undefined") {
      alarmRef.current = isBreak
        ? new Audio("/sound/elsho8l-sho8l.mp3")
        : new Audio("/sound/4tbna.mp3");
    }
  }, [isBreak]);

  useEffect(() => {
    if (!isActive || finished) {
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
  }, [isActive, finished]);

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
