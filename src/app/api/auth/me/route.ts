import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { verifyToken } from "@/lib/jwt";
import connect from "@/lib/db";
import User from "@/lib/models/user";

const updateUserSchema = z
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
            shotBreakDuration: z.number().min(1).max(60).optional(),
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
  .strict(); // .strict() prevents unknown fields

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "غير مصرح" },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json(
        { success: false, message: "رمز غير صالح" },
        { status: 401 }
      );
    }

    await connect();

    const user = await User.findById(decoded.userId);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "المستخدم غير موجود" },
        { status: 404 }
      );
    }

    const userResponse = {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePicture: user.profilePicture,
      provider: user.provider,
      settings: user.settings,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      lastLoginAt: user.lastLoginAt,
    };

    return NextResponse.json(
      {
        success: true,
        user: userResponse,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get user error:", error);
    return NextResponse.json(
      { success: false, message: "حدث خطأ ما" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "غير مصرح" },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json(
        { success: false, message: "رمز غير صالح" },
        { status: 401 }
      );
    }

    const body = await req.json();

    const validationResult = updateUserSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: "البيانات المدخلة غير صحيحة",
          errors: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    await connect();

    const user = await User.findById(decoded.userId);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "المستخدم غير موجود" },
        { status: 404 }
      );
    }

    const updateData: any = {};
    const validatedData = validationResult.data;

    if (validatedData.fullName !== undefined) {
      updateData.fullName = validatedData.fullName;
    }

    if (validatedData.profilePicture !== undefined) {
      updateData.profilePicture = validatedData.profilePicture;
    }

    if (validatedData.settings) {
      const settings = validatedData.settings;

      if (settings.timers?.focusDurationTime !== undefined) {
        updateData["settings.timers.focusDurationTime"] =
          settings.timers.focusDurationTime;
      }
      if (settings.timers?.shotBreakDuration !== undefined) {
        updateData["settings.timers.shotBreakDuration"] =
          settings.timers.shotBreakDuration;
      }
      if (settings.timers?.longBreakDuration !== undefined) {
        updateData["settings.timers.longBreakDuration"] =
          settings.timers.longBreakDuration;
      }

      if (settings.waterReminder?.enabled !== undefined) {
        updateData["settings.waterReminder.enabled"] =
          settings.waterReminder.enabled;
      }
      if (settings.waterReminder?.interval !== undefined) {
        updateData["settings.waterReminder.interval"] =
          settings.waterReminder.interval;
      }

      if (settings.prayerReminder?.enabled !== undefined) {
        updateData["settings.prayerReminder.enabled"] =
          settings.prayerReminder.enabled;
      }
      if (settings.prayerReminder?.preReminderMinutes !== undefined) {
        updateData["settings.prayerReminder.preReminderMinutes"] =
          settings.prayerReminder.preReminderMinutes;
      }
      if (settings.prayerReminder?.preReminderEnabled !== undefined) {
        updateData["settings.prayerReminder.preReminderEnabled"] =
          settings.prayerReminder.preReminderEnabled;
      }
      if (settings.prayerReminder?.atTimeReminderEnabled !== undefined) {
        updateData["settings.prayerReminder.atTimeReminderEnabled"] =
          settings.prayerReminder.atTimeReminderEnabled;
      }

      if (settings.prayerReminder?.perPrayer) {
        const prayers = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"] as const;
        prayers.forEach((prayer) => {
          const prayerSettings = settings.prayerReminder?.perPrayer?.[prayer];
          if (prayerSettings?.pre !== undefined) {
            updateData[`settings.prayerReminder.perPrayer.${prayer}.pre`] =
              prayerSettings.pre;
          }
          if (prayerSettings?.atTime !== undefined) {
            updateData[`settings.prayerReminder.perPrayer.${prayer}.atTime`] =
              prayerSettings.atTime;
          }
        });
      }

      if (settings.location?.country !== undefined) {
        updateData["settings.location.country"] = settings.location.country;
      }
      if (settings.location?.city !== undefined) {
        updateData["settings.location.city"] = settings.location.city;
      }

      if (settings.ui?.prayerTimesPosition !== undefined) {
        updateData["settings.ui.prayerTimesPosition"] =
          settings.ui.prayerTimesPosition;
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      decoded.userId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, message: "فشل تحديث البيانات" },
        { status: 500 }
      );
    }

    const userResponse = {
      id: updatedUser._id,
      fullName: updatedUser.fullName,
      email: updatedUser.email,
      profilePicture: updatedUser.profilePicture,
      provider: updatedUser.provider,
      settings: updatedUser.settings,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
      lastLoginAt: updatedUser.lastLoginAt,
    };

    return NextResponse.json(
      {
        success: true,
        message: "تم تحديث البيانات بنجاح",
        user: userResponse,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update user error:", error);
    return NextResponse.json(
      { success: false, message: "حدث خطأ ما" },
      { status: 500 }
    );
  }
}
