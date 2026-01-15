import { NextResponse } from "next/server";
import Settings from "@/lib/models/settings";
import { AuthenticatedRequest } from "@/lib/middlewares/authMiddleware";
import connect from "@/lib/db";

export async function getSettings(req: AuthenticatedRequest) {
  try {
    await connect();
    const { userId, guestId } = req.user;
    console.log("guestId", guestId);

    const query = userId ? { userId } : { guestId };

    let settings = await Settings.findOne(query);

    if (!settings) {
      settings = await Settings.create(query);
    }

    return NextResponse.json(settings, { status: 200 });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function updateSettings(req: AuthenticatedRequest) {
  try {
    await connect();

    const { userId, guestId } = req.user;
    const body = await req.json();
    console.log("update guestId", guestId);

    delete body._id;
    delete body.userId;
    delete body.guestId;
    delete body.createdAt;
    delete body.updatedAt;

    const query = userId ? { userId } : { guestId };

    const settings = await Settings.findOneAndUpdate(
      query,
      { $set: body },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
        runValidators: true,
      }
    );
    if (!settings) {
      return NextResponse.json(
        { success: false, message: "فشل تحديث البيانات" },
        { status: 500 }
      );
    }
    return NextResponse.json(settings, { status: 200 });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
