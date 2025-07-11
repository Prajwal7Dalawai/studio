'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookCopy, Bot, Calendar, GraduationCap, Users, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="font-headline text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Your Ultimate <span className="text-primary">CampusCompanion</span>
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    One-stop platform for GDG events, academic resources, placement preparation, and an AI assistant to guide you.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg">
                    <Link href="/events">Explore Now</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href="/login">Join Us</Link>
                  </Button>
                </div>
              </div>
              <Image
                src="https://imgs.search.brave.com/19LXuTCTt875O7ULKcnK0SkmuarX0sP8LCE0qX_e7GY/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jZG4u/bW9zLmNtcy5mdXR1/cmVjZG4ubmV0L0RG/UWVKTlFqUEd0Zm4y/WUd5QWtvcTcuanBn"
                width="600"
                height="400"
                alt="Hero"
                data-ai-hint="students collaboration"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
              />
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">Key Features</div>
                <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-5xl">Everything a Student Needs</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  We've packed CampusCompanion with features to help you succeed in your academic and professional life.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 lg:max-w-none mt-12">
              <FeatureCard
                icon={<Calendar className="w-8 h-8 text-primary" />}
                title="GDG Events"
                description="Stay updated with all upcoming and past GDG events. Access resources, see winners, and more."
                link="/events"
              />
              <FeatureCard
                icon={<BookCopy className="w-8 h-8 text-primary" />}
                title="Academic Hub"
                description="Find notes and previous year questions filtered by branch, semester, and subject."
                link="/resources"
              />
              <FeatureCard
                icon={<Users className="w-8 h-8 text-primary" />}
                title="Placement Prep"
                description="Tailored guidance for 2nd, 3rd, and 4th-year students to crack placements."
                link="/placement"
              />
              <FeatureCard
                icon={<Bot className="w-8 h-8 text-primary" />}
                title="AI Assistant"
                description="Your personal AI helper for quick answers and guidance on your academic journey."
                link="/assist-me"
              />
              <FeatureCard
                icon={<GraduationCap className="w-8 h-8 text-primary" />}
                title="User Profiles"
                description="Personalized experience based on your year and branch after you sign in."
                link="/login"
              />
              <FeatureCard
                icon={<ShieldCheck className="w-8 h-8 text-primary" />}
                title="Admin Dashboard"
                description="A dedicated panel for admins to manage and upload all content seamlessly."
                link="/admin"
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function FeatureCard({ icon, title, description, link }: { icon: React.ReactNode, title: string, description: string, link: string }) {
  return (
    <div className="grid gap-1">
      <div className="flex items-center gap-4">
        {icon}
        <h3 className="font-headline text-xl font-bold">{title}</h3>
      </div>
      <p className="text-muted-foreground">{description}</p>
      <Button variant="link" asChild className="p-0 justify-start">
        <Link href={link}>Learn more &rarr;</Link>
      </Button>
    </div>
  )
}
