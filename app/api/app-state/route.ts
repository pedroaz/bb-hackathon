import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("hackathon");
    const appState = await db.collection("app_state").findOne({});

    if (!appState) {
      return NextResponse.json({ started: false });
    }

    const serializedAppState = {
      ...appState,
      _id: appState._id.toString(),
    };

    return NextResponse.json(serializedAppState);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch app state" },
      { status: 500 }
    );
  }
}
