import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(request: Request) {
  try {
    const { setting } = await request.json();

    if (!setting || !["show_points", "show_challenges"].includes(setting)) {
      return NextResponse.json(
        { error: "Invalid setting parameter" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("hackathon");

    const currentState = await db.collection("app_state").findOne({});

    if (!currentState) {
      return NextResponse.json(
        { error: "App state not found" },
        { status: 404 }
      );
    }

    const newValue = !currentState[setting];

    await db.collection("app_state").updateOne(
      { _id: currentState._id },
      {
        $set: {
          [setting]: newValue,
          updatedAt: new Date(),
        },
      }
    );

    const settingLabel = setting === "show_points" ? "Points" : "Challenges Completed";

    return NextResponse.json({
      message: `${settingLabel} visibility ${newValue ? "enabled" : "disabled"}`,
      [setting]: newValue,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to toggle setting" },
      { status: 500 }
    );
  }
}
