import { AuthenticatedRequest } from "@/lib/middlewares/authMiddleware";
import Task, { tasksResponse } from "@/lib/models/task";
import connect from "@/lib/db";
import { NextResponse } from "next/server";
import {
  createTaskSchema,
  updateTaskSchema,
} from "@/lib/validators/tasks/tasks.validator";
type TaskQuery = {
  userId?: string;
  guestId?: string;
  completed?: boolean;
  createdAt?: {
    $gte?: Date;
    $lte?: Date;
  };
};
type Range = "all_time" | "today" | "yesterday" | "week" | "month";
const allowedRanges: Range[] = [
  "all_time",
  "today",
  "yesterday",
  "week",
  "month",
];
export const getAllTasksHandler = async (req: AuthenticatedRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const filter = searchParams.get("filter") as "active" | "completed" | null;
    const range = (searchParams.get("range") as Range) || "all_time";
    const fromParam = searchParams.get("from");
    const toParam = searchParams.get("to");

    const page = Math.max(1, Number(searchParams.get("page") ?? 1));
    const limit = Math.min(
      200,
      Math.max(1, Number(searchParams.get("limit") ?? 100)),
    );
    const skip = (page - 1) * limit;

    const { userId, guestId } = req.user;
    const taskQuery: TaskQuery = userId ? { userId } : { guestId };
    if (!allowedRanges.includes(range)) {
      return NextResponse.json(
        { success: false, message: "النطاق غير صحيح" },
        { status: 400 },
      );
    }
    // Update taskQuery with date filtering
    if (fromParam || toParam) {
      taskQuery.createdAt = {};
      if (fromParam) taskQuery.createdAt.$gte = new Date(fromParam);
      if (toParam) taskQuery.createdAt.$lte = new Date(toParam);
    } else if (range !== "all_time") {
      const now = new Date();
      const startOfToday = new Date(now.setHours(0, 0, 0, 0));

      if (range === "today") {
        taskQuery.createdAt = { $gte: startOfToday };
      } else if (range === "yesterday") {
        const startOfYesterday = new Date(startOfToday);
        startOfYesterday.setDate(startOfYesterday.getDate() - 1);
        const endOfYesterday = new Date(startOfToday);
        endOfYesterday.setMilliseconds(-1);
        taskQuery.createdAt = { $gte: startOfYesterday, $lte: endOfYesterday };
      } else if (range === "week") {
        const sevenDaysAgo = new Date(startOfToday);
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        taskQuery.createdAt = { $gte: sevenDaysAgo };
      } else if (range === "month") {
        const startOfMonth = new Date(
          startOfToday.getFullYear(),
          startOfToday.getMonth(),
          1,
        );
        taskQuery.createdAt = { $gte: startOfMonth };
      }
    }
    await connect();

    const [result] = await Task.aggregate([
      { $match: taskQuery }, // First match only by user ownership
      {
        $facet: {
          // Facet for fetching filtered tasks
          tasks: [
            // Apply filter if one exists
            ...(filter === "active" ? [{ $match: { completed: false } }] : []),
            ...(filter === "completed"
              ? [{ $match: { completed: true } }]
              : []),
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit },
          ],
          // Facet for counting total filtered docs (for pagination)
          total: [
            ...(filter === "active" ? [{ $match: { completed: false } }] : []),
            ...(filter === "completed"
              ? [{ $match: { completed: true } }]
              : []),
            { $count: "count" },
          ],
          // Facet for calculating stats based on the filtered result set
          stats: [
            {
              $group: {
                _id: "$completed",
                count: { $sum: 1 },
              },
            },
          ],
        },
      },
    ]);

    const tasks = result.tasks || [];
    const total = result.total[0]?.count || 0;

    // Process stats
    const statsArray = result.stats || [];
    const activeCount =
      statsArray.find((s: any) => s._id === false)?.count || 0;
    const completedCount =
      statsArray.find((s: any) => s._id === true)?.count || 0;
    const allCount = activeCount + completedCount;

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json(
      {
        success: true,
        tasks: tasks.map(tasksResponse),
        pagination: {
          total,
          page,
          limit,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
        range,
        stats: {
          all: allCount,
          active: activeCount,
          completed: completedCount,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Get tasks error:", error);
    return NextResponse.json(
      { success: false, message: "حدث خطأ ما" },
      { status: 500 },
    );
  }
};

export const createTaskHandler = async (req: AuthenticatedRequest) => {
  try {
    const { userId, guestId } = req.user;
    const authId = userId ? { userId } : { guestId };
    const body = await req.json();
    const validationResult = createTaskSchema.safeParse(body);

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

    const task = await Task.create({
      ...validationResult.data,
      ...authId,
    });

    return NextResponse.json(
      {
        success: true,
        message: "تم إنشاء المهمة بنجاح",
        task: tasksResponse(task),
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create task error:", error);
    return NextResponse.json(
      { success: false, message: "حدث خطأ ما" },
      { status: 500 },
    );
  }
};

export const updateTaskHandler = async (
  req: AuthenticatedRequest,
  context?: { params: Promise<{ id: string }> },
) => {
  try {
    const { id } = await context!.params;
    const { userId, guestId } = req.user;

    // 2. Parse and validate request body
    const body = await req.json();
    const validationResult = updateTaskSchema.safeParse(body);

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

    const task = await Task.findById(id);
    const taskUserId = task?.userId;
    const taskGuestId = task?.guestId;
    if (!task) {
      return NextResponse.json(
        { success: false, message: "المهمة غير موجودة" },
        { status: 404 },
      );
    }
    if (userId) {
      // 4. Verify ownership
      if (taskUserId !== userId) {
        return NextResponse.json(
          { success: false, message: "غير مصرح - لا يمكنك تعديل هذه المهمة" },
          { status: 403 },
        );
      }
    } else {
      // 4. Verify ownership
      if (taskGuestId !== guestId) {
        return NextResponse.json(
          { success: false, message: "غير مصرح - لا يمكنك تعديل هذه المهمة" },
          { status: 403 },
        );
      }
    }
    // 5. Update task
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { $set: validationResult.data },
      { new: true, runValidators: true },
    );

    return NextResponse.json(
      {
        success: true,
        message: "تم تحديث المهمة بنجاح",
        task: tasksResponse(updatedTask),
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Update task error:", error);
    return NextResponse.json(
      { success: false, message: "حدث خطأ ما" },
      { status: 500 },
    );
  }
};

export const deleteTaskHandler = async (
  req: AuthenticatedRequest,
  context?: { params: Promise<{ id: string }> },
) => {
  try {
    const { id } = await context!.params;
    const { userId, guestId } = req.user;

    await connect();

    const task = await Task.findById(id);
    const taskUserId = task?.userId;
    const taskGuestId = task?.guestId;
    if (!task) {
      return NextResponse.json(
        { success: false, message: "المهمة غير موجودة" },
        { status: 404 },
      );
    }
    if (userId) {
      // 4. Verify ownership
      if (taskUserId !== userId) {
        return NextResponse.json(
          { success: false, message: "غير مصرح - لا يمكنك حذف هذه المهمة" },
          { status: 403 },
        );
      }
    } else {
      // 4. Verify ownership
      if (taskGuestId !== guestId) {
        return NextResponse.json(
          { success: false, message: "غير مصرح - لا يمكنك حذف هذه المهمة" },
          { status: 403 },
        );
      }
    }

    await Task.findByIdAndDelete(id);

    return NextResponse.json(
      { success: true, message: "تم حذف المهمة بنجاح" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Delete task error:", error);
    return NextResponse.json(
      { success: false, message: "حدث خطأ ما" },
      { status: 500 },
    );
  }
};

export const getSingleTask = async (
  req: AuthenticatedRequest,
  context?: { params: Promise<{ id: string }> },
) => {
  try {
    const { id } = await context!.params;
    const { userId, guestId } = req.user;

    await connect();

    const task = await Task.findById(id);
    const taskUserId = task?.userId;
    const taskGuestId = task?.guestId;
    if (!task) {
      return NextResponse.json(
        { success: false, message: "المهمة غير موجودة" },
        { status: 404 },
      );
    }
    if (userId) {
      if (taskUserId !== userId) {
        return NextResponse.json(
          { success: false, message: "غير مصرح - لا يمكنك عرض هذه المهمة" },
          { status: 403 },
        );
      }
    } else {
      if (taskGuestId !== guestId) {
        return NextResponse.json(
          { success: false, message: "غير مصرح - لا يمكنك عرض هذه المهمة" },
          { status: 403 },
        );
      }
    }
    return NextResponse.json(
      {
        success: true,
        message: "تم عرض المهمة بنجاح",
        task: tasksResponse(task),
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Delete task error:", error);
    return NextResponse.json(
      { success: false, message: "حدث خطأ ما" },
      { status: 500 },
    );
  }
};

// app/api/tasks/[id]/reorder/route.ts

export const reorderTaskHandler = async (
  req: AuthenticatedRequest,
  context?: { params: Promise<{ id: string }> },
) => {
  try {
    const { id } = await context!.params;
    const { newPrevTaskId, newNextTaskId } = await req.json();

    const userId = req.user.userId;
    const guestId = req.user.guestId;

    await connect();

    const task = await Task.findById(id);

    if (!task) {
      return NextResponse.json(
        { success: false, message: "المهمة غير موجودة" },
        { status: 404 },
      );
    }

    const taskUserId = task.userId;
    const taskGuestId = task.guestId;

    if (userId) {
      if (taskUserId !== userId) {
        return NextResponse.json(
          {
            success: false,
            message: "غير مصرح - لا يمكنك إعادة ترتيب هذه المهمة",
          },
          { status: 403 },
        );
      }
    } else {
      if (taskGuestId !== guestId) {
        return NextResponse.json(
          {
            success: false,
            message: "غير مصرح - لا يمكنك إعادة ترتيب هذه المهمة",
          },
          { status: 403 },
        );
      }
    }

    // Start a session for transaction
    const session = await Task.startSession();

    try {
      await session.withTransaction(async () => {
        // === STEP 1: Remove task from old position ===

        // Update old previous task (if exists)
        if (task.prevTaskId) {
          await Task.findByIdAndUpdate(
            task.prevTaskId,
            { nextTaskId: task.nextTaskId },
            { session },
          );
        }

        // Update old next task (if exists)
        if (task.nextTaskId) {
          await Task.findByIdAndUpdate(
            task.nextTaskId,
            { prevTaskId: task.prevTaskId },
            { session },
          );
        }

        // === STEP 2: Insert task in new position ===

        // Update the moved task's pointers
        task.prevTaskId = newPrevTaskId || null;
        task.nextTaskId = newNextTaskId || null;
        await task.save({ session });

        // Update new previous task (if exists)
        if (newPrevTaskId) {
          await Task.findByIdAndUpdate(
            newPrevTaskId,
            { nextTaskId: id },
            { session },
          );
        }

        // Update new next task (if exists)
        if (newNextTaskId) {
          await Task.findByIdAndUpdate(
            newNextTaskId,
            { prevTaskId: id },
            { session },
          );
        }
      });

      // Fetch the updated task
      const updatedTask = await Task.findById(id);

      return NextResponse.json(
        {
          success: true,
          message: "تم إعادة ترتيب المهمة بنجاح",
          task: tasksResponse(updatedTask),
        },
        { status: 200 },
      );
    } finally {
      await session.endSession();
    }
  } catch (error) {
    console.error("Reorder task error:", error);
    return NextResponse.json(
      { success: false, message: "حدث خطأ ما" },
      { status: 500 },
    );
  }
};
