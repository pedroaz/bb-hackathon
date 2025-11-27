"use client";

import { useState, useEffect, Suspense } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Competitor } from "@/lib/types/competitor";
import { Challenge } from "@/lib/types/challenge";
import { AppState } from "@/lib/types/app-state";

function AdminPageContent() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [appState, setAppState] = useState<AppState | null>(null);
  const [selectedCompetitors, setSelectedCompetitors] = useState<string[]>([]);
  const [selectedChallenge, setSelectedChallenge] = useState<string>("");
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/admin/verify");
      const data = await response.json();

      if (data.authorized) {
        setIsAuthorized(true);
        fetchData();
      } else {
        setIsAuthorized(false);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setIsAuthorized(false);
    }
  };

  const requestToken = async () => {
    setLoading(true);
    try {
      await fetch("/api/auth/token", { method: "POST" });
      setMessage(
        "Token generated! However, you only have 'user' access. You need 'admin' access to proceed."
      );
      // Recheck auth after getting token
      setTimeout(() => checkAuth(), 500);
    } catch (error) {
      setMessage("Failed to generate token");
    } finally {
      setLoading(false);
    }
  };

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
    if (selectedCompetitors.length === 0 || !selectedChallenge) {
      setMessage("❌ Please select at least one competitor and a challenge.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      // Process each competitor sequentially
      const results = [];
      for (const competitorId of selectedCompetitors) {
        const response = await fetch("/api/admin/complete-challenge", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            competitorId,
            challengeId: selectedChallenge,
          }),
        });

        const data = await response.json();
        results.push({
          success: response.ok,
          competitorId,
          data,
        });
      }

      // Check results
      const successCount = results.filter((r) => r.success).length;
      const failCount = results.length - successCount;

      if (successCount > 0) {
        const totalPoints = results
          .filter((r) => r.success)
          .reduce((sum, r) => sum + (r.data.pointsAwarded || 0), 0);
        setMessage(
          `✅ Challenge completed for ${successCount} competitor(s)! ${totalPoints} total points awarded.${failCount > 0 ? ` ${failCount} failed.` : ""
          }`
        );
        fetchData();
        setSelectedCompetitors([]);
        setSelectedChallenge("");
      } else {
        setMessage(`❌ Failed to complete challenge for all selected competitors.`);
      }
    } catch (error) {
      setMessage("❌ Failed to complete challenge. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleCompetitor = (competitorId: string) => {
    setSelectedCompetitors((prev) =>
      prev.includes(competitorId)
        ? prev.filter((id) => id !== competitorId)
        : [...prev, competitorId]
    );
  };

  const selectAllCompetitors = () => {
    if (selectedCompetitors.length === competitors.length) {
      setSelectedCompetitors([]);
    } else {
      setSelectedCompetitors(competitors.map((c) => c._id || "").filter(Boolean));
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

  if (isAuthorized === null) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-lg text-muted-foreground">Checking authorization...</p>
        </div>
      </div>
    );
  }

  if (isAuthorized === false) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Admin Access Required
          </h1>
          <Card>
            <CardContent className="p-12 space-y-6">
              <p className="text-lg text-muted-foreground">
                You need admin authentication to access this panel.
              </p>
              <Button
                onClick={requestToken}
                disabled={loading}
                size="lg"
                className="w-full"
              >
                {loading ? "Generating..." : "Request Access Token"}
              </Button>
              {message && (
                <div className="p-4 rounded-md bg-muted">
                  <p className="text-sm">{message}</p>
                </div>
              )}
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
              Select competitors and a challenge to award points to multiple people at once.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">
                    Competitors ({selectedCompetitors.length} selected)
                  </label>
                  <Button
                    onClick={selectAllCompetitors}
                    variant="outline"
                    size="sm"
                    type="button"
                  >
                    {selectedCompetitors.length === competitors.length
                      ? "Deselect All"
                      : "Select All"}
                  </Button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 p-4 rounded-lg bg-muted/50 max-h-[400px] overflow-y-auto">
                  {competitors.map((competitor) => (
                    <div
                      key={competitor._id}
                      className={`flex items-center space-x-3 p-3 rounded-md border-2 transition-colors cursor-pointer hover:bg-background/80 ${selectedCompetitors.includes(competitor._id || "")
                        ? "border-primary bg-primary/5"
                        : "border-border bg-background"
                        }`}
                      onClick={() => toggleCompetitor(competitor._id || "")}
                    >
                      <Checkbox
                        checked={selectedCompetitors.includes(competitor._id || "")}
                        onCheckedChange={() => toggleCompetitor(competitor._id || "")}
                        className="pointer-events-none"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {competitor.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {competitor.points} pts
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
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
              disabled={loading || selectedCompetitors.length === 0 || !selectedChallenge}
              size="lg"
              className="w-full"
            >
              {loading ? "Processing..." : `Mark as Completed for ${selectedCompetitors.length} Competitor${selectedCompetitors.length !== 1 ? "s" : ""}`}
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
