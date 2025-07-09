"use client";

import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ShieldAlert, Loader2 } from "lucide-react";

export default function AdminPage() {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (user?.role !== 'admin') {
        return (
            <div className="container py-12 text-center">
                <ShieldAlert className="h-16 w-16 mx-auto text-destructive mb-4" />
                <h1 className="font-headline text-3xl font-bold">Access Denied</h1>
                <p className="text-muted-foreground mt-2">You do not have permission to view this page.</p>
            </div>
        )
    }

    return (
        <div className="container py-12 md:py-16">
            <div className="space-y-4 mb-12">
                <h1 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl">Admin Dashboard</h1>
                <p className="text-muted-foreground md:text-xl/relaxed">
                    Manage all content for CampusCompanion.
                </p>
            </div>

            <Tabs defaultValue="events" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="events">GDG Events</TabsTrigger>
                    <TabsTrigger value="resources">Academic Resources</TabsTrigger>
                    <TabsTrigger value="placement">Placement Content</TabsTrigger>
                </TabsList>
                <TabsContent value="events">
                    <AdminFormCard title="Upload New Event" description="Fill in the details for a new GDG event.">
                        <EventForm />
                    </AdminFormCard>
                </TabsContent>
                <TabsContent value="resources">
                    <AdminFormCard title="Upload New Resource" description="Upload notes or previous year question papers.">
                        <ResourceForm />
                    </AdminFormCard>
                </TabsContent>
                <TabsContent value="placement">
                    <AdminFormCard title="Update Placement Content" description="Add or edit content for the placement prep guide.">
                        <PlacementForm />
                    </AdminFormCard>
                </TabsContent>
            </Tabs>
        </div>
    );
}

function AdminFormCard({ title, description, children }: { title: string, description: string, children: React.ReactNode }) {
    return (
        <Card className="mt-6">
            <CardHeader>
                <CardTitle className="font-headline">{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                {children}
            </CardContent>
        </Card>
    )
}

function EventForm() {
    return (
        <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="event-title">Event Title</Label>
                    <Input id="event-title" placeholder="e.g., Next.js Conf" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="event-date">Event Date</Label>
                    <Input id="event-date" type="date" />
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="event-description">Description</Label>
                <Textarea id="event-description" placeholder="A brief summary of the event..."/>
            </div>
            <div className="space-y-2">
                <Label htmlFor="event-speakers">Speakers (comma-separated)</Label>
                <Input id="event-speakers" placeholder="e.g., Vercel, Google" />
            </div>
             <div className="space-y-2">
                <Label htmlFor="event-resources">Resource Link</Label>
                <Input id="event-resources" type="url" placeholder="https://example.com/resources" />
            </div>
            <Button type="submit">Upload Event</Button>
        </form>
    );
}

function ResourceForm() {
    return (
        <form className="space-y-4">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="res-title">Resource Title</Label>
                    <Input id="res-title" placeholder="e.g., DSA Final Notes" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="res-type">Resource Type</Label>
                    <Input id="res-type" placeholder="e.g., Notes or PYQ" />
                </div>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="res-branch">Branch</Label>
                    <Input id="res-branch" placeholder="e.g., CSE" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="res-semester">Semester</Label>
                    <Input id="res-semester" placeholder="e.g., 3" />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="res-subject">Subject</Label>
                    <Input id="res-subject" placeholder="e.g., Data Structures" />
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="res-url">Resource URL / File</Label>
                <Input id="res-url" type="file" />
            </div>
            <Button type="submit">Upload Resource</Button>
        </form>
    )
}

function PlacementForm() {
    return (
        <form className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="placement-year">Target Year</Label>
                <Input id="placement-year" placeholder="e.g., 2nd-year, 3rd-year" />
            </div>
             <div className="space-y-2">
                <Label htmlFor="placement-title">Content Title</Label>
                <Input id="placement-title" placeholder="e.g., Deep Dive into DSA" />
            </div>
             <div className="space-y-2">
                <Label htmlFor="placement-content">Content Body</Label>
                <Textarea id="placement-content" placeholder="Write the guidance here..."/>
            </div>
            <Button type="submit">Update Content</Button>
        </form>
    )
}
