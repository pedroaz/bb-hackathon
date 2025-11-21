"use client";

import { useEffect, useState } from "react";
import { Challenge } from "@/lib/types/challenge";
import { AppState } from "@/lib/types/app-state";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock } from "lucide-react";

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [appState, setAppState] = useState<AppState | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [challengesRes, appStateRes] = await Promise.all([
          fetch("/api/challenges"),
          fetch("/api/app-state"),
        ]);

        const challengesData = await challengesRes.json();
        const appStateData = await appStateRes.json();

        setChallenges(challengesData);
        setAppState(appStateData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Challenges
        </h1>
        <p className="text-muted-foreground text-lg mb-8">
          Complete these challenges to earn points!
        </p>

        {!appState?.started && (
          <div className="mb-6 p-4 rounded-lg bg-muted border-2 border-orange-500/50">
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-orange-600" />
              <p className="font-medium text-orange-600">
                Hackathon hasn't started yet!
              </p>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Challenge details will be revealed when the hackathon begins.
            </p>
          </div>
        )}

        {loading ? (
          <p className="text-muted-foreground">Loading challenges...</p>
        ) : challenges.length === 0 ? (
          <p className="text-muted-foreground">
            No challenges yet. Reset the database from the admin panel.
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {challenges.map((challenge) => (
              <Card key={challenge._id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-xl">{challenge.name}</CardTitle>
                    <Badge className="bg-gradient-to-r from-primary to-accent text-white">
                      {challenge.points} pts
                    </Badge>
                  </div>
                  <CardDescription>
                    {appState?.started ? (
                      challenge.description
                    ) : (
                      <span className="italic text-muted-foreground flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        Details will be published when hackathon starts
                      </span>
                    )}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
