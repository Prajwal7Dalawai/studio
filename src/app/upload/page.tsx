
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ShieldAlert, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { uploadEvent, uploadResource, uploadPlacementContent } from "@/lib/firebase/uploads";

// Schemas for form validation
const eventFormSchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters"),
    date: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date" }),
    description: z.string().min(10, "Description must be at least 10 characters"),
    speakers: z.string().min(1, "At least one speaker is required"),
    resources: z.string().url("Please enter a valid URL").optional().or(z.literal('')),
});

const resourceFormSchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters"),
    type: z.enum(["Notes", "PYQ"]),
    branch: z.string().min(1, "Branch is required"),
    semester: z.string().min(1, "Semester is required"),
    subject: z.string().min(2, "Subject is required"),
});

const placementFormSchema = z.object({
    targetYear: z.enum(["2nd-year", "3rd-year", "4th-year"]),
    title: z.string().min(5, "Title must be at least 5 characters"),
    content: z.string().min(20, "Content must be at least 20 characters"),
});

export default function UploadPage() {
    const { user, loading, isAuthenticated } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (!isAuthenticated) {
        return (
            <div className="container py-12 text-center">
                <ShieldAlert className="h-16 w-16 mx-auto text-destructive mb-4" />
                <h1 className="font-headline text-3xl font-bold">Access Denied</h1>
                <p className="text-muted-foreground mt-2">You must be logged in to upload content.</p>
            </div>
        )
    }

    return (
        <div className="container py-12 md:py-16">
            <div className="space-y-4 mb-12">
                <h1 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl">Upload Content</h1>
                <p className="text-muted-foreground md:text-xl/relaxed">
                    Contribute to the community by uploading resources.
                </p>
            </div>

            <Tabs defaultValue="resources" className="w-full">
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
    const { toast } = useToast();
    const { user } = useAuth();
    const form = useForm<z.infer<typeof eventFormSchema>>({
        resolver: zodResolver(eventFormSchema),
        defaultValues: { title: "", date: "", description: "", speakers: "", resources: "" },
    });

    async function onSubmit(values: z.infer<typeof eventFormSchema>) {
        if (!user) return;
        try {
            await uploadEvent({ ...values, speakers: values.speakers.split(',').map(s => s.trim()) }, user.uid);
            toast({ title: "Success", description: "Event uploaded successfully!" });
            form.reset();
        } catch (error) {
            console.error(error);
            toast({ title: "Error", description: "Failed to upload event.", variant: "destructive" });
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="title" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Event Title</FormLabel>
                            <FormControl><Input placeholder="e.g., Next.js Conf" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="date" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Event Date</FormLabel>
                            <FormControl><Input type="date" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                </div>
                <FormField control={form.control} name="description" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl><Textarea placeholder="A brief summary of the event..." {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="speakers" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Speakers (comma-separated)</FormLabel>
                        <FormControl><Input placeholder="e.g., Vercel, Google" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="resources" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Resource Link</FormLabel>
                        <FormControl><Input type="url" placeholder="https://example.com/resources" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Upload Event
                </Button>
            </form>
        </Form>
    );
}

function ResourceForm() {
    const { toast } = useToast();
    const { user } = useAuth();
    const form = useForm<z.infer<typeof resourceFormSchema>>({
        resolver: zodResolver(resourceFormSchema),
        defaultValues: { title: "", branch: "", semester: "", subject: "" },
    });

    async function onSubmit(values: z.infer<typeof resourceFormSchema>) {
        if (!user) return;
        try {
            await uploadResource(values, user.uid);
            toast({ title: "Success", description: "Resource uploaded successfully!" });
            form.reset();
        } catch (error) {
            console.error(error);
            toast({ title: "Error", description: "Failed to upload resource.", variant: "destructive" });
        }
    }
    
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="title" render={({ field }) => (
                        <FormItem><FormLabel>Resource Title</FormLabel><FormControl><Input placeholder="e.g., DSA Final Notes" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                     <FormField control={form.control} name="type" render={({ field }) => (
                        <FormItem><FormLabel>Resource Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl><SelectTrigger><SelectValue placeholder="Select resource type" /></SelectTrigger></FormControl>
                                <SelectContent><SelectItem value="Notes">Notes</SelectItem><SelectItem value="PYQ">Question Paper (PYQ)</SelectItem></SelectContent>
                            </Select>
                        <FormMessage /></FormItem>
                    )} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField control={form.control} name="branch" render={({ field }) => (
                        <FormItem><FormLabel>Branch</FormLabel><FormControl><Input placeholder="e.g., CSE" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="semester" render={({ field }) => (
                        <FormItem><FormLabel>Semester</FormLabel><FormControl><Input type="number" placeholder="e.g., 3" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="subject" render={({ field }) => (
                        <FormItem><FormLabel>Subject</FormLabel><FormControl><Input placeholder="e.g., Data Structures" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Upload Resource
                </Button>
            </form>
        </Form>
    )
}

function PlacementForm() {
    const { toast } = useToast();
    const { user } = useAuth();
    const form = useForm<z.infer<typeof placementFormSchema>>({
        resolver: zodResolver(placementFormSchema),
    });

    async function onSubmit(values: z.infer<typeof placementFormSchema>) {
         if (!user) return;
        try {
            await uploadPlacementContent(values, user.uid);
            toast({ title: "Success", description: "Placement content uploaded successfully!" });
            form.reset();
        } catch (error) {
            console.error(error);
            toast({ title: "Error", description: "Failed to upload content.", variant: "destructive" });
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                 <FormField control={form.control} name="targetYear" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Target Year</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Select target year" /></SelectTrigger></FormControl>
                            <SelectContent>
                                <SelectItem value="2nd-year">2nd Year</SelectItem>
                                <SelectItem value="3rd-year">3rd Year</SelectItem>
                                <SelectItem value="4th-year">4th Year</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="title" render={({ field }) => (
                    <FormItem><FormLabel>Content Title</FormLabel><FormControl><Input placeholder="e.g., Deep Dive into DSA" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="content" render={({ field }) => (
                    <FormItem><FormLabel>Content Body</FormLabel><FormControl><Textarea placeholder="Write the guidance here..." rows={8} {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Update Content
                </Button>
            </form>
        </Form>
    )
}

    

    