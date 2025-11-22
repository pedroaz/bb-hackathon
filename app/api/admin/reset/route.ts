import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST() {
  try {
    const client = await clientPromise;
    const db = client.db("hackathon");

    await db.collection("competitors").deleteMany({});
    await db.collection("challenges").deleteMany({});
    await db.collection("app_state").deleteMany({});

    const defaultCompetitors = [
      {
        name: "Pedro",
        reason: "Organizing the hackathon",
        image: "/competitors/pedro.png",
        points: 0,
        completedChallenges: [],
        createdAt: new Date(),
      },
      {
        name: "Sasha",
        reason: "Love for creative challenges",
        image: "",
        points: 0,
        completedChallenges: [],
        createdAt: new Date(),
      },
    ];

    const defaultChallenges = [
      {
        name: "Guess the forehead",
        description: "Can you guess who this forehead belongs to? Show us your detective skills!",
        points: 3,
        createdAt: new Date(),
      },
      {
        name: "10 pushups",
        description: "Drop and give us 10! Show your strength and stamina.",
        points: 5,
        createdAt: new Date(),
      },
      {
        name: "Make Genz Happy",
        description: "Post a video about the app in Tiktok",
        points: 5,
        createdAt: new Date(),
      },
      {
        name: "I am not alone!",
        description: "Come to the Hackathon!",
        points: 5,
        createdAt: new Date(),
      },
      {
        name: "Hug Train",
        description: "Receive a Hug from the Hug Train",
        points: 5,
        createdAt: new Date(),
      },
    ];

    const defaultAppState = {
      started: false,
      show_points: true,
      show_challenges: true,
      updatedAt: new Date(),
    };

    await db.collection("competitors").insertMany(defaultCompetitors);
    await db.collection("challenges").insertMany(defaultChallenges);
    await db.collection("app_state").insertOne(defaultAppState);

    return NextResponse.json({
      message: "Database reset successfully",
      competitors: defaultCompetitors,
      challenges: defaultChallenges,
      appState: defaultAppState,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to reset database" },
      { status: 500 }
    );
  }
}
