
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Calendar, User, CheckCircle, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { registerForEvent } from "@/lib/firebase/events";
import { collection, getDocs, onSnapshot, query, orderBy, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Event as EventType } from "@/lib/types";

// Convert Firestore timestamp to a JS Date object, handling different timestamp formats.
const toDate = (timestamp: Timestamp | Date): Date => {
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate();
  }
  return timestamp;
};

export default function EventsPage() {
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "events"), orderBy("date", "desc"));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedEvents: EventType[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        fetchedEvents.push({ 
            id: doc.id,
            ...data,
            date: toDate(data.date as Timestamp)
        } as EventType);
      });
      setEvents(fetchedEvents);
      setLoading(false);
    }, (error) => {
        console.error("Error fetching events: ", error);
        setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  const upcomingEvents = events.filter(e => e.status === 'upcoming');
  const pastEvents = events.filter(e => e.status === 'past');

  return (
    <div className="container py-12 md:py-16">
      <div className="space-y-4 mb-12 text-center">
        <h1 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">GDG Events</h1>
        <p className="max-w-[700px] mx-auto text-muted-foreground md:text-xl/relaxed">
          Discover upcoming events and revisit talks and resources from past ones.
        </p>
      </div>

      <div className="space-y-12">
        <section>
          <h2 className="font-headline text-2xl font-bold mb-6 text-center">Upcoming Events</h2>
          {upcomingEvents.length > 0 ? (
            <div className="flex justify-center">
              <div className="inline-grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {upcomingEvents.map(event => <EventCard key={event.id} event={event} />)}
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground text-center">No upcoming events. Check back soon!</p>
          )}
        </section>

        <section>
          <h2 className="font-headline text-2xl font-bold mb-6 text-center">Past Events</h2>
           {pastEvents.length > 0 ? (
            <div className="flex justify-center">
              <div className="inline-grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {pastEvents.map(event => <EventCard key={event.id} event={event} />)}
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground text-center">No past events to show.</p>
          )}
        </section>
      </div>
    </div>
  );
}

function EventCard({ event }: { event: EventType }) {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [isRegistering, setIsRegistering] = useState(false);
  
  const isRegistered = user && event.participants ? event.participants.includes(user.uid) : false;

  const handleRegister = async () => {
    if (!isAuthenticated || !user) {
      toast({ title: "Please login to register.", variant: "destructive" });
      return;
    }
    setIsRegistering(true);
    try {
      await registerForEvent(event.id, user.uid);
      toast({ title: "Successfully registered!", description: `You are now registered for ${event.title}.` });
    } catch (error) {
      console.error("Registration failed", error);
      toast({ title: "Registration failed", description: "Please try again later.", variant: "destructive" });
    } finally {
      setIsRegistering(false);
    }
  };
  
  const eventDate = toDate(event.date);

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
            {eventDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
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
        {event.winners && event.winners.length > 0 && (
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
      <CardFooter className="flex justify-between items-center">
        {event.status === 'upcoming' && (
          isRegistered ? (
            <Button disabled variant="secondary" className="cursor-default">
              <CheckCircle className="mr-2 h-4 w-4" />
              Registered
            </Button>
          ) : (
            <Button onClick={handleRegister} disabled={isRegistering}>
              {isRegistering ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Register
            </Button>
          )
        )}
        <Button asChild variant="link" className="p-0">
          <Link href={event.resources || '#'}>
            View Resources <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
