"use client";

import { useEffect, useState } from "react";
import { Competitor } from "@/lib/types/competitor";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { User } from "lucide-react";

export default function CompetitorsPage() {
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCompetitors() {
      try {
        const response = await fetch("/api/competitors");
        const data = await response.json();
        setCompetitors(data);
      } catch (error) {
        console.error("Failed to fetch competitors:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCompetitors();
  }, []);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Competitors
        </h1>
        <p className="text-muted-foreground text-lg mb-8">
          Meet the talented participants of this hackathon!
        </p>

        {loading ? (
          <p className="text-muted-foreground">Loading competitors...</p>
        ) : competitors.length === 0 ? (
          <p className="text-muted-foreground">
            No competitors yet. Add some from the admin panel.
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {competitors.map((competitor) => (
              <Card key={competitor._id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    {competitor.image ? (
                      <img
                        src={competitor.image}
                        alt={competitor.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                        <User className="w-8 h-8 text-white" />
                      </div>
                    )}
                    <div>
                      <CardTitle className="text-xl">{competitor.name}</CardTitle>
                    </div>
                  </div>
                  <div className="mt-3 space-y-2">
                    <p className="text-sm font-medium text-primary">
                      When approached about the hackathon:
                    </p>
                    <CardDescription>
                      {competitor.reason}
                    </CardDescription>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
