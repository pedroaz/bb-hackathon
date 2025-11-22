"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Play, Pause, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ClockPage() {
  const [totalSeconds, setTotalSeconds] = useState(300); // Default 5 minutes
  const [remainingSeconds, setRemainingSeconds] = useState(300);
  const [isRunning, setIsRunning] = useState(false);
  const [inputMinutes, setInputMinutes] = useState("5");
  const [inputSeconds, setInputSeconds] = useState("0");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning && remainingSeconds > 0) {
      intervalRef.current = setInterval(() => {
        setRemainingSeconds((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            // Play completion sound
            playCompletionSound();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, remainingSeconds]);

  const playCompletionSound = () => {
    // Create a simple beep sound using Web Audio API
    if (typeof window !== "undefined") {
      const audioContext = new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = "sine";

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 1);
    }
  };

  const handleSetTime = () => {
    const mins = parseInt(inputMinutes) || 0;
    const secs = parseInt(inputSeconds) || 0;
    const total = mins * 60 + secs;

    if (total > 0) {
      setTotalSeconds(total);
      setRemainingSeconds(total);
      setIsRunning(false);
    }
  };

  const handleToggle = () => {
    if (remainingSeconds > 0) {
      setIsRunning(!isRunning);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setRemainingSeconds(totalSeconds);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return {
      minutes: String(mins).padStart(2, "0"),
      seconds: String(secs).padStart(2, "0"),
    };
  };

  const { minutes, seconds } = formatTime(remainingSeconds);
  const progress = totalSeconds > 0 ? (remainingSeconds / totalSeconds) * 100 : 0;

  // Determine urgency level for animations
  const getUrgencyLevel = () => {
    const percentage = (remainingSeconds / totalSeconds) * 100;
    if (remainingSeconds === 0) return "complete";
    if (percentage <= 10) return "critical";
    if (percentage <= 25) return "warning";
    return "normal";
  };

  const urgency = getUrgencyLevel();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-background via-background to-muted">
      <div className="w-full max-w-4xl space-y-8">
        <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Countdown Timer
        </h1>

        {/* Main Timer Display */}
        <div className="relative">
          <Card
            className={cn(
              "overflow-hidden transition-all duration-500",
              urgency === "complete" && "border-green-500 border-4 animate-pulse",
              urgency === "critical" && "border-red-500 border-4 animate-pulse",
              urgency === "warning" && "border-orange-500 border-2"
            )}
          >
            <CardContent className="p-12">
              <div
                className={cn(
                  "text-center transition-all duration-300",
                  urgency === "critical" && "animate-bounce"
                )}
              >
                <div
                  className={cn(
                    "text-9xl font-bold tabular-nums transition-colors duration-300",
                    urgency === "complete" && "text-green-500",
                    urgency === "critical" && "text-red-500",
                    urgency === "warning" && "text-orange-500",
                    urgency === "normal" && "text-foreground"
                  )}
                >
                  {minutes}:{seconds}
                </div>

                {/* Progress Bar */}
                <div className="mt-8 w-full h-4 bg-muted rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full transition-all duration-1000 ease-linear",
                      urgency === "complete" && "bg-green-500",
                      urgency === "critical" && "bg-red-500 animate-pulse",
                      urgency === "warning" && "bg-orange-500",
                      urgency === "normal" && "bg-gradient-to-r from-primary to-accent"
                    )}
                    style={{ width: `${progress}%` }}
                  />
                </div>

                {/* Status Message */}
                {urgency === "complete" && (
                  <div className="mt-6 text-2xl font-semibold text-green-500 animate-pulse">
                    Time&apos;s Up!
                  </div>
                )}
                {urgency === "critical" && isRunning && (
                  <div className="mt-6 text-xl font-semibold text-red-500 animate-pulse">
                    Final Countdown!
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Urgency Ring Effect */}
          {urgency === "critical" && isRunning && (
            <div className="absolute inset-0 -z-10">
              <div className="absolute inset-0 animate-ping bg-red-500/20 rounded-lg" />
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-4 justify-center items-center">
          <Button
            onClick={handleToggle}
            size="lg"
            className="min-w-[140px]"
            disabled={remainingSeconds === 0}
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5 mr-2" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-5 h-5 mr-2" />
                Start
              </>
            )}
          </Button>

          <Button onClick={handleReset} size="lg" variant="outline" className="min-w-[140px]">
            <RotateCcw className="w-5 h-5 mr-2" />
            Reset
          </Button>
        </div>

        {/* Time Input */}
        {!isRunning && (
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-center">Set Timer</h3>
              <div className="flex flex-wrap gap-4 justify-center items-end">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Minutes</label>
                  <Input
                    type="number"
                    min="0"
                    max="999"
                    value={inputMinutes}
                    onChange={(e) => setInputMinutes(e.target.value)}
                    className="w-24 text-center text-lg"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Seconds</label>
                  <Input
                    type="number"
                    min="0"
                    max="59"
                    value={inputSeconds}
                    onChange={(e) => setInputSeconds(e.target.value)}
                    className="w-24 text-center text-lg"
                  />
                </div>

                <Button onClick={handleSetTime} size="lg">
                  Set Time
                </Button>
              </div>

              {/* Quick Preset Buttons */}
              <div className="mt-6 flex flex-wrap gap-2 justify-center">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setInputMinutes("1");
                    setInputSeconds("0");
                  }}
                >
                  1 min
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setInputMinutes("5");
                    setInputSeconds("0");
                  }}
                >
                  5 min
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setInputMinutes("10");
                    setInputSeconds("0");
                  }}
                >
                  10 min
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setInputMinutes("15");
                    setInputSeconds("0");
                  }}
                >
                  15 min
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setInputMinutes("30");
                    setInputSeconds("0");
                  }}
                >
                  30 min
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
