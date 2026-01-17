import { AuthenticatedRequest } from "@/lib/middlewares/authMiddleware";
import Task, { tasksResponse } from "@/lib/models/task";
import connect from "@/lib/db";
import { NextResponse } from "next/server";
import z from "zod";
import {
  createTaskSchema,
  updateTaskSchema,
} from "@/lib/validators/tasks/tasks.validator";
type TaskQuery = {
  userId?: string;
  guestId?: string;
  completed?: boolean;
};
export const getAllTasksHandler = async (req: AuthenticatedRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const filter = searchParams.get("filter") as "active" | "completed" | null;
    const page = Math.max(1, Number(searchParams.get("page") ?? 1));
    const limit = Math.min(
      200,
      Math.max(1, Number(searchParams.get("limit") ?? 100))
    );
    const skip = (page - 1) * limit;

    const { userId, guestId } = req.user;
    const authQuery = userId ? { userId } : { guestId };
    await connect();

    const [result] = await Task.aggregate([
      { $match: authQuery }, // First match only by user ownership
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
        stats: {
          all: allCount,
          active: activeCount,
          completed: completedCount,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get tasks error:", error);
    return NextResponse.json(
      { success: false, message: "حدث خطأ ما" },
      { status: 500 }
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
        { status: 400 }
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
      { status: 201 }
    );
  } catch (error) {
    console.error("Create task error:", error);
    return NextResponse.json(
      { success: false, message: "حدث خطأ ما" },
      { status: 500 }
    );
  }
};

export const updateTaskHandler = async (
  req: AuthenticatedRequest,
  context?: { params: Promise<{ id: string }> }
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
        { status: 400 }
      );
    }

    await connect();

    const task = await Task.findById(id);
    const taskUserId = task?.userId;
    const taskGuestId = task?.guestId;
    if (!task) {
      return NextResponse.json(
        { success: false, message: "المهمة غير موجودة" },
        { status: 404 }
      );
    }
    if (userId) {
      // 4. Verify ownership
      if (taskUserId !== userId) {
        return NextResponse.json(
          { success: false, message: "غير مصرح - لا يمكنك تعديل هذه المهمة" },
          { status: 403 }
        );
      }
    } else {
      // 4. Verify ownership
      if (taskGuestId !== guestId) {
        return NextResponse.json(
          { success: false, message: "غير مصرح - لا يمكنك تعديل هذه المهمة" },
          { status: 403 }
        );
      }
    }
    // 5. Update task
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { $set: validationResult.data },
      { new: true, runValidators: true }
    );

    return NextResponse.json(
      {
        success: true,
        message: "تم تحديث المهمة بنجاح",
        task: tasksResponse(updatedTask),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update task error:", error);
    return NextResponse.json(
      { success: false, message: "حدث خطأ ما" },
      { status: 500 }
    );
  }
};

export const deleteTaskHandler = async (
  req: AuthenticatedRequest,
  context?: { params: Promise<{ id: string }> }
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
        { status: 404 }
      );
    }
    if (userId) {
      // 4. Verify ownership
      if (taskUserId !== userId) {
        return NextResponse.json(
          { success: false, message: "غير مصرح - لا يمكنك حذف هذه المهمة" },
          { status: 403 }
        );
      }
    } else {
      // 4. Verify ownership
      if (taskGuestId !== guestId) {
        return NextResponse.json(
          { success: false, message: "غير مصرح - لا يمكنك حذف هذه المهمة" },
          { status: 403 }
        );
      }
    }

    await Task.findByIdAndDelete(id);

    return NextResponse.json(
      { success: true, message: "تم حذف المهمة بنجاح" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete task error:", error);
    return NextResponse.json(
      { success: false, message: "حدث خطأ ما" },
      { status: 500 }
    );
  }
};

export const getSingleTask = async (
  req: AuthenticatedRequest,
  context?: { params: Promise<{ id: string }> }
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
        { status: 404 }
      );
    }
    if (userId) {
      if (taskUserId !== userId) {
        return NextResponse.json(
          { success: false, message: "غير مصرح - لا يمكنك عرض هذه المهمة" },
          { status: 403 }
        );
      }
    } else {
      if (taskGuestId !== guestId) {
        return NextResponse.json(
          { success: false, message: "غير مصرح - لا يمكنك عرض هذه المهمة" },
          { status: 403 }
        );
      }
    }
    return NextResponse.json(
      {
        success: true,
        message: "تم عرض المهمة بنجاح",
        task: tasksResponse(task),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete task error:", error);
    return NextResponse.json(
      { success: false, message: "حدث خطأ ما" },
      { status: 500 }
    );
  }
};
