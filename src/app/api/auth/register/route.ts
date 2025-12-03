import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import connect from "@/lib/db";
import User from "@/lib/models/user";
import { generateToken } from "@/lib/jwt";

// Validation schema
const registerSchema = z.object({
  fullName: z
    .string()
    .min(2, "الاسم يجب أن يكون حرفين على الأقل")
    .max(100, "الاسم طويل جداً"),
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

    const validationResult = registerSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          status: 400,
          success: false,
          message: "البيانات المدخلة غير صحيحة",
          errors: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { fullName, email, password } = validationResult.data;

    await connect();

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        {
          status: 409,
          success: false,
          message: "البريد الإلكتروني مسجل بالفعل",
        },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
      provider: "email",
    });

    const userResponse = {
      id: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email,
      profilePicture: newUser.profilePicture,
      provider: newUser.provider,
    };

    const token = generateToken({
      userId: newUser._id.toString(),
      email: newUser.email,
      fullName: newUser.fullName,
    });

    return NextResponse.json(
      {
        success: true,
        message: "تم إنشاء الحساب بنجاح",
        user: userResponse,
        token,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "حدث خطأ ما. يرجى المحاولة لاحقاً",
      },
      { status: 500 }
    );
  }
}
