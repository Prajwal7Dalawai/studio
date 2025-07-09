import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Calendar, User } from "lucide-react";

const events = [
  { id: 1, title: "Next.js 15 Deep Dive", date: "2024-10-26", description: "Explore the latest features of Next.js 15 with our expert speakers.", status: "upcoming", speakers: ["Lee Robinson"], winners: [], resources: "#" },
  { id: 2, title: "AI with Gemini Workshop", date: "2024-09-15", description: "A hands-on workshop on building applications with Google's Gemini API.", status: "past", speakers: ["Debbie O'Brien"], winners: ["Team Innovate"], resources: "#" },
  { id: 3, title: "Firebase for Startups", date: "2024-08-20", description: "Learn how to leverage Firebase to build and scale your startup.", status: "past", speakers: ["Frank van Puffelen"], winners: ["Team ScaleUp"], resources: "#" },
  { id: 4, title: "Flutter Festival", date: "2025-01-18", description: "Join us for a full day of talks and codelabs on Flutter and Dart.", status: "upcoming", speakers: ["Majid Hajian", "Rody Davis"], winners: [], resources: "#" },
];

export default function EventsPage() {
  const upcomingEvents = events.filter(e => e.status === 'upcoming');
  const pastEvents = events.filter(e.status === 'past');

  return (
    <div className="container py-12 md:py-16">
      <div className="space-y-4 mb-12 text-center">
        <h1 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">GDG Events</h1>
        <p className="max-w-[700px] mx-auto text-muted-foreground md:text-xl/relaxed">
          Discover upcoming events and revisit talks and resources from past ones.
        </p>
      </div>

      <div className="space-y-12">
        <section className="flex flex-col items-center">
          <h2 className="font-headline text-2xl font-bold mb-6">Upcoming Events</h2>
          {upcomingEvents.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {upcomingEvents.map(event => <EventCard key={event.id} event={event} />)}
            </div>
          ) : (
            <p className="text-muted-foreground">No upcoming events. Check back soon!</p>
          )}
        </section>

        <section className="flex flex-col items-center">
          <h2 className="font-headline text-2xl font-bold mb-6">Past Events</h2>
           {pastEvents.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {pastEvents.map(event => <EventCard key={event.id} event={event} />)}
            </div>
          ) : (
            <p className="text-muted-foreground">No past events to show.</p>
          )}
        </section>
      </div>
    </div>
  );
}

function EventCard({ event }: { event: (typeof events)[0] }) {
  return (
    <Card className="flex flex-col h-full overflow-hidden transition-transform transform-gpu hover:scale-[1.02] hover:shadow-xl">
      <CardHeader>
        {event.status === 'upcoming' ? (
          <Badge className="w-fit">Upcoming</Badge>
        ) : (
          <Badge variant="secondary" className="w-fit">Past Event</Badge>
        )}
        <CardTitle className="font-headline pt-2">{event.title}</CardTitle>
        <CardDescription className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4" />
            {new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-muted-foreground line-clamp-3">{event.description}</p>
        <div className="mt-4">
            <h4 className="text-sm font-semibold mb-2">Speakers</h4>
            <div className="flex flex-wrap gap-2">
                {event.speakers.map(speaker => (
                    <Badge variant="outline" key={speaker} className="flex items-center gap-2">
                        <User className="w-3 h-3"/>
                        {speaker}
                    </Badge>
                ))}
            </div>
        </div>
        {event.winners.length > 0 && (
             <div className="mt-4">
                <h4 className="text-sm font-semibold mb-2">Winners</h4>
                <div className="flex flex-wrap gap-2">
                    {event.winners.map(winner => (
                        <Badge variant="outline" key={winner} className="text-amber-600 border-amber-500">
                            🏆 {winner}
                        </Badge>
                    ))}
                </div>
            </div>
        )}
      </CardContent>
      <CardFooter>
        <Button asChild variant="link" className="p-0">
          <Link href={event.resources}>
            View Resources <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
