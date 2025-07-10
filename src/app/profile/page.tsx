
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, ShieldAlert } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { updateUserProfile } from '@/lib/firebase/firestore';

const branches = ["CSE", "ECE", "MECH", "CIVIL", "AIML", "DS"];
const semesters = ["1", "2", "3", "4", "5", "6", "7", "8"];

export default function ProfilePage() {
  const { user, loading, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    branch: '',
    semester: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        branch: user.branch || '',
        semester: user.year ? user.year.replace('th', '').replace('rd', '').replace('nd', '').replace('st', '') : '',
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };
  
  const handleSelectChange = (name: 'branch' | 'semester') => (value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSubmitting(true);
    try {
      await updateUserProfile(user.uid, {
        name: formData.name,
        branch: formData.branch,
        year: `${formData.semester}${['st', 'nd', 'rd'][Number(formData.semester) - 1] || 'th'}` as any,
      });
      toast({ title: 'Profile Updated', description: 'Your information has been saved successfully.' });
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast({ title: 'Update Failed', description: 'Could not update your profile. Please try again.', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container py-12 text-center">
        <ShieldAlert className="h-16 w-16 mx-auto text-destructive mb-4" />
        <h1 className="font-headline text-3xl font-bold">Access Denied</h1>
        <p className="text-muted-foreground mt-2">Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="container py-12 md:py-16">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="font-headline">Your Profile</CardTitle>
          <CardDescription>Update your personal and academic information here.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" value={formData.name} onChange={handleInputChange} placeholder="Your full name" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="branch">Branch</Label>
                <Select value={formData.branch} onValueChange={handleSelectChange('branch')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map((branch) => (
                      <SelectItem key={branch} value={branch}>{branch}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="semester">Semester</Label>
                 <Select value={formData.semester} onValueChange={handleSelectChange('semester')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your semester" />
                  </SelectTrigger>
                  <SelectContent>
                    {semesters.map((sem) => (
                      <SelectItem key={sem} value={sem}>{sem}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" value={user?.email || ''} disabled />
            </div>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Save Changes
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
