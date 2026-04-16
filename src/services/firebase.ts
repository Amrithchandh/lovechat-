import { initializeApp } from "firebase/app";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import type { FirebaseStorage } from "firebase/storage";
import type { Firestore } from "firebase/firestore";
import type { Auth } from "firebase/auth";

// REPLACE WITH YOUR FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

let app;
let db: Firestore;
let auth: Auth;
let storage: FirebaseStorage;

try {
  if (firebaseConfig.apiKey !== "YOUR_API_KEY") {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    storage = getStorage(app);

    // Enable offline persistence
    enableIndexedDbPersistence(db).catch((err) => {
      console.warn('Persistence error:', err.code);
    });
  } else {
    console.warn("Firebase config not set. Offline mode or mock data might be needed.");
  }
} catch (error) {
  console.error("Firebase initialization failed:", error);
}

export { db, auth, storage };
export default app;
