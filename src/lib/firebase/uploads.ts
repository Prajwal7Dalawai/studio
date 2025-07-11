
'use server';

import { collection, addDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { getFirebaseInstances } from '@/lib/firebase';
import type { Event, Resource, PlacementContent } from '@/lib/types';

const { db } = getFirebaseInstances();

// Event Upload
type EventInput = Omit<Event, 'id' | 'createdAt' | 'participants' | 'status' | 'date' | 'winners'> & { date: string };
export const uploadEvent = async (eventData: EventInput, userId: string) => {
    const eventDate = new Date(eventData.date);
    await addDoc(collection(db, 'events'), {
        ...eventData,
        date: Timestamp.fromDate(eventDate),
        status: eventDate > new Date() ? 'upcoming' : 'past',
        participants: [], // Explicitly initialize as an empty array
        winners: [],
        createdAt: serverTimestamp(),
        uploadedBy: userId,
    });
};


// Resource Upload
type ResourceInput = Omit<Resource, 'id' | 'createdAt' | 'uploadedBy' | 'url'>;
export const uploadResource = async (resourceData: ResourceInput, userId: string) => {
    // Add resource metadata to Firestore with a dummy URL
    await addDoc(collection(db, 'resources'), {
        ...resourceData,
        url: "#", // Using a dummy link as requested
        uploadedBy: userId,
        createdAt: serverTimestamp(),
    });
};

// Placement Content Upload
type PlacementContentInput = Omit<PlacementContent, 'id' | 'createdAt' | 'uploadedBy'>;
export const uploadPlacementContent = async (contentData: PlacementContentInput, userId: string) => {
    await addDoc(collection(db, 'placementContent'), {
        ...contentData,
        uploadedBy: userId,
        createdAt: serverTimestamp(),
    });
};
