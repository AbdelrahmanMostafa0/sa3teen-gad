import connect from "@/lib/db";
import { generateToken } from "@/lib/jwt";
import User from "@/lib/models/user";
import { defaultSettings } from "@/types/user";
import { NextRequest, NextResponse } from "next/server";

// google auth handler
export const googleHandler = async (req: NextRequest) => {
  try {
    const { access_token } = await req.json();

    if (!access_token) {
      return NextResponse.json(
        {
          success: false,
          message: "رمز الوصول مطلوب",
        },
        { status: 400 }
      );
    }

    const userInfoResponse = await fetch(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: { Authorization: `Bearer ${access_token}` },
      }
    );

    if (!userInfoResponse.ok) {
      return NextResponse.json(
        {
          success: false,
          message: "فشل التحقق من بيانات جوجل",
        },
        { status: 401 }
      );
    }

    const googleUser = await userInfoResponse.json();
    const { sub: googleId, email, name, picture } = googleUser;

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          message: "البريد الإلكتروني غير متوفر من جوجل",
        },
        { status: 400 }
      );
    }

    await connect();

    let user = await User.findOne({ email });

    if (user) {
      if (!user.googleId) {
        user.googleId = googleId;
        user.provider = "google";
      }

      user.lastLoginAt = new Date();
      await user.save();
    } else {
      user = await User.create({
        fullName: name || "مستخدم جوجل",
        email,
        googleId,
        provider: "google",
        profilePicture: picture || null,
        password: null,
        settings: defaultSettings,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLoginAt: new Date(),
      });
    }

    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      fullName: user.fullName,
    });

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
        message: "تم تسجيل الدخول بنجاح",
        user: userResponse,
        token,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Google auth error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "حدث خطأ ما. يرجى المحاولة لاحقاً",
      },
      { status: 500 }
    );
  }
};
