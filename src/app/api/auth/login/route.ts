import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import connect from "@/lib/db";
import User from "@/lib/models/user";
import { generateToken } from "@/lib/jwt";

// Validation schema matching the frontend
const loginSchema = z.object({
  email: z
    .string()
    .min(1, "البريد الإلكتروني مطلوب")
    .email("البريد الإلكتروني غير صحيح")
    .toLowerCase(),
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const validationResult = loginSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          status: 400,
          success: false,
          message: "Validation failed",
          errors: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { email, password } = validationResult.data;

    await connect();

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return NextResponse.json(
        {
          status: 401,
          success: false,
          message: "البريد الإلكتروني غير مسجل",
        },
        { status: 401 }
      );
    }

    if (!user.password) {
      return NextResponse.json(
        {
          status: 401,
          success: false,
          message:
            "هذا الحساب مسجل عن طريق جوجل. الرجاء استخدام تسجيل الدخول بجوجل",
        },
        { status: 401 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        {
          status: 401,
          success: false,
          message: "كلمة المرور غير صحيحة",
        },
        { status: 401 }
      );
    }

    if (!user.isActive) {
      return NextResponse.json(
        {
          status: 403,
          success: false,
          message: "تم تعطيل حسابك. يرجى التواصل مع الدعم الفني",
        },
        { status: 403 }
      );
    }

    user.lastLoginAt = new Date();
    await user.save();

    const userResponse = {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePicture: user.profilePicture,
      emailVerified: user.emailVerified,
      preferences: user.preferences,
      stats: user.stats,
      isPremium: user.isPremium,
      createdAt: user.createdAt,
      lastLoginAt: user.lastLoginAt,
    };

    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      fullName: user.fullName,
    });

    return NextResponse.json(
      {
        success: true,
        message: "مرحباً بعودتك!",
        user: userResponse,
        token,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "حدث خطأ ما. يرجى المحاولة لاحقاً",
      },
      { status: 500 }
    );
  }
}
