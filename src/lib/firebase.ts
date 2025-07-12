import { getApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

function createFirebaseInstances() {
  let app: FirebaseApp;
  let auth: Auth;
  let db: Firestore;
  let storage: FirebaseStorage;
  let googleProvider: GoogleAuthProvider;

  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }

  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  googleProvider = new GoogleAuthProvider();

  return { app, auth, db, storage, googleProvider };
}

// Use lazy initialization to avoid issues in different environments
let firebaseInstances: ReturnType<typeof createFirebaseInstances>;

const getFirebaseInstances = () => {
  if (!firebaseInstances) {
    firebaseInstances = createFirebaseInstances();
  }
  return firebaseInstances;
};

export { getFirebaseInstances };
export const { app, auth, db, storage, googleProvider } = getFirebaseInstances();
