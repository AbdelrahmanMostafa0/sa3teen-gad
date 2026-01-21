import { AuthenticatedRequest } from "@/lib/middlewares/authMiddleware";
import Task, { tasksResponse } from "@/lib/models/task";
import connect from "@/lib/db";
import { NextResponse } from "next/server";
import {
  createTaskSchema,
  updateTaskSchema,
} from "@/lib/validators/tasks/tasks.validator";
import {
  getAuthContext,
  handleError,
  calculateTaskStats,
  parseTaskQueryParams,
  buildTaskQuery,
  verifyTaskOwnership,
} from "./tasks.utils";

// Types
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

// Constants
const ALLOWED_RANGES: Range[] = [
  "all_time",
  "today",
  "yesterday",
  "week",
  "month",
];

// --- Handlers ---

export const getAllTasksHandler = async (req: AuthenticatedRequest) => {
  try {
    const { filter, range, fromParam, toParam, page, limit, skip } =
      parseTaskQueryParams(req.url);

    if (!ALLOWED_RANGES.includes(range)) {
      return NextResponse.json(
        { success: false, message: "النطاق غير صحيح" },
        { status: 400 },
      );
    }

    const { userId, guestId } = getAuthContext(req);
    const taskQuery: TaskQuery = userId ? { userId } : { guestId };

    const dateQuery = buildTaskQuery(range, fromParam, toParam);
    if (dateQuery) {
      taskQuery.createdAt = dateQuery;
    }

    await connect();

    const [result] = await Task.aggregate([
      { $match: taskQuery },
      {
        $facet: {
          tasks: [
            ...(filter === "active" ? [{ $match: { completed: false } }] : []),
            ...(filter === "completed"
              ? [{ $match: { completed: true } }]
              : []),
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit },
          ],
          total: [
            ...(filter === "active" ? [{ $match: { completed: false } }] : []),
            ...(filter === "completed"
              ? [{ $match: { completed: true } }]
              : []),
            { $count: "count" },
          ],
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
    const totalPages = Math.ceil(total / limit);

    const stats = calculateTaskStats(result.stats || []);

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
        stats,
      },
      { status: 200 },
    );
  } catch (error) {
    return handleError(error);
  }
};
export const getIncompleteTasksHandler = async (req: AuthenticatedRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, Number(searchParams.get("page") ?? 1));
    const limit = Math.min(
      100,
      Math.max(1, Number(searchParams.get("limit") ?? 20)),
    );
    const skip = (page - 1) * limit;

    const { authId } = getAuthContext(req);

    await connect();

    const query = { completed: false, ...authId };

    const total = await Task.countDocuments(query);
    const tasks = await Task.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
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
    });
  } catch (error) {
    return handleError(error);
  }
};
export const getCompletedTasksHandler = async (req: AuthenticatedRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, Number(searchParams.get("page") ?? 1));
    const limit = Math.min(
      100,
      Math.max(1, Number(searchParams.get("limit") ?? 20)),
    );
    const skip = (page - 1) * limit;

    const { authId } = getAuthContext(req);

    await connect();

    const query = { completed: true, ...authId };

    const total = await Task.countDocuments(query);
    const tasks = await Task.find(query)
      .sort({ completedAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
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
    });
  } catch (error) {
    return handleError(error);
  }
};

export const createTaskHandler = async (req: AuthenticatedRequest) => {
  try {
    const { authId } = getAuthContext(req);
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
    const lastTask = await Task.findOne({ completed: false, ...authId }, null, {
      sort: { createdAt: -1 },
    });

    const nextTaskId = lastTask?._id;
    const task = await Task.create({
      ...validationResult.data,
      nextTaskId,
      ...authId,
    });

    if (lastTask) {
      lastTask.prevTaskId = task._id;
      await lastTask.save();
    }

    return NextResponse.json(
      {
        success: true,
        message: "تم إنشاء المهمة بنجاح",
        task: tasksResponse(task),
      },
      { status: 201 },
    );
  } catch (error) {
    return handleError(error);
  }
};

