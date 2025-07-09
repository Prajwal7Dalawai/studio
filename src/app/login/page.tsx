"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Logo } from "@/components/logo";

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  const handleLogin = (role: 'student' | 'admin') => {
    login(role);
  };
  
  const GoogleIcon = () => (
    <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
      <path fill="currentColor" d="M488 261.8C488 403.3 381.5 512 244 512S0 403.3 0 261.8C0 120.3 106.5 8 244 8s244 112.3 244 253.8zM147.2 344.8c-10.9 28.3-25.2 53.6-43.2 74.9-18.4 21.8-40.2 38.8-64.4 50.4C69.4 492.3 98.7 504 129.8 504c26.3 0 51.2-6.5 73.1-17.9l.1 .1C223.3 439 256 365.1 256 261.8c0-1.8 0-3.6 0-5.4-2.2 2-4.4 4-6.6 5.9-20.9 18.4-46.1 31.3-73.1 38.3-27 7-55.3 8.3-82.3 4.2zM244 288c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.5 48-48 48zm0-112c-35.3 0-64 28.7-64 64s28.7 64 64 64 64-28.7 64-64-28.7-64-64-64zm201.2 121.3c-2.4-7.2-5-14.2-7.9-21-22.1-49.8-57.5-88.7-101.9-115.3-20.7-12.4-43.3-21.6-67.4-27.3-3.2-.8-6.4-1.5-9.6-2.2-12.7-2.8-25.7-4.3-39.1-4.3C80.2 91.5 32 165.3 32 261.8c0 10.3 1 20.4 2.9 30.2 11.2-12.1 23.9-22.9 37.8-32.3 34.3-23.1 75.3-35.7 118.3-35.7 43 0 84 12.6 118.3 35.7 14 9.4 26.7 20.2 37.8 32.3 1.9-9.8 2.9-19.9 2.9-30.2-.1-3 .1-6.1 .1-9.2z"></path>
    </svg>
  );

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-muted/40 px-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <Logo />
          </div>
          <CardTitle className="font-headline text-2xl">Welcome Back</CardTitle>
          <CardDescription>
            Sign in to access your personalized dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Button onClick={() => handleLogin('student')} variant="outline" className="w-full">
            <GoogleIcon /> Continue as Student
          </Button>
          <Button onClick={() => handleLogin('admin')} variant="outline" className="w-full">
            <GoogleIcon /> Continue as Admin
          </Button>
          <p className="text-center text-xs text-muted-foreground">
              This is a mock login for demonstration purposes.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
