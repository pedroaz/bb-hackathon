import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { checkAdminAuth } from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  const authError = checkAdminAuth(request);
  if (authError) return authError;

  try {
    const client = await clientPromise;
    const db = client.db("hackathon");

    const currentState = await db.collection("app_state").findOne({});

    if (!currentState) {
      const newState = {
        started: true,
        updatedAt: new Date(),
      };
      await db.collection("app_state").insertOne(newState);
      return NextResponse.json({
        message: "App state created and set to started",
        started: true,
      });
    }

    const newStartedValue = !currentState.started;

    await db.collection("app_state").updateOne(
      { _id: currentState._id },
      {
        $set: {
          started: newStartedValue,
          updatedAt: new Date(),
        },
      }
    );

    return NextResponse.json({
      message: `Hackathon ${newStartedValue ? "started" : "paused"}`,
      started: newStartedValue,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to toggle app state" },
      { status: 500 }
    );
  }
}
