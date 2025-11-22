import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("hackathon");
    const competitors = await db
      .collection("competitors")
      .find({})
      .toArray();

    const serializedCompetitors = competitors.map((competitor) => ({
      ...competitor,
      _id: competitor._id.toString(),
    }));

    return NextResponse.json(serializedCompetitors);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch competitors" },
      { status: 500 }
    );
  }
}
