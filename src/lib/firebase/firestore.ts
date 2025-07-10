
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
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
    // User exists, just update their photoURL and name in case it changed
    const existingData = userSnap.data() as User;
    const updatedData: Partial<User> = {};
    if (existingData.name !== firebaseUser.displayName) {
      updatedData.name = firebaseUser.displayName;
    }
    if (existingData.photoURL !== firebaseUser.photoURL) {
      updatedData.photoURL = firebaseUser.photoURL;
    }

    if (Object.keys(updatedData).length > 0) {
      await updateDoc(userRef, updatedData);
    }
    
    return { ...existingData, ...updatedData };
  }
};

export const updateUserProfile = async (uid: string, data: Partial<User>) => {
  if (!uid) {
    throw new Error("User ID is required to update profile.");
  }
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, data);
};
