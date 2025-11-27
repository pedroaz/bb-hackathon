import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { checkAdminAuth } from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  const authError = checkAdminAuth(request);
  if (authError) return authError;

  try {
    const { competitorId, challengeId } = await request.json();

    if (!competitorId || !challengeId) {
      return NextResponse.json(
        { error: "Missing competitorId or challengeId" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("hackathon");

    const challenge = await db
      .collection("challenges")
      .findOne({ _id: new ObjectId(challengeId) });

    if (!challenge) {
      return NextResponse.json(
        { error: "Challenge not found" },
        { status: 404 }
      );
    }

    const competitor = await db
      .collection("competitors")
      .findOne({ _id: new ObjectId(competitorId) });

    if (!competitor) {
      return NextResponse.json(
        { error: "Competitor not found" },
        { status: 404 }
      );
    }

    if (competitor.completedChallenges?.includes(challengeId)) {
      return NextResponse.json(
        { error: "Challenge already completed by this competitor" },
        { status: 400 }
      );
    }

    await db.collection("competitors").updateOne(
      { _id: new ObjectId(competitorId) },
      {
        $inc: { points: challenge.points },
        $push: { completedChallenges: challengeId },
      }
    );

    return NextResponse.json({
      message: "Challenge completed successfully",
      pointsAwarded: challenge.points,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to complete challenge" },
      { status: 500 }
    );
  }
}
