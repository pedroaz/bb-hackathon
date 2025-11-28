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
        description: "[S] You accepted on Teams, you get a point!",
        points: 1,
        createdAt: new Date(),
      },
      {
        name: "I am not alone!",
        description: "[S] You came to the hackathon, have a point for that!",
        points: 1,
        createdAt: new Date(),
      },
      {
        name: "Deutsche bahn got nothing on you!",
        description: "[S] Be on time for the event, I guess that's also worth a point?",
        points: 1,
        createdAt: new Date(),
      },
      {
        name: "Guess the body part",
        description: "[S] [Magic Bowl #1] Get the correct answer on the Magic Bowl #1",
        points: 3,
        createdAt: new Date(),
      },
      {
        name: "Who needs a keyboard?",
        description: "[G] Code a feature of your app using your phone. It needs to be more than just a line of code",
        points: 10,
        createdAt: new Date(),
      },
      {
        name: "We are old. Old school.",
        description: "[G] Add one asset to your app using Microsoft Paint.",
        points: 5,
        createdAt: new Date(),
      },
      {
        name: "Das ist Berlin!",
        description: "[G] Add sound effects to your app, because #Techno",
        points: 5,
        createdAt: new Date(),
      },
      {
        name: "Eye of the Tiger",
        description: "[S] Do 5 push-ups while Eye of the tiger is playing",
        points: 5,
        createdAt: new Date(),
      },
      {
        name: "Beep boop, I am a programmer",
        description: "[G] Add assembly to your codebase",
        points: 10,
        createdAt: new Date(),
      },
      {
        name: "Make Genz Happy",
        description: "[G] Post a video about the app in Tiktok",
        points: 5,
        createdAt: new Date(),
      },
      {
        name: "Make Boomers Happy",
        description: "[S] Post a video about the app in Whatsapp status",
        points: 3,
        createdAt: new Date(),
      },
      {
        name: "Guess the height",
        description: "[S] [Magic Bowl #2] Get the correct answer on the Magic Bowl #2",
        points: 3,
        createdAt: new Date(),
      },
      {
        name: "Chug, Chug, Chug!",
        description: "[S] It does not need to be alcoholic. Just chug a drink of your choice!",
        points: 1,
        createdAt: new Date(),
      },
      {
        name: "Did you even pay attention to the JFs?",
        description: "[G] Make your app accessible using voice navigation (a11y)!",
        points: 3,
        createdAt: new Date(),
      },
      {
        name: "BB is watching you!",
        description: "[G] Add a way to track usage to your app!",
        points: 5,
        createdAt: new Date(),
      },
      {
        name: "Value Prop Haiku",
        description: "[S] Summarize your value prop in a 5-7-5 haiku.",
        points: 3,
        createdAt: new Date(),
      },
      {
        name: "Ship it or it does not count",
        description: "[G] Be the first group to deploy your app!",
        points: 3,
        createdAt: new Date(),
      },
      {
        name: "Thank you!",
        description: "[S] [Magic Bowl #3] Add a note to the Magic Bowl #3!",
        points: 3,
        createdAt: new Date(),
      },
      {
        name: "Winner of Event 1",
        description: "[G] Be part of the team who wins the first event!",
        points: 10,
        createdAt: new Date(),
      },
      {
        name: "Winner of Event 2",
        description: "[G] Be part of the team who wins the second event!",
        points: 10,
        createdAt: new Date(),
      },
      {
        name: "Winner of Event 3",
        description: "[G] Be part of the team who wins the third event!",
        points: 10,
        createdAt: new Date(),
      },
      {
        name: "Hack the Hackathon",
        description: "[S] Enter the admin screen and give yourself this award!",
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
