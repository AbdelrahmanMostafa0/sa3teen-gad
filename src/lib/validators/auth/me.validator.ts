import z from "zod";

export const updateUserSchema = z
  .object({
    fullName: z
      .string()
      .min(2, "الاسم يجب أن يكون حرفين على الأقل")
      .max(100, "الاسم طويل جداً")
      .trim()
      .optional(),

    profilePicture: z
      .string()
      .url("رابط الصورة غير صحيح")
      .optional()
      .nullable(),

    settings: z
      .object({
        timers: z
          .object({
            focusDurationTime: z.number().min(1).max(120).optional(),
            shortBreakDuration: z.number().min(1).max(60).optional(),
            longBreakDuration: z.number().min(1).max(120).optional(),
          })
          .optional(),

        waterReminder: z
          .object({
            enabled: z.boolean().optional(),
            interval: z.number().min(5).max(180).optional(),
          })
          .optional(),

        prayerReminder: z
          .object({
            enabled: z.boolean().optional(),
            preReminderMinutes: z.number().min(1).max(60).optional(),
            preReminderEnabled: z.boolean().optional(),
            atTimeReminderEnabled: z.boolean().optional(),
            perPrayer: z
              .object({
                Fajr: z
                  .object({
                    pre: z.boolean().optional(),
                    atTime: z.boolean().optional(),
                  })
                  .optional(),
                Dhuhr: z
                  .object({
                    pre: z.boolean().optional(),
                    atTime: z.boolean().optional(),
                  })
                  .optional(),
                Asr: z
                  .object({
                    pre: z.boolean().optional(),
                    atTime: z.boolean().optional(),
                  })
                  .optional(),
                Maghrib: z
                  .object({
                    pre: z.boolean().optional(),
                    atTime: z.boolean().optional(),
                  })
                  .optional(),
                Isha: z
                  .object({
                    pre: z.boolean().optional(),
                    atTime: z.boolean().optional(),
                  })
                  .optional(),
              })
              .optional(),
          })
          .optional(),

        location: z
          .object({
            country: z.string().optional(),
            city: z.string().optional(),
          })
          .optional(),

        ui: z
          .object({
            prayerTimesPosition: z.enum(["top", "left", "right"]).optional(),
          })
          .optional(),
      })
      .optional(),
  })
  .strict();
