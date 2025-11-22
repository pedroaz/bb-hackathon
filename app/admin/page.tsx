"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Competitor } from "@/lib/types/competitor";
import { Challenge } from "@/lib/types/challenge";
import { AppState } from "@/lib/types/app-state";

function AdminPageContent() {
  const searchParams = useSearchParams();
  const key = searchParams.get("key");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [appState, setAppState] = useState<AppState | null>(null);
  const [selectedCompetitor, setSelectedCompetitor] = useState<string>("");
  const [selectedChallenge, setSelectedChallenge] = useState<string>("");

  useEffect(() => {
    if (key === "123") {
      fetchData();
    }
  }, [key]);

  const fetchData = async () => {
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
    }
  };

  const handleReset = async () => {
    if (
      !confirm(
        "Are you sure you want to reset the database? This will delete all data and create default competitors and challenges."
      )
    ) {
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/admin/reset", {
        method: "POST",
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(
          "✅ Database reset successfully! Pedro and Sasha have been added with 2 challenges."
        );
        fetchData();
      } else {
        setMessage(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      setMessage("❌ Failed to reset database. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteChallenge = async () => {
    if (!selectedCompetitor || !selectedChallenge) {
      setMessage("❌ Please select both a competitor and a challenge.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/admin/complete-challenge", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          competitorId: selectedCompetitor,
          challengeId: selectedChallenge,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(
          `✅ Challenge completed! ${data.pointsAwarded} points awarded.`
        );
        fetchData();
        setSelectedCompetitor("");
        setSelectedChallenge("");
      } else {
        setMessage(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      setMessage("❌ Failed to complete challenge. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleState = async () => {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/admin/toggle-state", {
        method: "POST",
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`✅ ${data.message}`);
        fetchData();
      } else {
        setMessage(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      setMessage("❌ Failed to toggle state. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSetting = async (setting: "show_points" | "show_challenges") => {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/admin/toggle-setting", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ setting }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`✅ ${data.message}`);
        fetchData();
      } else {
        setMessage(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      setMessage("❌ Failed to toggle setting. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (key !== "123") {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Access Denied
          </h1>
          <Card>
            <CardContent className="p-12">
              <p className="text-lg text-muted-foreground">
                You need the correct access key to view this page.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Please use the correct URL with the key parameter.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Admin Panel
        </h1>

        <Card>
          <CardHeader>
            <CardTitle>Hackathon State</CardTitle>
            <CardDescription>
              Control whether challenge descriptions are visible to participants.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted">
              <div>
                <p className="font-medium">
                  Current State:{" "}
                  <span
                    className={
                      appState?.started ? "text-green-600" : "text-orange-600"
                    }
                  >
                    {appState?.started ? "Started" : "Not Started"}
                  </span>
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {appState?.started
                    ? "Challenge descriptions are visible"
                    : "Challenge descriptions are hidden"}
                </p>
              </div>
            </div>
            <Button
              onClick={handleToggleState}
              disabled={loading}
              size="lg"
              className="w-full"
            >
              {loading
                ? "Updating..."
                : appState?.started
                ? "Pause Hackathon"
                : "Start Hackathon"}
            </Button>
          </CardContent>
        </Card>

        <Separator />

        <Card>
          <CardHeader>
            <CardTitle>Leaderboard Visibility</CardTitle>
            <CardDescription>
              Control what information is visible on the leaderboards.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                  <div>
                    <p className="font-medium text-sm">Show Points</p>
                    <p className="text-xs text-muted-foreground">
                      {appState?.show_points ? "Visible" : "Hidden"}
                    </p>
                  </div>
                  <Button
                    onClick={() => handleToggleSetting("show_points")}
                    disabled={loading}
                    variant={appState?.show_points ? "default" : "outline"}
                    size="sm"
                  >
                    {appState?.show_points ? "Hide" : "Show"}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                  <div>
                    <p className="font-medium text-sm">Show Challenges</p>
                    <p className="text-xs text-muted-foreground">
                      {appState?.show_challenges ? "Visible" : "Hidden"}
                    </p>
                  </div>
                  <Button
                    onClick={() => handleToggleSetting("show_challenges")}
                    disabled={loading}
                    variant={appState?.show_challenges ? "default" : "outline"}
                    size="sm"
                  >
                    {appState?.show_challenges ? "Hide" : "Show"}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Separator />

        <Card>
          <CardHeader>
            <CardTitle>Complete Challenge</CardTitle>
            <CardDescription>
              Select a competitor and a challenge they have completed to award
              points.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Competitor</label>
                <Select
                  value={selectedCompetitor}
                  onValueChange={setSelectedCompetitor}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select competitor" />
                  </SelectTrigger>
                  <SelectContent>
                    {competitors.map((competitor) => (
                      <SelectItem
                        key={competitor._id}
                        value={competitor._id || ""}
                      >
                        {competitor.name} ({competitor.points} pts)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Challenge</label>
                <Select
                  value={selectedChallenge}
                  onValueChange={setSelectedChallenge}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select challenge" />
                  </SelectTrigger>
                  <SelectContent>
                    {challenges.map((challenge) => (
                      <SelectItem
                        key={challenge._id}
                        value={challenge._id || ""}
                      >
                        {challenge.name} ({challenge.points} pts)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              onClick={handleCompleteChallenge}
              disabled={loading || !selectedCompetitor || !selectedChallenge}
              size="lg"
              className="w-full"
            >
              {loading ? "Processing..." : "Mark as Completed"}
            </Button>
          </CardContent>
        </Card>

        <Separator />

        <Card>
          <CardHeader>
            <CardTitle>Database Management</CardTitle>
            <CardDescription>
              Reset the database to its initial state with default competitors
              and challenges.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={handleReset}
              disabled={loading}
              size="lg"
              variant="destructive"
              className="w-full"
            >
              {loading ? "Resetting..." : "Reset Database"}
            </Button>
          </CardContent>
        </Card>

        {message && (
          <div className="p-4 rounded-md bg-muted">
            <p className="text-sm">{message}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-lg text-muted-foreground">Loading...</p>
        </div>
      </div>
    }>
      <AdminPageContent />
    </Suspense>
  );
}
