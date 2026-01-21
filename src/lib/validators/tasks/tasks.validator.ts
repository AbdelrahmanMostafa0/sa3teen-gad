import z from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(1, "العنوان مطلوب").max(500, "العنوان طويل جداً"),
  description: z.string().max(2000, "الوصف طويل جداً").optional(),
  subtasks: z
    .array(
      z.object({
        title: z.string(),
        done: z.boolean().default(false),
      }),
    )
    .optional()
    .default([]),
  completed: z.boolean().optional().default(false),
});

export const updateTaskSchema = z.object({
  title: z
    .string()
    .min(1, "العنوان مطلوب")
    .max(500, "العنوان طويل جداً")
    .optional(),
  description: z.string().max(2000, "الوصف طويل جداً").optional().nullable(),
  subtasks: z
    .array(
      z.object({
        title: z.string(),
        done: z.boolean(),
      }),
    )
    .optional(),
  completed: z.boolean().optional(),
});
