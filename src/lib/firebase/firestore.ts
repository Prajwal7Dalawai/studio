
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  serverTimestamp,
  type Timestamp,
} from 'firebase/firestore';
import type { User as FirebaseUser } from 'firebase/auth';
import { db } from '@/lib/firebase';
import type { User } from '@/lib/types';

export const upsertUser = async (firebaseUser: FirebaseUser) => {
  const userRef = doc(db, 'users', firebaseUser.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    // User is new, create a new document
    const { uid, email, displayName, photoURL } = firebaseUser;
    const isAdmin = email === process.env.NEXT_PUBLIC_FIREBASE_ADMIN_EMAIL;

    const newUser: User = {
      uid,
      email,
      name: displayName,
      photoURL,
      role: isAdmin ? 'admin' : 'student',
      createdAt: serverTimestamp() as Timestamp,
    };

    await setDoc(userRef, newUser);
    return { ...newUser, createdAt: new Date() as any }; // Return a client-side friendly object
  } else {
    // User exists, return existing data
    return userSnap.data() as User;
  }
};

export const updateUserProfile = async (uid: string, data: Partial<User>) => {
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, data);
};
