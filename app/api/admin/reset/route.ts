import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { checkAdminAuth } from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  const authError = checkAdminAuth(request);
  if (authError) return authError;

  try {
    const client = await clientPromise;
    const db = client.db("hackathon");

    await db.collection("competitors").deleteMany({});
    await db.collection("challenges").deleteMany({});
    await db.collection("app_state").deleteMany({});

    const defaultCompetitors = [
      {
        name: "Pedro",
        reason: "I am organizing the hackathon, why are you asking me this?",
        image: "/competitors/pedro.png",
        points: 0,
        completedChallenges: [],
        createdAt: new Date(),
      },
      {
        name: "Christopher",
        reason: "Is it going to impact my end of the year review? Yes...? Ok I'll come...",
        image: "/competitors/christopher.png",
        points: 0,
        completedChallenges: [],
        createdAt: new Date(),
      },
      {
        name: "Deanna",
        reason: "Can I chant USA, USA when I win?",
        image: "/competitors/deanna.png",
        points: 0,
        completedChallenges: [],
        createdAt: new Date(),
      },
      {
        name: "David",
        reason: "I have a Golf event during it, but I will multitask!",
        image: "/competitors/david.png",
        points: 0,
        completedChallenges: [],
        createdAt: new Date(),
      },
      {
        name: "Arsenij",
        reason: "Can we PLEASE use the hackathon to fix the microwave?",
        image: "/competitors/arseji.png",
        points: 0,
        completedChallenges: [],
        createdAt: new Date(),
      },
      {
        name: "Irina",
        reason: "Надеюсь, я правильно использую этот инструмент перевода.",
        image: "/competitors/irina.png",
        points: 0,
        completedChallenges: [],
        createdAt: new Date(),
      },
      {
        name: "Amine",
        reason: "Can I code and drink? If so, yes!",
        image: "/competitors/amine.png",
        points: 0,
        completedChallenges: [],
        createdAt: new Date(),
      },
      {
        name: "Omar",
        reason: "Pedro stole my idea, the hackathon is mine!",
        image: "/competitors/omar.png",
        points: 0,
        completedChallenges: [],
        createdAt: new Date(),
      },
      {
        name: "Fred",
        reason: "Hackathon? You mean place where I will collect points and destroy competition, count me in!",
        image: "/competitors/fred.png",
        points: 0,
        completedChallenges: [],
        createdAt: new Date(),
      },
      {
        name: "Sasha",
        reason: "If I can play chess on my phone during it I'll be there!",
        image: "/competitors/sasha.png",
        points: 0,
        completedChallenges: [],
        createdAt: new Date(),
      },
      {
        name: "Maike",
        reason: "After the hackathon we should all go to a Spinning class!",
        image: "/competitors/maike.png",
        points: 0,
        completedChallenges: [],
        createdAt: new Date(),
      },
      {
        name: "Joffi",
        reason: "Too cool to join, but I will anyway.",
        image: "/competitors/yofi.png",
        points: 0,
        completedChallenges: [],
        createdAt: new Date(),
      },
      {
        name: "Maya",
        reason: "I'll come if the Frenchman is there!",
        image: "/competitors/maya.png",
        points: 0,
        completedChallenges: [],
        createdAt: new Date(),
      },
      {
        name: "Thomas",
        reason: "Why do you keep calling me the Frenchman????",
        image: "/competitors/thomas.png",
        points: 0,
        completedChallenges: [],
        createdAt: new Date(),
      },
      {
        name: "Enrico",
        reason: "I am the only designer here? This will not end well",
        image: "/competitors/enrico.png",
        points: 0,
        completedChallenges: [],
        createdAt: new Date(),
      },
      {
        name: "Danni",
        reason: "I never said yes to it!",
        image: "/competitors/danni.png",
        points: 0,
        completedChallenges: [],
        createdAt: new Date(),
      },
      {
        name: "Fran",
        reason: "I will fail all your tickets if you don't invite me!",
        image: "/competitors/fran.png",
        points: 0,
        completedChallenges: [],
        createdAt: new Date(),
      },
      {
        name: "Floyd",
        reason: "I'll come! And by the way, the link to my soundcloud is https://soundcloud.com/floydnant",
        image: "/competitors/floyd.png",
        points: 0,
        completedChallenges: [],
        createdAt: new Date(),
      },
    ];

    const defaultChallenges = [
      {
        name: "Accept on Teams!",
        description: "Clicked Accept",
        points: 1,
        createdAt: new Date(),
      },
      {
        name: "I am not alone!",
        description: "Come to the Hackathon!",
        points: 5,
        createdAt: new Date(),
      },
      {
        name: "Deutsche bahn got nothing on you!",
        description: "Be on time for the event",
        points: 3,
        createdAt: new Date(),
      },
      {
        name: "Guess the body part",
        description: "Can you guess who this forehead belongs to? Show us your detective skills!",
        points: 10,
        createdAt: new Date(),
      },
      {
        name: "Who needs a keyboard?",
        description: "Code a feature of your app using your phone.",
        points: 15,
        createdAt: new Date(),
      },
      {
        name: "We are old. Old school.",
        description: "Make one asset of your app using Microsoft Paint.",
        points: 5,
        createdAt: new Date(),
      },
      {
        name: "Das ist Berlin!",
        description: "Add sound effects to your app, because #Techno",
        points: 5,
        createdAt: new Date(),
      },
      {
        name: "Eye of the Tiger",
        description: "Do 5 push-ups while Eye of the tiger is playing",
        points: 5,
        createdAt: new Date(),
      },
      {
        name: "Beep boop, I am a programmer",
        description: "Add assembly to your codebase",
        points: 15,
        createdAt: new Date(),
      },
      {
        name: "Make Genz Happy",
        description: "Post a video about the app in Tiktok",
        points: 20,
        createdAt: new Date(),
      },
      {
        name: "Make Boomers Happy",
        description: "Post a video about the app in Whatsapp status",
        points: 20,
        createdAt: new Date(),
      },
      {
        name: "Scope Creep",
        description: "Receive Scope Creep from Fred",
        points: 3,
        createdAt: new Date(),
      },
      {
        name: "Chug, Chug, Chug!",
        description: "It does not need to be alcoholic. Just chug a drink of your choice!",
        points: 4,
        createdAt: new Date(),
      },
      {
        name: "Winner of Event 1",
        description: "Be part of the team who wins the first event!",
        points: 10,
        createdAt: new Date(),
      },
      {
        name: "Winner of Event 2",
        description: "Be part of the team who wins the second event!",
        points: 15,
        createdAt: new Date(),
      },
      {
        name: "Winner of Event 3",
        description: "Be part of the team who wins the third event!",
        points: 20,
        createdAt: new Date(),
      },
      {
        name: "Hack the Hackathon",
        description: "Enter the admin screen and give yourself this award! Tip: The organizer's ego might help you find it.",
        points: 15,
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
