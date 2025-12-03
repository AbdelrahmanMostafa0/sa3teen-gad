import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import connect from "@/lib/db";
import User from "@/lib/models/user";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "غير مصرح" },
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

    const user = await User.findById(decoded.userId);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "المستخدم غير موجود" },
        { status: 404 }
      );
    }

    const userResponse = {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePicture: user.profilePicture,
      provider: user.provider,
      emailVerified: user.emailVerified,
      preferences: user.preferences,
      stats: user.stats,
      isPremium: user.isPremium,
      createdAt: user.createdAt,
      lastLoginAt: user.lastLoginAt,
    };

    return NextResponse.json(
      {
        success: true,
        user: userResponse,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get user error:", error);
    return NextResponse.json(
      { success: false, message: "حدث خطأ ما" },
      { status: 500 }
    );
  }
}
