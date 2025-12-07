import { AuthenticatedRequest } from "@/lib/middlewares/authMiddleware";
import { NextResponse } from "next/server";
import connect from "@/lib/db";
import User from "@/lib/models/user";
import { updateUserSchema } from "@/lib/validators/auth/me.validator";

// get user profile handler
export const getUserHandler = async (req: AuthenticatedRequest) => {
  try {
    const { userId } = req.user;

    await connect();

    const user = await User.findById(userId);

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
};

// update user profile handler
export const updateUserHandler = async (req: AuthenticatedRequest) => {
  try {
    const { userId } = req.user;

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

    const user = await User.findById(userId);

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
      userId,
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
};
