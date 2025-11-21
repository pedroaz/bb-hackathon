"use client";

import { useEffect, useState } from "react";
import { Competitor } from "@/lib/types/competitor";
import { Challenge } from "@/lib/types/challenge";
import { AppState } from "@/lib/types/app-state";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, Trophy, Medal } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LeaderboardsPage() {
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [appState, setAppState] = useState<AppState | null>(null);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [competitorsRes, challengesRes, appStateRes] = await Promise.all([
          fetch("/api/competitors"),
          fetch("/api/challenges"),
          fetch("/api/app-state"),
        ]);

        const competitorsData = await competitorsRes.json();
        const challengesData = await challengesRes.json();
        const appStateData = await appStateRes.json();

        setCompetitors(competitorsData);
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

  const toggleRow = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const getChallengeName = (challengeId: string) => {
    const challenge = challenges.find((c) => c._id === challengeId);
    return challenge?.name || "Unknown Challenge";
  };

  const getChallengePoints = (challengeId: string) => {
    const challenge = challenges.find((c) => c._id === challengeId);
    return challenge?.points || 0;
  };

  const sortedCompetitors = [...competitors].sort((a, b) => b.points - a.points);

  const getMedalIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-5 h-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <Medal className="w-5 h-5 text-amber-600" />;
    return null;
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Leaderboards
        </h1>
        <p className="text-muted-foreground text-lg mb-8">
          Current rankings from highest to lowest points!
        </p>

        {loading ? (
          <p className="text-muted-foreground">Loading leaderboards...</p>
        ) : competitors.length === 0 ? (
          <p className="text-muted-foreground">
            No competitors yet. Add some from the admin panel.
          </p>
        ) : (
          <div className="space-y-3">
            {sortedCompetitors.map((competitor, index) => {
              const rank = index + 1;
              const isExpanded = expandedRows.has(competitor._id || "");
              const hasCompletedChallenges = competitor.completedChallenges?.length > 0;

              return (
                <Card key={competitor._id} className="overflow-hidden">
                  <CardContent
                    className={cn(
                      "p-4 cursor-pointer hover:bg-muted/50 transition-colors",
                      hasCompletedChallenges && "cursor-pointer"
                    )}
                    onClick={() => hasCompletedChallenges && toggleRow(competitor._id || "")}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="flex items-center gap-2 min-w-[3rem]">
                          {getMedalIcon(rank)}
                          <span className="text-2xl font-bold text-muted-foreground">
                            #{rank}
                          </span>
                        </div>

                        <div className="flex-1">
                          <h3 className="text-lg font-semibold">{competitor.name}</h3>
                          {appState?.show_challenges && (
                            <p className="text-sm text-muted-foreground">
                              {competitor.completedChallenges?.length || 0} challenge
                              {competitor.completedChallenges?.length !== 1 ? "s" : ""} completed
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {appState?.show_points && (
                          <Badge className="text-lg px-4 py-2 bg-gradient-to-r from-primary to-accent text-white">
                            {competitor.points} pts
                          </Badge>
                        )}
                        {hasCompletedChallenges && appState?.show_challenges && (
                          <div>
                            {isExpanded ? (
                              <ChevronUp className="w-5 h-5 text-muted-foreground" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-muted-foreground" />
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {isExpanded && hasCompletedChallenges && appState?.show_challenges && (
                      <div className="mt-4 pt-4 border-t">
                        <h4 className="text-sm font-semibold mb-2 text-muted-foreground">
                          Completed Challenges:
                        </h4>
                        <div className="space-y-2">
                          {competitor.completedChallenges.map((challengeId) => (
                            <div
                              key={challengeId}
                              className="flex items-center justify-between p-2 rounded bg-muted/50"
                            >
                              <span className="text-sm">{getChallengeName(challengeId)}</span>
                              <Badge variant="secondary">{getChallengePoints(challengeId)} pts</Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
