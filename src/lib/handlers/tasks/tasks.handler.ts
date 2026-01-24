import { AuthenticatedRequest } from "@/lib/middlewares/authMiddleware";
import Task, { tasksResponse } from "@/lib/models/task";
import connect from "@/lib/db";
import { NextResponse } from "next/server";
import {
  createTaskSchema,
  updateTaskSchema,
  reorderTaskSchema,
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

export const getTaskWithFiltersHandler = async (req: AuthenticatedRequest) => {
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
      .sort({ order: -1 })
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
export const getAllTasksHandler = async (req: AuthenticatedRequest) => {
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

    const query = { ...authId };

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

    const lastTask = await Task.findOne({ ...authId }).sort({ order: -1 });

    const order = lastTask ? lastTask.order + 10000 : 10000;

    const task = await Task.create({
      ...validationResult.data,
      ...authId,
      order,
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
    return handleError(error);
  }
};

export const updateTaskHandler = async (
  req: AuthenticatedRequest,
  context?: { params: Promise<{ id: string }> },
) => {
  try {
    const { id } = await context!.params;
    const { authId } = getAuthContext(req);

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
    const verification = verifyTaskOwnership(task, authId, "update");
    if (verification.error) return verification.error;
    const updateData = validationResult.data;
    if (task?.completed !== updateData.completed) {
      if (updateData.completed) {
        updateData.completedAt = new Date();
      } else {
        const lastTask = await Task.findOne({ ...authId }).sort({ order: -1 });
        const order = lastTask ? lastTask.order + 10000 : 10000;
        updateData.order = order;
        updateData.completedAt = null;
      }
    }
    const taskUpdate = await Task.findByIdAndUpdate(
      id,
      { $set: { ...updateData } },
      { new: true, runValidators: true },
    );

    return NextResponse.json(
      {
        success: true,
        message: "تم تحديث المهمة بنجاح",
        task: tasksResponse(taskUpdate),
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
    const { authId } = getAuthContext(req);

    await connect();

    const task = await Task.findById(id);
    const verification = verifyTaskOwnership(task, authId, "delete");
    if (verification.error) return verification.error;

    const deletedTask = await Task.findByIdAndDelete(id);

    return NextResponse.json(
      {
        success: true,
        message: "تم حذف المهمة بنجاح",
        task: tasksResponse(deletedTask),
      },
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
    const { authId } = getAuthContext(req);

    await connect();

    const task = await Task.findById(id);
    const verification = verifyTaskOwnership(task, authId, "access");
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
    const { authId } = getAuthContext(req);

    const body = await req.json();
    const validationResult = reorderTaskSchema.safeParse(body);

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

    const { prevOrder, nextOrder } = validationResult.data;

    await connect();

    const task = await Task.findById(id);
    const verification = verifyTaskOwnership(task, authId, "reorder");
    if (verification.error) return verification.error;

    // Calculate new order based on neighbors
    let newOrder: number;
    if (prevOrder !== null && nextOrder !== null) {
      // Insert between two tasks: use midpoint
      newOrder = (prevOrder + nextOrder) / 2;
    } else if (nextOrder !== null) {
      // Insert at end (after prevTask)
      newOrder = nextOrder + 10000;
    } else if (prevOrder !== null) {
      // Insert at beginning (before nextTask)
      newOrder = prevOrder / 2;
    } else {
      // Only task in the list
      newOrder = 10000;
    }

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { $set: { order: newOrder } },
      { new: true },
    );

    return NextResponse.json(
      {
        success: true,
        message: "تم إعادة ترتيب المهمة بنجاح",
        task: tasksResponse(updatedTask),
      },
      { status: 200 },
    );
  } catch (error) {
    return handleError(error);
  }
};
