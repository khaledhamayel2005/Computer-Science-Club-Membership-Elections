import { initializeApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};
export const firebaseConfigured = Object.values(config).every(Boolean);
export const adminConfig = {
  username: import.meta.env.VITE_ADMIN_USERNAME || "",
  email: import.meta.env.VITE_ADMIN_EMAIL || "",
  uid: import.meta.env.VITE_ADMIN_UID || ""
};
export const adminConfigured = Object.values(adminConfig).every(Boolean);
let authInstance: Auth | null = null;
let dbInstance: Firestore | null = null;
let initializationError = "";
if (firebaseConfigured && adminConfigured) {
  try {
    const app = initializeApp(config);
    authInstance = getAuth(app);
    dbInstance = getFirestore(app);
  } catch (error) {
    initializationError = error instanceof Error ? error.message : "تعذر تهيئة Firebase";
  }
} else {
  initializationError = "إعدادات الاتصال الآمن غير مكتملة";
}
export const firebaseReady = Boolean(authInstance && dbInstance);
export const firebaseInitializationError = initializationError;
export const auth = authInstance as Auth;
export const db = dbInstance as Firestore;
export const ELECTION_ID = "ai-125";
