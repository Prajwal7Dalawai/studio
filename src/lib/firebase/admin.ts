
'use server';

import { collection, addDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import type { Event, Resource, PlacementContent } from '@/lib/types';

// Event Upload
type EventInput = Omit<Event, 'id' | 'createdAt' | 'participants' | 'status' | 'date' | 'winners'> & { date: string };
export const uploadEvent = async (eventData: EventInput, adminId: string) => {
    const eventDate = new Date(eventData.date);
    await addDoc(collection(db, 'events'), {
        ...eventData,
        date: Timestamp.fromDate(eventDate),
        status: eventDate > new Date() ? 'upcoming' : 'past',
        participants: [],
        winners: [],
        createdAt: serverTimestamp(),
        uploadedBy: adminId,
    });
};


// Resource Upload
type ResourceInput = Omit<Resource, 'id' | 'createdAt' | 'uploadedBy' | 'url'> & { file: File };
export const uploadResource = async (resourceData: ResourceInput, adminId: string) => {
    const { file, ...restOfData } = resourceData;

    // Upload file to Firebase Storage
    const storageRef = ref(storage, `resources/${adminId}/${Date.now()}-${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);

    // Add resource metadata to Firestore
    await addDoc(collection(db, 'resources'), {
        ...restOfData,
        url: downloadURL,
        uploadedBy: adminId,
        createdAt: serverTimestamp(),
    });
};

// Placement Content Upload
type PlacementContentInput = Omit<PlacementContent, 'id' | 'createdAt' | 'uploadedBy'>;
export const uploadPlacementContent = async (contentData: PlacementContentInput, adminId: string) => {
    await addDoc(collection(db, 'placementContent'), {
        ...contentData,
        uploadedBy: adminId,
        createdAt: serverTimestamp(),
    });
};
