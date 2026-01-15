import { AuthenticatedRequest } from "@/lib/middlewares/authMiddleware";
import { NextResponse } from "next/server";
import connect from "@/lib/db";
import User from "@/lib/models/user";
import { updateUserSchema } from "@/lib/validators/auth/me.validator";

// get user profile handler
export const getUserHandler = async (req: AuthenticatedRequest) => {
  try {
    const { userId } = req.user;

    await connect();

    const user = await User.findById(userId);

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
      settings: user.settings,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
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
};

// update user profile handler
export const updateUserHandler = async (req: AuthenticatedRequest) => {
  try {
    const { userId } = req.user;

    const body = await req.json();

    const validationResult = updateUserSchema.safeParse(body);

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

    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "المستخدم غير موجود" },
        { status: 404 }
      );
    }

    const updateData: any = {};
    const validatedData = validationResult.data;

    if (validatedData.fullName !== undefined) {
      updateData.fullName = validatedData.fullName;
    }

    if (validatedData.profilePicture !== undefined) {
      updateData.profilePicture = validatedData.profilePicture;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, message: "فشل تحديث البيانات" },
        { status: 500 }
      );
    }

    const userResponse = {
      id: updatedUser._id,
      fullName: updatedUser.fullName,
      email: updatedUser.email,
      profilePicture: updatedUser.profilePicture,
      provider: updatedUser.provider,
      settings: updatedUser.settings,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
      lastLoginAt: updatedUser.lastLoginAt,
    };

    return NextResponse.json(
      {
        success: true,
        message: "تم تحديث البيانات بنجاح",
        user: userResponse,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update user error:", error);
    return NextResponse.json(
      { success: false, message: "حدث خطأ ما" },
      { status: 500 }
    );
  }
};
