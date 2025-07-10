
import type { Timestamp } from 'firebase/firestore';

export type User = {
  uid: string;
  email: string | null;
  name: string | null;
  photoURL: string | null;
  role: 'admin' | 'student';
  year?: '1st' | '2nd' | '3rd' | '4th';
  branch?: string;
  createdAt: Timestamp;
};

export type Event = {
  id: string;
  title: string;
  date: Timestamp;
  description: string;
  status: 'upcoming' | 'past';
  participants: string[];
  speakers: string[];
  winners: string[];
  resources?: string;
  createdAt: Timestamp;
};

export type Resource = {
  id: string;
  title: string;
  type: 'Notes' | 'PYQ';
  branch: string;
  semester: string;
  subject: string;
  url: string;
  uploadedBy: string;
  createdAt: Timestamp;
};

export type PlacementContent = {
  id: string;
  targetYear: '2nd-year' | '3rd-year' | '4th-year';
  title: string;
  content: string;
  createdAt: Timestamp;
  uploadedBy: string;
};
