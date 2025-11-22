import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Users, Target, Calendar, Gift } from "lucide-react";

const navigationCards = [
  {
    title: "Competitors",
    description: "View all hackathon participants",
    href: "/competitors",
    icon: Users,
    gradient: "from-primary to-primary/70",
  },
  {
    title: "Leaderboards",
    description: "Check the current rankings",
    href: "/leaderboards",
    icon: Trophy,
    gradient: "from-accent to-accent/70",
  },
  {
    title: "Challenges",
    description: "View all available challenges",
    href: "/challenges",
    icon: Target,
    gradient: "from-primary to-accent",
  },
  {
    title: "Prizes",
    description: "Discover amazing rewards",
    href: "/prizes",
    icon: Gift,
    gradient: "from-accent/70 to-primary/70",
  },
  {
    title: "Agenda",
    description: "See the event schedule",
    href: "/agenda",
    icon: Calendar,
    gradient: "from-accent to-primary",
  },
];

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-8">
      <div className="max-w-5xl w-full space-y-12">
        <div className="flex flex-col items-center space-y-6 text-center">
          <div className="space-y-2">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-fade-in">
              Berlin Byes Hackathon
            </h1>
            <p className="text-muted-foreground text-lg">
              Innovation, Collaboration, Excellence
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
          {navigationCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link key={card.href} href={card.href}>
                <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer border-2 hover:border-primary">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div
                        className={`p-3 rounded-lg bg-gradient-to-br ${card.gradient} group-hover:scale-110 transition-transform duration-300`}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-1 group-hover:text-primary transition-colors">
                          {card.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {card.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
