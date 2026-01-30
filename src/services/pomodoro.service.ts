import axios from "axios";
import { PomodoroType } from "@/types/pomodoro";

// Create a new Pomodoro session
export const createPomodoroSession = async (data: {
  type: PomodoroType;
  duration: number;
}) => {
  try {
    const response = await axios.post("/api/pomodoro", data);
    return response.data;
  } catch (error) {
    console.error("Error creating Pomodoro session:", error);
    throw error;
  }
};

// Ping a Pomodoro session to update lastPing
export const pingPomodoroSession = async (sessionId: string) => {
  try {
    const response = await axios.patch(`/api/pomodoro/${sessionId}/ping`);
    return response.data;
  } catch (error) {
    console.error("Error pinging Pomodoro session:", error);
    throw error;
  }
};

// Pause a Pomodoro session
export const pausePomodoroSession = async (sessionId: string) => {
  try {
    const response = await axios.patch(`/api/pomodoro/${sessionId}/pause`);
    return response.data;
  } catch (error) {
    console.error("Error pausing Pomodoro session:", error);
    throw error;
  }
};

// Resume a paused Pomodoro session
export const resumePomodoroSession = async (sessionId: string) => {
  try {
    const response = await axios.patch(`/api/pomodoro/${sessionId}/resume`);
    return response.data;
  } catch (error) {
    console.error("Error resuming Pomodoro session:", error);
    throw error;
  }
};

// Complete a Pomodoro session (natural completion)
export const completePomodoroSession = async (sessionId: string) => {
  try {
    const response = await axios.patch(`/api/pomodoro/${sessionId}/complete`);
    return response.data;
  } catch (error) {
    console.error("Error completing Pomodoro session:", error);
    throw error;
  }
};

// Terminate a Pomodoro session (early termination/cancellation)
export const terminatePomodoroSession = async (sessionId: string) => {
  try {
    const response = await axios.patch(`/api/pomodoro/${sessionId}/terminate`);
    return response.data;
  } catch (error) {
    console.error("Error terminating Pomodoro session:", error);
    throw error;
  }
};

// Get Pomodoro stats
export const getPomodoroStats = async () => {
  try {
    const response = await axios.get(`/api/pomodoro/stats/today`);
    return response.data;
  } catch (error) {
    console.error("Error getting Pomodoro stats:", error);
    throw error;
  }
};
