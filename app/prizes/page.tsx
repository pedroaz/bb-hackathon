"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Prize } from "@/lib/types/prize";
import { AppState } from "@/lib/types/app-state";
import { Lock } from "lucide-react";

// Static prizes data
const PRIZES: Prize[] = [
  {
    id: "1",
    name: "Trophy",
    description: "A beautiful trophy to commemorate your achievement and celebrate your victory in the hackathon!",
  },
  {
    id: "2",
    name: "Brazilian Lunch",
    description: "Enjoy an authentic Brazilian lunch experience with traditional dishes and flavors!",
  },
];

export default function PrizesPage() {
  const [appState, setAppState] = useState<AppState | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAppState() {
      try {
        const response = await fetch("/api/app-state");
        const data = await response.json();
        setAppState(data);
      } catch (error) {
        console.error("Failed to fetch app state:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAppState();
  }, []);

  const isRevealed = appState?.started;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Prizes
        </h1>
        <p className="text-muted-foreground text-lg mb-8">
          {isRevealed
            ? "Amazing prizes await the winners of this hackathon!"
            : "Prizes will be revealed when the hackathon starts!"}
        </p>

        {loading ? (
          <p className="text-muted-foreground">Loading prizes...</p>
        ) : !isRevealed ? (
          <Card className="border-2 border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Lock className="w-16 h-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Prizes Locked</h3>
              <p className="text-muted-foreground text-center">
                Prize details will be revealed once the hackathon begins.
                <br />
                Stay tuned for exciting rewards!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {PRIZES.map((prize) => (
              <Card
                key={prize.id}
                className="hover:shadow-lg transition-all hover:-translate-y-1"
              >
                <CardHeader>
                  <CardTitle className="text-2xl mb-3">{prize.name}</CardTitle>
                  <CardDescription className="text-base">
                    {prize.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}

        {isRevealed && (
          <div className="mt-8 p-6 rounded-lg bg-muted/50 border border-border">
            <p className="text-sm text-muted-foreground text-center">
              Winners will be announced at the end of the hackathon. Good luck to all
              participants!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
