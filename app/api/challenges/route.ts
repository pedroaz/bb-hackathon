import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("hackathon");
    const challenges = await db
      .collection("challenges")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    const serializedChallenges = challenges.map((challenge) => ({
      ...challenge,
      _id: challenge._id.toString(),
    }));

    return NextResponse.json(serializedChallenges);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch challenges" },
      { status: 500 }
    );
  }
}
