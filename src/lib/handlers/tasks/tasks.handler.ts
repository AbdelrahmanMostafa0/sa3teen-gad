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

    const session = await Task.startSession();

    try {
      let createdTask;

      await session.withTransaction(async () => {
        // Find head task and create new task in a single transaction
        const headTask = await Task.findOne(
          {
            ...authId,
            completed: false,
            prevTaskId: null,
          },
          null,
          { session },
        );

        const nextTaskId = headTask?._id ?? null;

        // Create the new task
        const [task] = await Task.create(
          [
            {
              nextTaskId,
              ...validationResult.data,
              ...authId,
            },
          ],
          { session },
        );

        // Update the old head task's prevTaskId if it exists
        if (headTask) {
          await Task.updateOne(
            { _id: headTask._id },
            { $set: { prevTaskId: task._id } },
            { session },
          );
        }

        createdTask = task;
      });

      return NextResponse.json(
        {
          success: true,
          message: "تم إنشاء المهمة بنجاح",
          task: tasksResponse(createdTask!),
        },
        { status: 201 },
      );
    } finally {
      await session.endSession();
    }
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
    const currentTaskId = id;
    const { newPrevTaskId, newNextTaskId } = await req.json();

    const { userId, guestId } = getAuthContext(req);

    await connect();

    const task = await Task.findById(currentTaskId);
    if (!task)
      return NextResponse.json(
        { success: false, message: "لم يتم العثور على المهمة" },
        { status: 404 },
      );

    const verification = verifyTaskOwnership(task, userId, guestId, "reorder");
    if (verification.error) return verification.error;

    // Early return if position hasn't changed
    if (
      task.prevTaskId === newPrevTaskId &&
      task.nextTaskId === newNextTaskId
    ) {
      return NextResponse.json(
        {
          success: true,
          message: "تم إعادة الترتيب بنجاح",
          task: tasksResponse(task),
        },
        { status: 200 },
      );
    }

    // Fetch neighbor tasks and verify they exist
    const prevTask = newPrevTaskId ? await Task.findById(newPrevTaskId) : null;
    const nextTask = newNextTaskId ? await Task.findById(newNextTaskId) : null;

    if (newPrevTaskId && !prevTask) {
      return NextResponse.json(
        {
          success: false,
          message: "المهمة السابقة غير موجودة",
        },
        { status: 400 },
      );
    }

    if (newNextTaskId && !nextTask) {
      return NextResponse.json(
        {
          success: false,
          message: "المهمة التالية غير موجودة",
        },
        { status: 400 },
      );
    }

    const session = await Task.startSession();

    try {
      await session.withTransaction(async () => {
        // Build all updates as a single bulkWrite operation
        const bulkOps = [];

        // Step 1: Remove from old position
        if (task.prevTaskId) {
          bulkOps.push({
            updateOne: {
              filter: { _id: task.prevTaskId },
              update: { $set: { nextTaskId: task.nextTaskId } },
            },
          });
        }

        if (task.nextTaskId) {
          bulkOps.push({
            updateOne: {
              filter: { _id: task.nextTaskId },
              update: { $set: { prevTaskId: task.prevTaskId } },
            },
          });
        }

        // Step 2: Insert in new position - update current task
        bulkOps.push({
          updateOne: {
            filter: { _id: currentTaskId },
            update: {
              $set: {
                prevTaskId: newPrevTaskId || null,
                nextTaskId: newNextTaskId || null,
              },
            },
          },
        });

        // Update new neighbors
        if (newPrevTaskId) {
          bulkOps.push({
            updateOne: {
              filter: { _id: newPrevTaskId },
              update: { $set: { nextTaskId: currentTaskId } },
            },
          });
        }

        if (newNextTaskId) {
          bulkOps.push({
            updateOne: {
              filter: { _id: newNextTaskId },
              update: { $set: { prevTaskId: currentTaskId } },
            },
          });
        }

        // Execute all operations in a single round-trip
        await Task.bulkWrite(bulkOps, { session });
      });

      const updatedTask = await Task.findById(currentTaskId);

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