export const updateTaskHandler = async (
  req: AuthenticatedRequest,
  context?: { params: Promise<{ id: string }> },
) => {
  try {
    const { id } = await context!.params;
    const { userId, guestId } = getAuthContext(req);

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
    const verification = verifyTaskOwnership(task, userId, guestId, "update");
    if (verification.error) return verification.error;

    const taskStatus = task?.completed;
    let updatedTask;

    const updateData = validationResult.data;

    if (taskStatus !== updateData.completed) {
      if (updateData.completed) {
        updatedTask = await Task.findByIdAndUpdate(
          id,
          {
            $set: {
              ...updateData,
              completedAt: new Date(),
              prevTaskId: null,
              nextTaskId: null,
            },
          },
          { new: true, runValidators: true },
        );
      } else {
        updatedTask = await Task.findByIdAndUpdate(
          id,
          { $set: { ...updateData, completedAt: null } },
          { new: true, runValidators: true },
        );
      }
    } else {
      updatedTask = await Task.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "تم تحديث المهمة بنجاح",
        task: tasksResponse(updatedTask),
      },
      { status: 200 },
    );
  } catch (error) {
    return handleError(error);
  }
};

export const deleteTaskHandler = async (
  req: AuthenticatedRequest,
  context?: { params: Promise<{ id: string }> },
) => {
  try {
    const { id } = await context!.params;
    const { userId, guestId } = getAuthContext(req);

    await connect();

    const task = await Task.findById(id);
    const verification = verifyTaskOwnership(task, userId, guestId, "delete");
    if (verification.error) return verification.error;
    const deletedTask = await Task.findByIdAndDelete(id);
    if (!deletedTask)
      return NextResponse.json(
        { success: false, message: "لم يتم العثور على المهمة" },
        { status: 404 },
      );
    if (deletedTask.prevTaskId) {
      await Task.findByIdAndUpdate(deletedTask.prevTaskId, {
        nextTaskId: deletedTask.nextTaskId,
      });
    }
    if (deletedTask.nextTaskId) {
      await Task.findByIdAndUpdate(deletedTask.nextTaskId, {
        prevTaskId: deletedTask.prevTaskId,
      });
    }

    return NextResponse.json(
      { success: true, message: "تم حذف المهمة بنجاح" },
      { status: 200 },
    );
  } catch (error) {
    return handleError(error);
  }
};

export const getSingleTask = async (
  req: AuthenticatedRequest,
  context?: { params: Promise<{ id: string }> },
) => {
  try {
    const { id } = await context!.params;
    const { userId, guestId } = getAuthContext(req);

    await connect();

    const task = await Task.findById(id);
    const verification = verifyTaskOwnership(task, userId, guestId, "access");
    if (verification.error) return verification.error;

    return NextResponse.json(
      {
        success: true,
        message: "تم عرض المهمة بنجاح",
        task: tasksResponse(task),
      },
      { status: 200 },
    );
  } catch (error) {
    return handleError(error);
  }
};

export const reorderTaskHandler = async (
  req: AuthenticatedRequest,
  context?: { params: Promise<{ id: string }> },
) => {
  try {
    const { id } = await context!.params;
    const { newPrevTaskId, newNextTaskId } = await req.json();

    const { userId, guestId } = getAuthContext(req);

    await connect();

    const task = await Task.findById(id);
    const verification = verifyTaskOwnership(task, userId, guestId, "reorder");
    if (verification.error) return verification.error;

    const session = await Task.startSession();

    try {
      await session.withTransaction(async () => {
        // Step 1: Remove from old position
        if (task.prevTaskId) {
          await Task.findByIdAndUpdate(
            task.prevTaskId,
            { nextTaskId: task.nextTaskId },
            { session },
          );
        }

        if (task.nextTaskId) {
          await Task.findByIdAndUpdate(
            task.nextTaskId,
            { prevTaskId: task.prevTaskId },
            { session },
          );
        }

        // Step 2: Insert in new position
        task.prevTaskId = newPrevTaskId || null;
        task.nextTaskId = newNextTaskId || null;
        await task.save({ session });

        if (newPrevTaskId) {
          await Task.findByIdAndUpdate(
            newPrevTaskId,
            { nextTaskId: id },
            { session },
          );
        }

        if (newNextTaskId) {
          await Task.findByIdAndUpdate(
            newNextTaskId,
            { prevTaskId: id },
            { session },
          );
        }
      });

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
    return handleError(error);
  }
};
