import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { verifyToken } from "@/lib/jwt";
import connect from "@/lib/db";
import Task from "@/lib/models/task";

const updateTaskSchema = z.object({
  title: z
    .string()
    .min(1, "العنوان مطلوب")
    .max(500, "العنوان طويل جداً")
    .optional(),
  description: z.string().max(2000, "الوصف طويل جداً").optional().nullable(),
  subtasks: z
    .array(
      z.object({
        title: z.string(),
        done: z.boolean(),
      })
    )
    .optional(),
  completed: z.boolean().optional(),
});

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    const task = await Task.findById(id);

    if (!task) {
      return NextResponse.json(
        { success: false, message: "المهمة غير موجودة" },
        { status: 404 }
      );
    }

    if (task.userId !== decoded.userId) {
      return NextResponse.json(
        { success: false, message: "غير مصرح - لا يمكنك الوصول لهذه المهمة" },
        { status: 403 }
      );
    }

    return NextResponse.json(
      {
        success: true,
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
      { status: 200 }
    );
  } catch (error) {
    console.error("Get task error:", error);
    return NextResponse.json(
      { success: false, message: "حدث خطأ ما" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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
    if (task.userId !== decoded.userId) {
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
}

/**
 * DELETE /api/tasks/[id]
 * Delete a task (only if it belongs to the user)
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // 1. Verify authentication
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

    // 2. Find task by ID
    const task = await Task.findById(id);

    if (!task) {
      return NextResponse.json(
        { success: false, message: "المهمة غير موجودة" },
        { status: 404 }
      );
    }

    // 3. Verify ownership
    if (task.userId !== decoded.userId) {
      return NextResponse.json(
        { success: false, message: "غير مصرح - لا يمكنك حذف هذه المهمة" },
        { status: 403 }
      );
    }

    // 4. Delete task
    await Task.findByIdAndDelete(id);

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
}
