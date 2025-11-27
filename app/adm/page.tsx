"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Yet another dummy page - this one pretends to check tokens but always fails
export default function FakeAdmPage() {
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Pretend to check authentication
    setTimeout(() => {
      setChecking(false);
      setMessage("Authentication failed. Access denied.");
    }, 1000);
  }, []);

  const handleRetry = async () => {
    setLoading(true);
    setMessage("");

    setTimeout(() => {
      setMessage("❌ Authentication failed. This endpoint is deprecated.");
      setLoading(false);
    }, 1500);
  };

  if (checking) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-lg text-muted-foreground">
            Verifying credentials...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto text-center space-y-6">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Administration
        </h1>
        <Card>
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground">
              Your session could not be verified.
            </p>
            <Button
              onClick={handleRetry}
              disabled={loading}
              size="lg"
              className="w-full"
            >
              {loading ? "Retrying..." : "Retry Authentication"}
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
