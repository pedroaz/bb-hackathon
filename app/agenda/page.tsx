import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Users, Lightbulb, Trophy } from "lucide-react";

const agendaItems = [
  {
    time: "17:00",
    title: "We Gather",
    description: "Welcome and registration. Meet your fellow competitors!",
    icon: Users,
  },
  {
    time: "17:15",
    title: "Ideas Are Presented",
    description: "Pitch your ideas and hear what others have in mind.",
    icon: Lightbulb,
  },
  {
    time: "17:15 - 17:30",
    title: "Groups Are Formed",
    description: "Team up with other participants and form your hackathon squad.",
    icon: Users,
  },
  {
    time: "18:00",
    title: "Event 1",
    description: "Details will be announced at the event!",
    icon: Trophy,
  },
  {
    time: "18:30",
    title: "Event 2",
    description: "Details will be announced at the event!",
    icon: Trophy,
  },
  {
    time: "19:00",
    title: "Event 3",
    description: "Details will be announced at the event!",
    icon: Trophy,
  },
];

export default function AgendaPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Agenda
        </h1>
        <p className="text-muted-foreground text-lg mb-8">
          Follow the event schedule and don't miss any activities!
        </p>

        <div className="space-y-4">
          {agendaItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex items-center gap-1.5 text-primary font-semibold">
                          <Clock className="w-4 h-4" />
                          <span>{item.time}</span>
                        </div>
                        <h3 className="text-xl font-semibold">{item.title}</h3>
                      </div>
                      <p className="text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
