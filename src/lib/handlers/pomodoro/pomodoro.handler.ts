import { AuthenticatedRequest } from "@/lib/middlewares/authMiddleware";
import { NextResponse } from "next/server";
import connect from "@/lib/db";
import PomodoroSession from "@/lib/models/pomodoro";
import { createPomodoroSchema } from "@/lib/validators/pomodoro/pomodoro.validator";

export const createPomodoroHandler = async (req: AuthenticatedRequest) => {
  try {
    // Check if user is authenticated (not a guest)
    if (!req.user.userId) {
      return NextResponse.json(
        {
          success: false,
          message: "يجب تسجيل الدخول لإنشاء جلسة بومودورو",
        },
        { status: 401 },
      );
    }

    // Parse and validate request body
    const body = await req.json();
    const validationResult = createPomodoroSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: "البيانات المدخلة غير صحيحة",
          errors: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    await connect();

    // Create the Pomodoro session
    const pomodoroSession = await PomodoroSession.create({
      userId: req.user.userId,
      type: validationResult.data.type,
      duration: validationResult.data.duration,
      startedAt: new Date(),
      lastPing: new Date(),
      completed: false,
      pauses: [],
      totalPausedTime: 0,
      timeSpent: 0,
    });

    return NextResponse.json(
      {
        success: true,
        message: "تم إنشاء جلسة البومودورو بنجاح",
        session: {
          id: pomodoroSession._id,
          type: pomodoroSession.type,
          duration: pomodoroSession.duration,
          startedAt: pomodoroSession.startedAt,
          completed: pomodoroSession.completed,
          timeSpent: pomodoroSession.timeSpent,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating Pomodoro session:", error);
    return NextResponse.json(
      {
        success: false,
        message: "حدث خطأ أثناء إنشاء جلسة البومودورو",
      },
      { status: 500 },
    );
  }
};

export const pingPomodoroHandler = async (
  req: AuthenticatedRequest,
  context?: { params: Promise<{ id: string }> },
) => {
  try {
    const { id } = await context!.params;
    // Check if user is authenticated (not a guest)
    if (!req.user.userId) {
      return NextResponse.json(
        {
          success: false,
          message: "يجب تسجيل الدخول لإنشاء جلسة بومودورو",
        },
        { status: 401 },
      );
    }

    await connect();

    // Create the Pomodoro session
    const pomodoroSession = await PomodoroSession.findById(id);
    if (!pomodoroSession) {
      return NextResponse.json(
        {
          success: false,
          message: "جلسة البومودورو غير موجودة",
        },
        { status: 404 },
      );
    }
    if (pomodoroSession.userId !== req.user.userId) {
      return NextResponse.json(
        {
          success: false,
          message: "لا يمكن تحديث جلسة البومودورو",
        },
        { status: 403 },
      );
    }
    if (pomodoroSession.completed) {
      return NextResponse.json(
        {
          success: false,
          message: "جلسة البومودورو مكتملة",
        },
        { status: 400 },
      );
    }
    pomodoroSession.lastPing = new Date();

    // Calculate timeSpent
    const now = new Date();
    let effectivePausedTimeMin = pomodoroSession.totalPausedTime;
    const lastPause = pomodoroSession.pauses[pomodoroSession.pauses.length - 1];
    if (lastPause && !lastPause.end) {
      effectivePausedTimeMin +=
        (now.getTime() - lastPause.start.getTime()) / 60000;
    }
    pomodoroSession.timeSpent = Math.max(
      0,
      Math.floor(
        (now.getTime() - pomodoroSession.startedAt.getTime()) / 60000 -
          effectivePausedTimeMin,
      ),
    );

    await pomodoroSession.save();
    return NextResponse.json(
      {
        success: true,
        message: "تم تحديث جلسة البومودورو بنجاح",
        session: {
          id: pomodoroSession._id,
          type: pomodoroSession.type,
          duration: pomodoroSession.duration,
          startedAt: pomodoroSession.startedAt,
          completed: pomodoroSession.completed,
          timeSpent: pomodoroSession.timeSpent,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error creating Pomodoro session:", error);
    return NextResponse.json(
      {
        success: false,
        message: "حدث خطأ أثناء إنشاء جلسة البومودورو",
      },
      { status: 500 },
    );
  }
};

export const pausePomodoroHandler = async (
  req: AuthenticatedRequest,
  context?: { params: Promise<{ id: string }> },
) => {
  try {
    const { id } = await context!.params;
    // Check if user is authenticated (not a guest)
    if (!req.user.userId) {
      return NextResponse.json(
        {
          success: false,
          message: "يجب تسجيل الدخول لإنشاء جلسة بومودورو",
        },
        { status: 401 },
      );
    }

    await connect();

    // Create the Pomodoro session
    const pomodoroSession = await PomodoroSession.findById(id);
    if (!pomodoroSession) {
      return NextResponse.json(
        {
          success: false,
          message: "جلسة البومودورو غير موجودة",
        },
        { status: 404 },
      );
    }
    if (pomodoroSession.userId !== req.user.userId) {
      return NextResponse.json(
        {
          success: false,
          message: "لا يمكن تحديث جلسة البومودورو",
        },
        { status: 403 },
      );
    }
    if (pomodoroSession.completed) {
      return NextResponse.json(
        {
          success: false,
          message: "جلسة البومودورو مكتملة",
        },
        { status: 400 },
      );
    }
    if (
      pomodoroSession.pauses.length > 0 &&
      !pomodoroSession.pauses[pomodoroSession.pauses.length - 1].end
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "جلسة البومودورو متوقفة بالفعل",
        },
        { status: 400 },
      );
    }
    pomodoroSession.pauses.push({
      start: new Date(),
    });
    pomodoroSession.lastPing = new Date();

    // Calculate timeSpent before adding the new pause or just use the current time
    const now = new Date();
    pomodoroSession.timeSpent = Math.max(
      0,
      Math.floor(
        (now.getTime() - pomodoroSession.startedAt.getTime()) / 60000 -
          pomodoroSession.totalPausedTime,
      ),
    );

    await pomodoroSession.save();
    return NextResponse.json(
      {
        success: true,
        message: "تم تحديث جلسة البومودورو بنجاح",
        session: {
          id: pomodoroSession._id,
          type: pomodoroSession.type,
          duration: pomodoroSession.duration,
          startedAt: pomodoroSession.startedAt,
          completed: pomodoroSession.completed,
          timeSpent: pomodoroSession.timeSpent,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error pausing Pomodoro session:", error);
    return NextResponse.json(
      {
        success: false,
        message: "حدث خطأ أثناء إيقاف جلسة البومودورو",
      },
      { status: 500 },
    );
  }
};

export const resumePomodoroHandler = async (
  req: AuthenticatedRequest,
  context?: { params: Promise<{ id: string }> },
) => {
  try {
    const { id } = await context!.params;
    // Check if user is authenticated
    if (!req.user.userId) {
      return NextResponse.json(
        {
          success: false,
          message: "يجب تسجيل الدخول لاستئناف جلسة بومودورو",
        },
        { status: 401 },
      );
    }

    await connect();

    const pomodoroSession = await PomodoroSession.findById(id);

    if (!pomodoroSession) {
      return NextResponse.json(
        {
          success: false,
          message: "جلسة البومودورو غير موجودة",
        },
        { status: 404 },
      );
    }

    if (pomodoroSession.userId !== req.user.userId) {
      return NextResponse.json(
        {
          success: false,
          message: "لا يمكن تحديث جلسة البومودورو",
        },
        { status: 403 },
      );
    }

    if (pomodoroSession.completed) {
      return NextResponse.json(
        {
          success: false,
          message: "جلسة البومودورو مكتملة",
        },
        { status: 400 },
      );
    }

    // Check if there are any pauses
    if (pomodoroSession.pauses.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "لا توجد جلسة متوقفة لاستئنافها",
        },
        { status: 400 },
      );
    }

    const lastPause = pomodoroSession.pauses[pomodoroSession.pauses.length - 1];

    // Check if already resumed (end exists)
    if (lastPause.end) {
      return NextResponse.json(
        {
          success: false,
          message: "جلسة البومودورو تعمل بالفعل",
        },
        { status: 400 },
      );
    }

    // Calculate pause duration in minutes
    const now = new Date();
    const pauseDurationMin =
      (now.getTime() - lastPause.start.getTime()) / 60000;

    // Update the pause end time
    lastPause.end = now;

    // Add to total paused time in minutes
    pomodoroSession.totalPausedTime += pauseDurationMin;

    // Update last ping
    pomodoroSession.lastPing = now;

    // Calculate timeSpent
    pomodoroSession.timeSpent = Math.max(
      0,
      Math.floor(
        (now.getTime() - pomodoroSession.startedAt.getTime()) / 60000 -
          pomodoroSession.totalPausedTime,
      ),
    );

    await pomodoroSession.save();

    return NextResponse.json(
      {
        success: true,
        message: "تم استئناف جلسة البومودورو بنجاح",
        session: {
          id: pomodoroSession._id,
          type: pomodoroSession.type,
          duration: pomodoroSession.duration,
          startedAt: pomodoroSession.startedAt,
          completed: pomodoroSession.completed,
          totalPausedTime: pomodoroSession.totalPausedTime,
          pauses: pomodoroSession.pauses.length,
          timeSpent: pomodoroSession.timeSpent,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error resuming Pomodoro session:", error);
    return NextResponse.json(
      {
        success: false,
        message: "حدث خطأ أثناء استئناف جلسة البومودورو",
      },
      { status: 500 },
    );
  }
};

export const completePomodoroHandler = async (
  req: AuthenticatedRequest,
  context?: { params: Promise<{ id: string }> },
) => {
  try {
    const { id } = await context!.params;
    // Check if user is authenticated
    if (!req.user.userId) {
      return NextResponse.json(
        {
          success: false,
          message: "يجب تسجيل الدخول لإكمال جلسة بومودورو",
        },
        { status: 401 },
      );
    }

    await connect();

    const pomodoroSession = await PomodoroSession.findById(id);

    if (!pomodoroSession) {
      return NextResponse.json(
        {
          success: false,
          message: "جلسة البومودورو غير موجودة",
        },
        { status: 404 },
      );
    }

    if (pomodoroSession.userId !== req.user.userId) {
      return NextResponse.json(
        {
          success: false,
          message: "لا يمكن تحديث جلسة البومودورو",
        },
        { status: 403 },
      );
    }

    if (pomodoroSession.completed) {
      return NextResponse.json(
        {
          success: false,
          message: "جلسة البومودورو مكتملة بالفعل",
        },
        { status: 400 },
      );
    }

    // If paused, complete the last pause first
    if (
      pomodoroSession.pauses.length > 0 &&
      !pomodoroSession.pauses[pomodoroSession.pauses.length - 1].end
    ) {
      const lastPause =
        pomodoroSession.pauses[pomodoroSession.pauses.length - 1];
      const now = new Date();
      const pauseDurationMin =
        (now.getTime() - lastPause.start.getTime()) / 60000;
      lastPause.end = now;
      pomodoroSession.totalPausedTime += pauseDurationMin;
    }

    // Complete the session
    pomodoroSession.completed = true;
    pomodoroSession.endedAt = new Date();
    pomodoroSession.lastPing = new Date();
    // Set timeSpent to full duration in minutes
    pomodoroSession.timeSpent = pomodoroSession.duration;

    await pomodoroSession.save();

    return NextResponse.json(
      {
        success: true,
        message: "تم إكمال جلسة البومودورو بنجاح",
        session: {
          id: pomodoroSession._id,
          type: pomodoroSession.type,
          duration: pomodoroSession.duration,
          startedAt: pomodoroSession.startedAt,
          completed: pomodoroSession.completed,
          endedAt: pomodoroSession.endedAt,
          totalPausedTime: pomodoroSession.totalPausedTime,
          timeSpent: pomodoroSession.timeSpent,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error completing Pomodoro session:", error);
    return NextResponse.json(
      {
        success: false,
        message: "حدث خطأ أثناء إكمال جلسة البومودورو",
      },
      { status: 500 },
    );
  }
};

export const terminatePomodoroHandler = async (
  req: AuthenticatedRequest,
  context?: { params: Promise<{ id: string }> },
) => {
  try {
    const { id } = await context!.params;
    // Check if user is authenticated
    if (!req.user.userId) {
      return NextResponse.json(
        {
          success: false,
          message: "يجب تسجيل الدخول لإنهاء جلسة بومودورو",
        },
        { status: 401 },
      );
    }

    await connect();

    const pomodoroSession = await PomodoroSession.findById(id);

    if (!pomodoroSession) {
      return NextResponse.json(
        {
          success: false,
          message: "جلسة البومودورو غير موجودة",
        },
        { status: 404 },
      );
    }

    if (pomodoroSession.userId !== req.user.userId) {
      return NextResponse.json(
        {
          success: false,
          message: "لا يمكن إنهاء جلسة البومودورو",
        },
        { status: 403 },
      );
    }

    if (pomodoroSession.completed) {
      return NextResponse.json(
        {
          success: false,
          message: "جلسة البومودورو منتهية بالفعل",
        },
        { status: 400 },
      );
    }

    // If paused, complete the last pause first
    if (
      pomodoroSession.pauses.length > 0 &&
      !pomodoroSession.pauses[pomodoroSession.pauses.length - 1].end
    ) {
      const lastPause =
        pomodoroSession.pauses[pomodoroSession.pauses.length - 1];
      const now = new Date();
      const pauseDurationMin =
        (now.getTime() - lastPause.start.getTime()) / 60000;
      lastPause.end = now;
      pomodoroSession.totalPausedTime += pauseDurationMin;
    }

    // Terminate the session (mark as completed but it was terminated early)
    pomodoroSession.completed = true;
    pomodoroSession.endedAt = new Date();
    pomodoroSession.lastPing = new Date();
    pomodoroSession.isTerminated = true;

    // Calculate timeSpent at termination
    const now = new Date();
    pomodoroSession.timeSpent = Math.max(
      0,
      Math.floor(
        (now.getTime() - pomodoroSession.startedAt.getTime()) / 60000 -
          pomodoroSession.totalPausedTime,
      ),
    );

    await pomodoroSession.save();

    return NextResponse.json(
      {
        success: true,
        message: "تم إنهاء جلسة البومودورو",
        session: {
          id: pomodoroSession._id,
          type: pomodoroSession.type,
          duration: pomodoroSession.duration,
          startedAt: pomodoroSession.startedAt,
          completed: pomodoroSession.completed,
          endedAt: pomodoroSession.endedAt,
          totalPausedTime: pomodoroSession.totalPausedTime,
          terminated: true, // Flag to indicate this was terminated, not completed naturally
          timeSpent: pomodoroSession.timeSpent,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error terminating Pomodoro session:", error);
    return NextResponse.json(
      {
        success: false,
        message: "حدث خطأ أثناء إنهاء جلسة البومودورو",
      },
      { status: 500 },
    );
  }
};

export const getTodayStatsHandler = async (req: AuthenticatedRequest) => {
  try {
    // Check if user is authenticated
    if (!req.user.userId) {
      return NextResponse.json(
        {
          success: false,
          message: "يجب تسجيل الدخول لعرض إحصائيات بومودورو",
        },
        { status: 401 },
      );
    }

    await connect();

    // Get the URL and extract query parameters
    const url = new URL(req.url);
    const typeFilter = url.searchParams.get("type");

    // Validate type filter if provided
    const validTypes = ["focus", "shortBreak", "longBreak"];
    if (typeFilter && !validTypes.includes(typeFilter)) {
      return NextResponse.json(
        {
          success: false,
          message: "نوع الجلسة غير صالح",
          validTypes,
        },
        { status: 400 },
      );
    }

    // Get start of today (midnight)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Build the query
    const query: {
      userId: string;
      completed: boolean;
      startedAt: { $gte: Date };
      type?: string;
    } = {
      userId: req.user.userId,
      completed: true,
      startedAt: { $gte: today },
    };

    // Add type filter if specified
    if (typeFilter) {
      query.type = typeFilter;
    }

    // Aggregate total time spent
    const sessions = await PomodoroSession.find(query).select(
      "type timeSpent duration",
    );

    // Calculate totals
    let totalTimeSpent = 0;
    const breakdown: Record<string, { count: number; timeSpent: number }> = {
      focus: { count: 0, timeSpent: 0 },
      shortBreak: { count: 0, timeSpent: 0 },
      longBreak: { count: 0, timeSpent: 0 },
    };

    sessions.forEach((session) => {
      totalTimeSpent += session.timeSpent || 0;
      if (breakdown[session.type]) {
        breakdown[session.type].count += 1;
        breakdown[session.type].timeSpent += session.timeSpent || 0;
      }
    });

    // Build response
    const response: {
      success: boolean;
      message: string;
      data: {
        totalTimeSpent: number;
        totalSessions: number;
        date: string;
        type?: string;
        breakdown?: Record<string, { count: number; timeSpent: number }>;
      };
    } = {
      success: true,
      message: "تم جلب إحصائيات اليوم بنجاح",
      data: {
        totalTimeSpent, // in minutes
        totalSessions: sessions.length,
        date: today.toISOString().split("T")[0],
      },
    };

    // Include breakdown only if no specific type filter was applied
    if (typeFilter) {
      response.data.type = typeFilter;
    } else {
      response.data.breakdown = breakdown;
    }

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error fetching today's Pomodoro stats:", error);
    return NextResponse.json(
      {
        success: false,
        message: "حدث خطأ أثناء جلب إحصائيات البومودورو",
      },
      { status: 500 },
    );
  }
};
