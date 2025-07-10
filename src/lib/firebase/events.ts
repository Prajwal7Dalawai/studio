
'use server';

import { doc, updateDoc, arrayUnion, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Event } from '@/lib/types';

export const registerForEvent = async (eventId: string, userId: string) => {
  if (!eventId || !userId) {
    throw new Error('Event ID and User ID are required.');
  }
  const eventRef = doc(db, 'events', eventId);
  
  // Fetch the current document
  const eventSnap = await getDoc(eventRef);

  if (!eventSnap.exists()) {
    throw new Error("Event not found!");
  }

  const eventData = eventSnap.data() as Event;

  // Manually update the participants array
  const participants = eventData.participants || [];
  if (!participants.includes(userId)) {
    participants.push(userId);
  }

  // Update the document with the new participants array
  await updateDoc(eventRef, {
    participants: participants,
  });
};
