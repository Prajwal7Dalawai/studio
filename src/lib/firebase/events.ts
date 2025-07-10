
'use server';

import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export const registerForEvent = async (eventId: string, userId: string) => {
  if (!eventId || !userId) {
    throw new Error('Event ID and User ID are required.');
  }
  const eventRef = doc(db, 'events', eventId);
  
  await updateDoc(eventRef, {
    participants: arrayUnion(userId),
  });
};
