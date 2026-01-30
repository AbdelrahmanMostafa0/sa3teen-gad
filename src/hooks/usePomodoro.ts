"use client";
import {
  completePomodoroSession,
  createPomodoroSession,
  pausePomodoroSession,
  resumePomodoroSession,
  terminatePomodoroSession,
  pingPomodoroSession,
  getPomodoroStats,
} from "@/services/pomodoro.service";
// import {
//   updateAutoSwitch,
//   updateDisplayedTimer,
// } from "@/store/features/settingsSlice";
import { setActiveTab } from "@/store/features/timerSlice";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useUser } from "./useUser";
import {
  pausePomodoro,
  resetPomodoroSession,
  resumePomodoro,
  setPomodoroSession,
  setPomodoroStats,
} from "@/store/features/pomodoroSlice";
import { RootState } from "@/store/store";
interface TimerProps {
  specificMinutes: number;
  isBreak?: boolean;
  type?: "focus" | "shortBreak" | "longBreak";
}
function usePomodoro({
  specificMinutes = 25,
  isBreak = false,
  type = "focus",
}: TimerProps) {
  const { isAuthenticated } = useUser();
  const [isActive, setIsActive] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(specificMinutes * 60);
  const [finished, setFinished] = useState<boolean>(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const pingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const alarmRef = useRef<HTMLAudioElement | null>(null);
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const dispatch = useDispatch();
  const { id } = useSelector((state: RootState) => state.Pomodoro);
  useEffect(() => {
    if (typeof window !== "undefined") {
      alarmRef.current =
        type === "focus"
          ? new Audio("/sound/elsho8l-sho8l.mp3")
          : new Audio("/sound/4tbna.mp3");
    }
  }, [type]);
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

  // Ping interval effect
  useEffect(() => {
    const shouldPing = isAuthenticated && id && isActive && !finished;

    if (shouldPing) {
      // Start pinging every 60 seconds
      pingIntervalRef.current = setInterval(async () => {
        try {
          await pingPomodoroSession(id);
        } catch (error) {
          console.error("Failed to ping pomodoro session:", error);
        }
      }, 60000);
    } else {
      if (pingIntervalRef.current) {
        clearInterval(pingIntervalRef.current);
        pingIntervalRef.current = null;
      }
    }

    return () => {
      if (pingIntervalRef.current) {
        clearInterval(pingIntervalRef.current);
      }
    };
  }, [isActive, finished, isAuthenticated, id]);

  const minutes = useMemo(() => Math.floor(timeLeft / 60), [timeLeft]);
  const seconds = useMemo(() => timeLeft % 60, [timeLeft]);

  const formattedMinutes = useMemo(
    () => (minutes < 10 ? `0${minutes}` : `${minutes}`),
    [minutes],
  );
  const formattedSeconds = useMemo(
    () => (seconds < 10 ? `0${seconds}` : `${seconds}`),
    [seconds],
  );

  const togglePomodoro = async () => {
    if (!hasStarted) {
      startPomodoro();
      return;
    }
    setIsActive((prev) => !prev);
    if (!isAuthenticated && !id) {
      return;
    }
    if (isActive) {
      id && (await pausePomodoroSession(id));
      dispatch(pausePomodoro());
    } else {
      id && (await resumePomodoroSession(id));
      dispatch(resumePomodoro());
    }
  };
  useEffect(() => {
    if (isActive) {
      setHasStarted(true);
    }
  }, [isActive]);

  const startPomodoro = useCallback(async (): Promise<void> => {
    setTimeLeft(specificMinutes * 60);
    setFinished(false);
    setIsActive(true);
    setHasStarted(true);

    if (isAuthenticated) {
      try {
        const res = await createPomodoroSession({
          type: type,
          duration: specificMinutes,
        });
        dispatch(
          setPomodoroSession({
            id: res.session.id,
            type: type,
            duration: specificMinutes,
          }),
        );
      } catch (error) {
        console.error("Error updating pomodoro session:", error);
      }
    }
  }, [specificMinutes, isAuthenticated, type, dispatch]);
  const stopPomodoro = useCallback((): void => {
    setIsActive(false);
  }, []);
  const getStats = useCallback(async () => {
    if (isAuthenticated) {
      const res = await getPomodoroStats();
      dispatch(setPomodoroStats({ stats: res.data }));
    }
  }, [isAuthenticated, dispatch]);
  useEffect(() => {
    getStats();
  }, [getStats]);
  const resetPomodoro = useCallback(
    async ({ finished = false }: { finished?: boolean }): Promise<void> => {
      dispatch(resetPomodoroSession());
      setIsActive(false);
      setHasStarted(false);
      setFinished(false);
      setTimeLeft(specificMinutes * 60);
      if (isAuthenticated && id && !finished) {
        await terminatePomodoroSession(id);
      }
      await getStats();
    },
    [specificMinutes, isAuthenticated, id, dispatch, getStats],
  );
  const finishSession = useCallback(async () => {
    if (isAuthenticated && id) {
      await completePomodoroSession(id);
    }
    await dispatch(resetPomodoroSession());
    setFinished(true);
    resetPomodoro({ finished: true });
    setIsActive(false);
    alarmRef.current?.play();
  }, [specificMinutes, isAuthenticated, id, dispatch]);
  useEffect(() => {
    if (timeLeft === 0 && isActive) {
      finishSession();
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
