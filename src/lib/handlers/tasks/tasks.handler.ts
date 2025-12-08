import { AuthenticatedRequest } from "@/lib/middlewares/authMiddleware";
import Task, { tasksResponse } from "@/lib/models/task";
import connect from "@/lib/db";
import { NextResponse } from "next/server";
import z from "zod";
import {
  createTaskSchema,
  updateTaskSchema,
} from "@/lib/validators/tasks/tasks.validator";

export const getAllTasksHandler = async (req: AuthenticatedRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const filter = searchParams.get("filter");
    const { userId } = req.user;

    await connect();

    const query: Record<string, any> = { userId };

    if (filter === "active") query.completed = false;
    if (filter === "completed") query.completed = true;

    const tasks = await Task.find(query).sort({ createdAt: -1 }).lean();

    return NextResponse.json(
      {
        success: true,
        tasks: tasks.map(tasksResponse),
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
    const { userId } = req.user;

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
      userId,
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
    const { userId } = req.user;

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

    // 3. Find task by ID
    const task = await Task.findById(id);

    if (!task) {
      return NextResponse.json(
        { success: false, message: "المهمة غير موجودة" },
        { status: 404 }
      );
    }

    // 4. Verify ownership
    if (task.userId !== userId) {
      return NextResponse.json(
        { success: false, message: "غير مصرح - لا يمكنك تعديل هذه المهمة" },
        { status: 403 }
      );
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
        task: {
          id: updatedTask!._id,
          title: updatedTask!.title,
          description: updatedTask!.description,
          subtasks: updatedTask!.subtasks,
          completed: updatedTask!.completed,
          createdAt: updatedTask!.createdAt,
          updatedAt: updatedTask!.updatedAt,
        },
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
    const { userId } = req.user;

    await connect();

    const task = await Task.findById(id);

    if (!task) {
      return NextResponse.json(
        { success: false, message: "المهمة غير موجودة" },
        { status: 404 }
      );
    }

    if (task.userId !== userId) {
      return NextResponse.json(
        { success: false, message: "غير مصرح - لا يمكنك تعديل هذه المهمة" },
        { status: 403 }
      );
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
    const { userId } = req.user;

    await connect();

    const task = await Task.findById(id);

    if (!task) {
      return NextResponse.json(
        { success: false, message: "المهمة غير موجودة" },
        { status: 404 }
      );
    }

    if (task.userId !== userId) {
      return NextResponse.json(
        { success: false, message: "غير مصرح - لا يمكنك تعديل هذه المهمة" },
        { status: 403 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "تم حذف المهمة بنجاح",
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
