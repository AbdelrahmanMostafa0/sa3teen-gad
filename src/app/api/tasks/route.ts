import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { verifyToken } from "@/lib/jwt";
import connect from "@/lib/db";
import Task, { tasksResponse } from "@/lib/models/task";

// Validation schema for creating a task
const createTaskSchema = z.object({
  title: z.string().min(1, "العنوان مطلوب").max(500, "العنوان طويل جداً"),
  description: z.string().max(2000, "الوصف طويل جداً").optional(),
  subtasks: z
    .array(
      z.object({
        title: z.string(),
        done: z.boolean().default(false),
      })
    )
    .optional()
    .default([]),

  completed: z.boolean().optional().default(false),
});

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "غير مصرح - يجب تسجيل الدخول" },
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
      userId: decoded.userId,
    });

    return NextResponse.json(
      {
        success: true,
        message: "تم إنشاء المهمة بنجاح",
        task: {
          id: task._id,
          title: task.title,
          description: task.description,
          subtasks: task.subtasks,
          completed: task.completed,
          createdAt: task.createdAt,
          updatedAt: task.updatedAt,
        },
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
}

// get all tasks
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const filter = searchParams.get("filter");

  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "غير مصرح - يجب تسجيل الدخول" },
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
    if (filter === "active") {
      const tasks = await Task.find({
        userId: decoded.userId,
        completed: false,
      })
        .sort({ createdAt: -1 })
        .lean();
      return NextResponse.json(
        {
          success: true,
          tasks: tasks.map(tasksResponse),
        },
        { status: 200 }
      );
    }
    if (filter === "completed") {
      const tasks = await Task.find({
        userId: decoded.userId,
        completed: true,
      })
        .sort({ createdAt: -1 })
        .lean();
      return NextResponse.json(
        {
          success: true,
          tasks: tasks.map(tasksResponse),
        },
        { status: 200 }
      );
    }
    const tasks = await Task.find({ userId: decoded.userId })
      .sort({ createdAt: -1 })
      .lean();

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
}
