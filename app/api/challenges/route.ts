import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { checkAdminAuth } from "@/lib/admin-auth";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("hackathon");
    const challenges = await db
      .collection("challenges")
      .find({})
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

export async function POST(request: NextRequest) {
  const authError = checkAdminAuth(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { name, description } = body;

    if (!name || !description) {
      return NextResponse.json(
        { error: "Missing required fields: name and description" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("hackathon");

    const newChallenge = {
      name,
      description,
      points: 100000,
      createdAt: new Date(),
    };

    const result = await db.collection("challenges").insertOne(newChallenge);

    const insertedChallenge = {
      ...newChallenge,
      _id: result.insertedId.toString(),
    };

    return NextResponse.json({
      message: "Challenge created successfully",
      challenge: insertedChallenge,
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create challenge" },
      { status: 500 }
    );
  }
}
