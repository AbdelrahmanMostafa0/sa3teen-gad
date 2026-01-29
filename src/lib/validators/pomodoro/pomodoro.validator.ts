import z from "zod";

export const createPomodoroSchema = z.object({
  type: z.enum(["focus", "shortBreak", "longBreak"]),
  duration: z.number().min(1).max(180),
});
