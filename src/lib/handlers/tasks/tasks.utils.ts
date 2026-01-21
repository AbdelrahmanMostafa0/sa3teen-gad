import { AuthenticatedRequest } from "@/lib/middlewares/authMiddleware";
import { ITask } from "@/types/tasks";
import { NextResponse } from "next/server";

// Get Authentication Context
export function getAuthContext(req: AuthenticatedRequest) {
  const { userId, guestId } = req.user;
  const authId = userId ? { userId } : { guestId };
  return { userId, guestId, authId };
}

// Standard Error Handler
export function handleError(error: any, message: string = "حدث خطأ ما") {
  console.error("Task Operation Error:", error);
  return NextResponse.json({ success: false, message }, { status: 500 });
}

// Verify Task Ownership
export function verifyTaskOwnership(
  task: ITask | null | undefined,
  userId?: string,
  guestId?: string,
  action: string = "access",
) {
  if (!task) {
    return {
      error: NextResponse.json(
        { success: false, message: "المهمة غير موجودة" },
        { status: 404 },
      ),
    };
  }

  const isAuthorized = userId
    ? task.userId === userId
    : task.guestId === guestId;

  if (!isAuthorized) {
    let actionText = "الوصول إلى";
    if (action === "update") actionText = "تعديل";
    if (action === "delete") actionText = "حذف";
    if (action === "reorder") actionText = "إعادة ترتيب";

    return {
      error: NextResponse.json(
        {
          success: false,
          message: `غير مصرح - لا يمكنك ${actionText} هذه المهمة`,
        },
        { status: 403 },
      ),
    };
  }

  return { success: true };
}

// Calculate Task Stats
export function calculateTaskStats(statsArray: any[]) {
  const activeCount = statsArray.find((s: any) => s._id === false)?.count || 0;
  const completedCount =
    statsArray.find((s: any) => s._id === true)?.count || 0;
  const allCount = activeCount + completedCount;

  return { active: activeCount, completed: completedCount, all: allCount };
}

// Parse Query Parameters
export function parseTaskQueryParams(url: string) {
  const { searchParams } = new URL(url);
  const filter = searchParams.get("filter") as "active" | "completed" | null;
  const range = (searchParams.get("range") as any) || "all_time";
  const fromParam = searchParams.get("from");
  const toParam = searchParams.get("to");

  const page = Math.max(1, Number(searchParams.get("page") ?? 1));
  const limit = Math.min(
    200,
    Math.max(1, Number(searchParams.get("limit") ?? 100)),
  );
  const skip = (page - 1) * limit;

  return { filter, range, fromParam, toParam, page, limit, skip };
}

// Build Date Filter Query
export function buildTaskQuery(
  range: string,
  fromParam: string | null,
  toParam: string | null,
) {
  const dateQuery: any = {};

  if (fromParam || toParam) {
    if (fromParam) dateQuery.$gte = new Date(fromParam);
    if (toParam) dateQuery.$lte = new Date(toParam);
    return dateQuery;
  }

  if (range === "all_time") return undefined;

  const now = new Date();
  const startOfToday = new Date(now.setHours(0, 0, 0, 0));

  if (range === "today") {
    dateQuery.$gte = startOfToday;
  } else if (range === "yesterday") {
    const startOfYesterday = new Date(startOfToday);
    startOfYesterday.setDate(startOfYesterday.getDate() - 1);
    const endOfYesterday = new Date(startOfToday);
    endOfYesterday.setMilliseconds(-1);
    dateQuery.$gte = startOfYesterday;
    dateQuery.$lte = endOfYesterday;
  } else if (range === "week") {
    const sevenDaysAgo = new Date(startOfToday);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    dateQuery.$gte = sevenDaysAgo;
  } else if (range === "month") {
    const startOfMonth = new Date(
      startOfToday.getFullYear(),
      startOfToday.getMonth(),
      1,
    );
    dateQuery.$gte = startOfMonth;
  }

  return dateQuery;
}
